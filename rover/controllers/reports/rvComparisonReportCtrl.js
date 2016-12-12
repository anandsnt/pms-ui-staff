angular.module('sntRover')
.controller('RVComparisonReport.Controller', [
    '$rootScope',
    '$scope',
    '$filter',
    'RVReportUtilsFac',
    'RVReportMsgsConst',
    '$timeout',
    'RVreportsSubSrv',
    function (
        $rootScope,
        $scope,
        $filter,
        RVReportUtilsFac,
        RVReportMsgsConst,
        $timeout,
        RVreportsSubSrv
    ) {

        var currencySymbol = $rootScope.currencySymbol;
        var reInitDelay = 50;
        var reportSubmited, reportPrinting, reportUpdated, reportPageChanged;

        /** Starting data store composition section for storing CGs */

        /**
         * getter - generates a get method. this is similar to a get prototype method
         *
         * @param  {object} data - the hidden store
         * @returns {function}     the implementation of get function
         */
        var getter = function(data) {
            return {
                get: function(key) {
                    return data[key] || undefined;
                }
            };
        };

        /**
         * setter - generates a set method. this is similar to a set prototype method
         *
         * @param  {object} data - the hidden store
         * @returns {function}     the implementation of set function
         */
        var setter = function (data) {
            return {
                set: function (key, value) {
                    data[key] = value;
                    return data[key];
                }
            };
        };

        /**
         * ccStore - the actual store object generated via composition
         *
         * @returns {object}     a normal object that gets and sets internal data
         */
        var ccStore = function () {
            var data = {};

            return _.extend(
                {},
                getter(data),
                setter(data)
            );
        };

        /** Ending data store composition section for storing CGs */


        /**
         * insetAllChargeCodes - loop through the charge group data and inset any found charge codes
         * that have been fetched already. The function would be called while printing
         *
         * @param  {array} source array of charge groups
         * @returns {array}        modified array with charge code inserted
         */
        function insetAllChargeCodes (source) {
            var newSource = [];
            var match;

            angular.forEach(source, function(item) {
                match = ccStore.get(item.id);

                if ( angular.isDefined(match) ) {
                    newSource.push(item);
                    angular.forEach(match, function(each) {
                        newSource.push(each);
                    });
                    newSource.push({
                        isChargeCodePagination: true
                    });
                } else {
                    newSource.push(item);
                }
            });

            return newSource;
        }

        /**
         * insertOneChargeCode - inset one particular charge code set into the change group dataset
         * This will be called after every charge code fetch.
         *
         * @param  {array} source array of charge groups
         * @param  {nuber|string} cgId   the charge group id
         * @returns {array}        modified array with charge codes inserted
         */
        function insertOneChargeCode (source, cgId) {
            var newSource = [];
            var index = _.findIndex(source, { id: cgId });
            var split = index + 1;
            var ccData = ccStore.get(cgId);

            if ( index < 0 || ! ccData ) {
                return;
            }

            if (index === source.length - 1) {
                newSource = [].concat(
                    source,
                    ccStore.get(cgId),
                    [{
                        isChargeCodePagination: true
                    }]
                );
            } else {
                newSource = [].concat(
                    source.slice(0, split),
                    ccStore.get(cgId),
                    [{
                        isChargeCodePagination: true
                    }],
                    source.slice(split)
                );
            }

            return newSource;
        }

        $scope.toggleChargeCode = function(item) {
            var hasCC = ccStore.get(item.id);

            if ( item.chageGroupActive ) {
                item.chageGroupActive = false;
            } else if ( angular.isDefined(hasCC) ) {
                item.chageGroupActive = true;
            } else {
                $scope.fetchChargeCodes(item);
            }
        };

        $scope.fetchChargeCodes = function (item) {
            var pageNo = item.pageNo === 0 ? item.pageNo + 1 : 1;

            var delay = 100;
            var success = function(data) {
                item.pageNo = pageNo;

                ccStore.set(item.id, data.charge_codes);
                insertOneChargeCode($scope.cgEntries, item.id);
                item.chageGroupActive = true;

                $timeout(function () {
                    $scope.$emit('hideloader');
                }, delay);
            };

            var failed = function () {
                $scope.$emit('hideloader');
            };

            var date = $scope.uiChosenReport.singleValueDate;
            var params = {
                date: $filter('date')(date, 'yyyy-MM-dd'),
                charge_group_id: item.id,
                page_no: pageNo,
                per_page: 50
            };

            $scope.invokeApi(RVreportsSubSrv.getChargeCodes, params, success, failed);
        };

        /**
         * processStatic - a helper function that will suffix '%'
         * and add currency symbols
         *
         * @param  {object} entry each data node
         * @returns {object}       modified data node
         */
        function processStatic (entry) {
            var decimalLimiter = 2;

            switch ( entry.section ) {
            case 'Total Occupancy %':
            case 'Total Occupancy % (Excl Comp)':
                entry.today += '%';
                entry.mtd += '%';
                entry.last_year_mtd += '%';
                entry.ytd += '%';
                entry.last_year_ytd += '%';
                break;

            case 'ADR':
            case 'ADR (Excl Comp)':
            case 'Revpar':
                entry.today = $filter('currency')(entry.today, currencySymbol, decimalLimiter);
                entry.mtd = $filter('currency')(entry.mtd, currencySymbol, decimalLimiter);
                entry.last_year_mtd = $filter('currency')(entry.last_year_mtd, currencySymbol, decimalLimiter);
                entry.ytd = $filter('currency')(entry.ytd, currencySymbol, decimalLimiter);
                entry.last_year_ytd = $filter('currency')(entry.last_year_ytd, currencySymbol, decimalLimiter);
                break;

            default:
                // no op
                break;
            }

            return entry;
        }

        /**
         * processCG - add properties for managing states and current page.
         *
         * @param  {object} entry each entry
         * @returns {object}       same object modified
         */
        function processCG (entry) {
            entry.isChargeGroup = true;
            entry.chageGroupActive = false;
            entry.pageNo = 0;

            return entry;
        }

        /**
         * init - bootstrap initial execution
         *
         * @returns {object} undefined
         */
        function init () {
            var results = $scope.$parent.results,
                processed;

            $scope.staticEntries = [];
            $scope.totalEntry = [];
            $scope.cgEntries = [];

            angular.forEach(results, function(item) {
                if ( item.is_total_revenue ) {
                    $scope.totalEntry.push( item );
                } else if ( item.is_charge_group ) {
                    processed = processCG(item);
                    $scope.cgEntries.push(processed);
                } else if ( item.is_static ) {
                    processed = processStatic(item);
                    $scope.staticEntries.push(processed);
                }
            });

            insetAllChargeCodes($scope.cgEntries);
        }

        init();

        // re-render must be initiated before for taks like printing.
        // thats why timeout time is set to min value 50ms
        reportSubmited = $scope.$on(RVReportMsgsConst['REPORT_SUBMITED'], function() {
            $timeout(function() {
                init();
            }, reInitDelay);
        });
        reportPrinting = $scope.$on(RVReportMsgsConst['REPORT_PRINTING'], init);
        reportUpdated = $scope.$on(RVReportMsgsConst['REPORT_UPDATED'], init);
        reportPageChanged = $scope.$on(RVReportMsgsConst['REPORT_PAGE_CHANGED'], init);

        $scope.$on('$destroy', reportSubmited);
        $scope.$on('$destroy', reportUpdated);
        $scope.$on('$destroy', reportPrinting);
        $scope.$on('$destroy', reportPageChanged);
    }
]);
