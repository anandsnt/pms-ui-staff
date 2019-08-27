sntRover.controller('RVCurrencyExchangeModalController',
    ['$scope', 
        '$rootScope', 
        '$filter',
        '$timeout',
        'rvUtilSrv',
        'ngDialog',
        'RVMultiCurrencyExchangeSrv',
        function($scope, $rootScope, $filter, $timeout, util, ngDialog, RVMultiCurrencyExchangeSrv) {


            BaseCtrl.call(this, $scope);

            $scope.exchangeRatesData = [];
            $scope.exchangeCurrencyList = $rootScope.rateCurrencyList;
            if (_.findIndex($rootScope.rateCurrencyList, {"id": $rootScope.invoiceCurrencyObject.id}) === -1) {
                $scope.exchangeCurrencyList.push($rootScope.invoiceCurrencyObject);
            } 
            $scope.selected_rate_currency  = (_.first($scope.exchangeCurrencyList)).id;
            $scope.selected_rate_currency_symbol  = (_.first($scope.exchangeCurrencyList)).symbol;
            $scope.isInvoiceCurrency = $scope.selected_rate_currency === (_.find($rootScope.rateCurrencyList, {"id": $rootScope.invoiceCurrencyObject.id})).id;
            
            var delay = 200,
                noOfDays = 7,
                endDate,
                todayDate,
                daysDiff,
                checkDaysDiff = 7,
                commonDateOptions = {
                    dateFormat: $rootScope.jqDateFormat,
                    changeYear: true,
                    changeMonth: true,
                    yearRange: '-10:'
                },
                setStartDateOptions = function () {
                    $scope.startDateOptions = _.extend({
                        onSelect: startDateChoosed
                    }, commonDateOptions);
                },
                startDateChoosed = function(date, datePicker) {
                    var startDate = tzIndependentDate(util.get_date_from_date_picker(datePicker));

                    $scope.start_date = $filter('date')(startDate, $rootScope.dateFormatForAPI);
                    $scope.end_date = $filter('date')(tzIndependentDate(moment(startDate).add(noOfDays, 'days')
                    .calendar()), $rootScope.dateFormatForAPI);
                    fetchExhangeRates();
                    $timeout(function() {
                        $rootScope.apply();
                    }, delay);
                },
                setEndDateOptions = function () {
                    $scope.endDateOptions = _.extend({
                        onSelect: endDateChoosed
                    }, commonDateOptions);
                },
                endDateChoosed = function(date, datePicker) {
                    var endDate = tzIndependentDate(util.get_date_from_date_picker(datePicker));

                    $scope.end_date = $filter('date')(endDate, $rootScope.dateFormatForAPI);
                    $scope.start_date = $filter('date')(tzIndependentDate(moment(endDate).subtract(noOfDays, 'days')
                    .calendar()), $rootScope.dateFormatForAPI);       
                    fetchExhangeRates();
                    $timeout(function() {
                        $rootScope.apply();
                    }, delay);
                },
                fetchExhangeRates = function() {

                    var successCallBackFetchAccountsReceivables = function(data) {
                        if (data.length > 0) {
                            $scope.exchangeRatesData = data;
                            $scope.exchangeRates = constructExchangeRateArray($scope.start_date);
                        } else {
                            $scope.exchangeRatesData = [];
                            $scope.exchangeRates = constructExchangeRateArray($scope.start_date);
                        }
                        $scope.refreshScroller("CURRENCY_SCROLLER");
                    };

                    var params = {
                        'start_date': $filter('date')($scope.start_date, $rootScope.dateFormatForAPI),
                        'end_date': $filter('date')($scope.end_date, $rootScope.dateFormatForAPI),
                        'is_invoice_currency': $scope.isInvoiceCurrency,
                        'selected_currency': $scope.selected_rate_currency
                    };

                    $scope.invokeApi(RVMultiCurrencyExchangeSrv.fetchExchangeRates, params, successCallBackFetchAccountsReceivables );
                },
                isDateDisabled = function(startDate) {
                   return startDate < $rootScope.businessDate;
                },
                constructExchangeRateArray = function(date) {
                    var startDate = moment(date),
                        startDateString = moment(startDate).format("YYYY-MM-DD"),                  
                        ExchangeRateArray = [];

                    for (var i = 0; i < noOfDays; i++) {
                        var currentItemData = _.findWhere($scope.exchangeRatesData, {"date": moment(tzIndependentDate(startDate)).format($rootScope.momentFormatForAPI)});

                        ExchangeRateArray[i] = {
                            day: startDate.format('dddd'),
                            date: $filter('date')(tzIndependentDate(startDateString), $rootScope.dateFormatForAPI),
                            conversion_rate: angular.isUndefined(currentItemData) ? null : currentItemData.conversion_rate,
                            isDisabled: isDateDisabled(startDateString)
                        };
                        startDate = startDate.add(1, 'days');
                        startDateString = moment(startDate).format("YYYY-MM-DD");

                    }

                    return ExchangeRateArray;
                };
            
            $scope.changeCurrency = function() {
                $scope.selected_rate_currency_symbol  = (_.find($rootScope.rateCurrencyList, {"id": $scope.selected_rate_currency})).symbol;
                fetchExhangeRates();
            }
            /*
             * Save Exchange Rates
             */
            $scope.saveExchangeRate = function() {
                var successCallBackFetchAccountsReceivables = function() {
                    $scope.closeDialog();
                };

                angular.forEach($scope.exchangeRates, function(item) {
                    item.date = moment(tzIndependentDate(item.date)).format($rootScope.momentFormatForAPI);
                });

                var params = {
                    is_invoice_currency: $scope.isInvoiceCurrency,
                    selected_currency: $scope.selected_rate_currency,
                    exchange_rates: $scope.exchangeRates
                };

                $scope.invokeApi(RVMultiCurrencyExchangeSrv.saveExchangeRates, params, successCallBackFetchAccountsReceivables );

            };
            /*
             * copy amount to next row
             * @param clickedIndex Index of the clicked item
             */
            $scope.copyToNext = function(clickedIndex) {
                $scope.exchangeRates[clickedIndex + 1].conversion_rate = $scope.exchangeRates[clickedIndex].conversion_rate;
            };

            var scrollerOptions = {
                tap: true,
                preventDefault: false,
                showScrollbar: true
            };

            $scope.setScroller("CURRENCY_SCROLLER", scrollerOptions);

            /*
             * To close dialog box
             */
            $scope.closeDialog = function() {                

                $rootScope.modalOpened = false;
                $timeout(function() {
                    ngDialog.close();
                }, delay);
            };
            /*
             * Initialization method
             */
            var init = function() {

                $scope.start_date = $filter('date')(tzIndependentDate($rootScope.businessDate), $rootScope.dateFormatForAPI);

                endDate = moment(tzIndependentDate($rootScope.businessDate)).add(noOfDays, 'days');                                                          
                todayDate = moment().startOf('day');
                daysDiff = moment.duration(todayDate.diff(endDate)).asDays();

                if (daysDiff < checkDaysDiff) {
                    $scope.end_date = $filter('date')(tzIndependentDate(endDate.format("L")), $rootScope.dateFormatForAPI);
                } else {
                    $scope.end_date = $filter('date')(tzIndependentDate(moment($rootScope.businessDate).add(noOfDays, 'days')
                .calendar()), $rootScope.dateFormatForAPI);
                }
                setStartDateOptions();
                setEndDateOptions();
                fetchExhangeRates();
            };

            init();

        }]);
