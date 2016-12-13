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
         * @param  {object} source - the hidden store
         * @returns {function}     the implementation of get function
         */
        var getter = function(source) {
            return {
                get: function(key) {
                    return source[key] || undefined;
                }
            };
        };

        /**
         * setter - generates a set method. this is similar to a set prototype method
         *
         * @param  {object} source - the hidden store
         * @returns {function}     the implementation of set function
         */
        var setter = function (source) {
            return {
                set: function (key, value) {
                    source[key] = value;
                    return source[key];
                }
            };
        };

        /**
         * ccStore - the actual store object generated via composition
         *
         * @returns {object}     a normal object that gets and sets internal source
         */
        var genStore = function () {
            var source = {};

            return _.extend(
                {},
                getter(source),
                setter(source)
            );
        };
        var ccStore = genStore();

        /** Ending data store composition section for storing CGs */


        function prepareChargeGroupsCodes (results) {
            var chargeGroupsCodes = [];
            var i, j, k, l = 51;

            for (i = 0, j = results.length; i < j; i++) {
                if ( results[i].is_charge_group ) {

                    // augment charge group entry
                    chargeGroupsCodes.push(
                        _.extend(
                            {},
                            results[i],
                            {
                                isChargeGroup: true,
                                isChageGroupActive: false,
                                pageNo: 0,
                                pageOptions: {
                                    id: results[i].id.toString(),
                                    api: ['fetchChargeCodes', i]
                                }
                            }
                        )
                    );

                    // fill empty 50 charge codes
                    for (k = 0; k < l; k++) {
                        chargeGroupsCodes.push({
                            isChargeCode: true,
                            isChargeCodeActive: false,
                            isEmpty: true
                        });
                    }

                    // fill empty last pagination
                    chargeGroupsCodes.push({
                        isChargeCode: true,
                        isChargeCodeActive: false,
                        isChargeCodePagination: true,
                        isEmpty: true
                    });
                }
            }

            return chargeGroupsCodes;
        }

        function fillChargeCodes (ccData, sourceIndex) {
            var process = function (data, dataIndex, sourceIndex) {
                var dataNextIndex = dataIndex + 1;
                var sourceNextIndex = sourceIndex + 1;
                var item = data[dataIndex] || {};

                _.extend(
                    $scope.cgEntries[sourceIndex],
                    item,
                    {
                        isEmpty: false
                    }
                );

                if ( $scope.cgEntries[sourceNextIndex] && $scope.cgEntries[sourceNextIndex].isChargeCode ) {
                    process(data, dataNextIndex, sourceNextIndex);
                }
            }

            process(ccData, 0, sourceIndex);
        }

        function fillAllChargeCodes (source) {
            var i, j, id, match, sourceIndex;

            for (i = 0, j = source.length; i < j; i++) {
                id = source[i].id;
                match = ccStore.get(id);
                sourceIndex = i + 1;

                if ( angular.isDefined(match) ) {
                    fillChargeCodes(match, sourceIndex);
                }
            }
        }

        function toggleChargeCodes (source, sourceIndex, active) {
            var process = function(sourceIndex, active) {
                var sourceNextIndex = sourceIndex + 1;

                _.extend(
                    source[sourceIndex],
                    {
                        isChargeCodeActive: active
                    }
                );

                if ( source[sourceNextIndex] && source[sourceNextIndex].isChargeCode ) {
                    process(sourceNextIndex, active);
                }
            }

            process(source, sourceIndex, active);
        }

        function toggleAllChargeCodes (source, active) {
            var i, j;

            for (i = 0, j = source.length; i < j; i++) {
                if ( source[i].isChargeCode && ! source[i].isEmpty ) {
                    source[i].isChargeCodeActive = active;
                }
            }
        }


        /**
         * init - bootstrap initial execution
         * @returns {object} undefined
         */
        function totalRevenueInit (results) {
            var i, j;

            $scope.totalEntry = [];
            for (i = 0, j = results.length; i < j; i++) {
                if ( results[i].is_total_revenue ) {
                    $scope.totalEntry.push( results[i] );
                }
            }
        }

        /**
         * processStatic - a helper function that will suffix '%'
         * and add currency symbols
         *
         * @param  {object} entry each data node
         * @returns {object}       modified data node
         */
        function staticInit (results) {
            var i, j;

            var processStatic = function (entry) {
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
            };

            $scope.staticEntries = [];
            for (i = 0, j = results.length; i < j; i++) {
                if ( results[i].is_static ) {
                    $scope.staticEntries.push( processStatic(results[i]) );
                }
            }
        }

        /**
         * init - bootstrap initial execution
         * @returns {object} undefined
         */
        function chargeGroupInit (results, toggleAll) {
            $scope.cgEntries = prepareChargeGroupsCodes(results);
            fillAllChargeCodes($scope.cgEntries);

            if ( toggleAll ) {
                toggleAllChargeCodes();
            }
        }

        /**
         * init - bootstrap initial execution
         * @returns {object} undefined
         */
        function init () {
            var results = $scope.$parent.results;

            totalRevenueInit(results);
            staticInit(results);
            chargeGroupInit(results);
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


        $scope.toggleChargeGroup = function (index) {
            var item = $scope.cgEntries[index];
            var state;
            var hasCC = ccStore.get(item.id);
            var sourceIndex = index + 1;

            if ( angular.isDefined(hasCC) ) {
                if ( item.isChageGroupActive ) {
                    state = false;
                } else {
                    state = true;
                }

                toggleChargeCodes($scope.cgEntries, sourceIndex, state);
                item.isChageGroupActive = state;
            } else {
                $scope.fetchChargeCodes(index);
            }
        };

        $scope.fetchChargeCodes = function (index) {
            var item = $scope.cgEntries[index];
            var pageNo = item.pageNo === 0 ? item.pageNo + 1 : 1;

            var delay = 100;
            var success = function(data) {
                var sourceIndex = index + 1;

                item.pageNo = pageNo;

                ccStore.set(item.id, data.charge_codes);
                fillChargeCodes(ccStore.get(item.id), sourceIndex);

                $timeout(function () {
                    toggleChargeCodes($scope.cgEntries, sourceIndex, true);
                    item.isChargeGroupActive = true;
                    $scope.$emit('hideLoader');
                }, delay);
            };

            var failed = function () {
                $scope.$emit('hideLoader');
            };

            var params = {
                date: $filter('date')($scope.chosenReport.singleValueDate, 'yyyy-MM-dd'),
                report_id: $scope.chosenReport.id,
                charge_group_id: item.id,
                page_no: pageNo,
                per_page: 50
            };

            $scope.invokeApi(RVreportsSubSrv.getChargeCodes, params, success, failed);
        };
    }
]);
