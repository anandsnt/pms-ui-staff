angular.module('sntRover')
.controller('RVComparisonReport.Controller', [
    '$rootScope',
    '$scope',
    '$filter',
    'RVReportUtilsFac',
    'RVReportMsgsConst',
    '$timeout',
    'RVreportsSubSrv',
    '$q',
    // eslint-disable-next-line max-params
    function (
        $rootScope,
        $scope,
        $filter,
        RVReportUtilsFac,
        RVReportMsgsConst,
        $timeout,
        RVreportsSubSrv,
        $q
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

            return angular.extend(
                {},
                getter(source),
                setter(source)
            );
        };

        var ccStore = genStore();

        /** Ending data store composition section for storing CGs */

        // re-render must be initiated before for taks like printing.
        // thats why timeout time is set to min value 50ms
        reportSubmited = $scope.$on(RVReportMsgsConst['REPORT_SUBMITED'], function() {
            $timeout(function() {
                init();
            }, reInitDelay);
        });
        reportPrinting = $scope.$on(RVReportMsgsConst['REPORT_PRINTING'], function () {
            init();
            toggleAllChargeCodes( $scope.cgEntries, true );
        });
        reportUpdated = $scope.$on(RVReportMsgsConst['REPORT_UPDATED'], init);
        reportPageChanged = $scope.$on(RVReportMsgsConst['REPORT_PAGE_CHANGED'], init);

        $scope.$on('$destroy', reportSubmited);
        $scope.$on('$destroy', reportUpdated);
        $scope.$on('$destroy', reportPrinting);
        $scope.$on('$destroy', reportPageChanged);

        $scope.toggleChargeGroup = function (index) {
            var item = $scope.cgEntries[index];
            var state;
            var hasCC = ccStore.get(item.charge_group_id);
            var sourceIndex = index + 1;

            $scope.fetchChargeCodes(index, 1);
            
        };

        $scope.printComparisonReport = function () {
            $scope.$emit("YEARLY_TAX_REPORT_PRINT");
        };

        $scope.fetchChargeCodes = function (index, pageNo) {
            $scope.cgEntries[index].isChargeGroupActive = !$scope.cgEntries[index].isChargeGroupActive;
            if ( $scope.cgEntries[index].isChargeGroupActive ) {

                var item = $scope.cgEntries[index];
                var pageNo = pageNo || 1;

                var success = function(data) {
                    $scope.cgEntries[index].chargeCodesArray = data.charge_codes;
                    $scope.$emit('hideLoader');
                    $scope.refreshScroll(true);
                };

                var failed = function () {
                    $scope.$emit('hideLoader');
                };

                var params = {
                    date: $filter('date')($scope.chosenReport.singleValueDate, 'yyyy-MM-dd'),
                    report_id: $scope.chosenReport.id,
                    charge_group_id: item.charge_group_id,
                    page: pageNo,
                    per_page: 50
                };

                $scope.invokeApi(RVreportsSubSrv.getChargeCodes, params, success, failed);
            } else {
                $scope.cgEntries[index].chargeCodesArray = [];
                    
                $scope.refreshScroll(true);
            }
        };

        $scope.togglePaymentGroup = function(index, pageNo) {
             $scope.pgEntries[index].isPaymentGroupActive = !$scope.pgEntries[index].isPaymentGroupActive;

             if ($scope.pgEntries[index].isPaymentGroupActive) {

                var success = function(data) {
                    ccStore.set($scope.pgEntries[index].charge_group_id, data);
                    $scope.$emit('hideLoader');
                    $scope.pgEntries[index].paymentGroupEntries = data.charge_codes;
                    $scope.refreshScroll(true);
                };
                var failed = function() {
                    $scope.$emit('hideLoader');
                };
                var item = $scope.pgEntries[index];

                pageNo = pageNo || 1;
                var params = {
                    date: $filter('date')($scope.chosenReport.singleValueDate, 'yyyy-MM-dd'),
                    report_id: $scope.chosenReport.id,
                    charge_group_id: item.charge_group_id,
                    page: pageNo,
                    per_page: 50
                };

                $scope.invokeApi(RVreportsSubSrv.getPaymentValues, params, success, failed);
            } else {
                $scope.pgEntries[index].paymentGroupEntries = [];
                $scope.refreshScroll(true);
            }

        };
        $scope.isHidden = function (item) {
            var hidden = false;

            if ( item.isChargeCode && item.isEmpty ) {
                hidden = true;
            } else if ( item.isChargeCode && ! item.isChargeCodeActive ) {
                hidden = true;
            }

            return hidden;
        };

        /**
         * prepareChargeGroupsCodes - fill up the charge group + 50 charge code + 1 pagination space allready
         * this allows us to pass around the $index since they will never change
         *
         * @param  {array} results actual api respose
         * @returns {array}         final array with all the placeholders
         */
        function prepareChargeGroupsCodes (results) {
            var chargeGroupsCodes = [];
            var i, j, k, l = 51;
            var cgEntries = _.where(results, { is_charge_group: true });

            for (i = 0, j = cgEntries.length; i < j; i++) {
                if ( cgEntries[i].is_charge_group ) {

                    // augment charge group entry
                    chargeGroupsCodes.push(
                        angular.extend(
                            {},
                            cgEntries[i],
                            {
                                isChargeGroup: true,
                                isChargeGroupActive: false,
                                pageNo: 0
                            }
                        )
                    );
                    // CICO-40996 - Passing the index of the charge group item for fetching the charge codes
                    var chargeGroupItemIndex = chargeGroupsCodes.length - 1;

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
                        isEmpty: true,
                        pageOptions: {
                            id: cgEntries[i].charge_group_id.toString(),
                            api: [ $scope.fetchChargeCodes, chargeGroupItemIndex],
                            perPage: 50
                        }
                    });
                }
            }

            return chargeGroupsCodes;
        }


        /**
         * fillChargeCodes - fill the recived charge codes for a charge group in its created placeholder
         *
         * @param  {array} ccData      charge code data
         * @param  {number} sourceIndex index of the charge group
         * @returns {object}             undefined
         */
        function fillChargeCodes (ccData, sourceIndex, totalCount) {
            var process = function (data, dataIndex, sourceIndex) {
                var dataNextIndex = dataIndex + 1;
                var sourceNextIndex = sourceIndex + 1;
                var item = data[dataIndex] || {};
                var isEmpty = data[dataIndex] ? false : true;

                angular.extend(
                    $scope.cgEntries[sourceIndex],
                    item,
                    {
                        isEmpty: isEmpty
                    }
                );
                if ( $scope.cgEntries[sourceIndex].isChargeCodePagination ) {
                    $scope.cgEntries[sourceIndex].pageOptions.totalCount = totalCount;
                }

                if ( $scope.cgEntries[sourceNextIndex] && $scope.cgEntries[sourceNextIndex].isChargeCode ) {
                    process(data, dataNextIndex, sourceNextIndex);
                }
            };

            process(ccData, 0, sourceIndex);
        }

        /**
         * fillAllChargeCodes - loop through the entire cgcc array and fill any already fetched cc
         *
         * @param  {array} source full array
         * @returns {object} undefined
         */
        function fillAllChargeCodes (source) {
            var i, j, id, match, sourceIndex;

            for (i = 0, j = source.length; i < j; i++) {
                id = source[i].charge_group_id;
                match = ccStore.get(id);
                sourceIndex = i + 1;

                if ( angular.isDefined(match) ) {
                    fillChargeCodes(match, sourceIndex);
                }
            }
        }


        /**
         * toggleAllChargeCodes - toggle all the cc available on the ui
         *
         * @param  {array} source      full array
         * @param  {type} active      show or hide
         * @returns {object}             undefined
         */
        function toggleAllChargeCodes (source, active) {
            var i, j;

            for (i = 0, j = source.length; i < j; i++) {
                if ( source[i].isChargeCode && ! source[i].isEmpty ) {
                    source[i].isChargeCodeActive = active;
                }
            }
        }


        /**
         * processStatic - a helper function that will suffix '%'
         * and add currency symbols
         *
         * @param {array} results fetched data from API
         * @returns {object} undefined
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

        /*
         * Seperating balance
         * @param {array} results fetched data from API
         */
        function balanceBrought (results) {
            $scope.balanceEntries = [];
            $scope.balanceEntries = _.where(results, { is_balance_brought_forward: true });
        }
        /*
         * Seperating ledger deposit values
         * @param {array} results fetched data from API
         */
        function ledgerDepositInit (results) {
            $scope.ledgerDepositEntries = [];
            $scope.ledgerDepositEntries = _.where(results, { is_deposit_ledger: true });
        }
        /*
         * Seperating ledger guest values
         * @param {array} results fetched data from API
         */
        function ledgerGuestInit (results) {
            $scope.ledgerGuestEntries = [];
            $scope.ledgerGuestEntries = _.where(results, { is_guest_ledger: true });
        }
        /*
         * Seperating ledger AR
         * @param {array} results fetched data from API
         */
        function ledgerARInit (results) {
            $scope.ledgerAREntries = [];
            $scope.ledgerAREntries = _.where(results, { is_ar_ledger: true });
        }
        /*
         * Total variance
         * @param {array} results fetched data from API
         */
       function ledgerTotalVarianceInit (results) {
            $scope.ledgerTotalVariance = [];
            $scope.ledgerTotalVariance = _.where(results, { is_total_variance: true });
        }
        /*
         * Total closingBalance
         * @param {array} results fetched data from API
         */
        function ledgerTotalClosingBalanceInit (results) {
            $scope.ledgerTotalClosingBalance = [];
            $scope.ledgerTotalClosingBalance = _.where(results, {  is_total_closing_balance: true });
        }
         /**
         * init - bootstrap initial execution
         * @returns {object} undefined
         */
        function init () {
            $scope.comparisonReportResult = $scope.$parent.results;
            $scope.cgEntries = $scope.comparisonReportResult.charge_group_hash;
            $scope.pgEntries = $scope.comparisonReportResult.payment_hash;
            angular.forEach($scope.cgEntries, function (item) {
                item.isChargeGroupActive = false;
            });
            angular.forEach($scope.pgEntries, function (item) {
                item.isPaymentGroupActive = false;
            });
            balanceBrought($scope.comparisonReportResult.ledger_hash);
            ledgerDepositInit($scope.comparisonReportResult.ledger_hash);
            ledgerGuestInit($scope.comparisonReportResult.ledger_hash);
            ledgerARInit($scope.comparisonReportResult.ledger_hash);
            ledgerTotalVarianceInit($scope.comparisonReportResult.ledger_hash);
            ledgerTotalClosingBalanceInit($scope.comparisonReportResult.ledger_hash);
        }

        init();

    }
]);
