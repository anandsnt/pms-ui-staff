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

                    $scope.start_date = $filter('date')(startDate, $rootScope.dateFormat);
                    $scope.end_date = $filter('date')(tzIndependentDate(moment(startDate).add(noOfDays, 'days')
                    .calendar()), $rootScope.dateFormat);
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

                    $scope.end_date = $filter('date')(endDate, $rootScope.dateFormat);
                    $scope.start_date = $filter('date')(tzIndependentDate(moment(endDate).subtract(noOfDays, 'days')
                    .calendar()), $rootScope.dateFormat);
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
                            $scope.exchangeRates = constructExchangeRateArray($scope.start_date);
                        }
                        $scope.refreshScroller("CURRENCY_SCROLLER");
                    };

                    var params = {
                        'start_date': $filter('date')($scope.start_date, $rootScope.momentFormatForAPI),
                        'end_date': $filter('date')($scope.end_date, $rootScope.momentFormatForAPI)
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
                            date: $filter('date')(tzIndependentDate(startDate.calendar()), $rootScope.dateFormat),
                            conversion_rate: angular.isUndefined(currentItemData) ? null : currentItemData.conversion_rate,
                            isDisabled: isDateDisabled(startDateString)
                        };
                        startDate = startDate.add(1, 'days');
                        startDateString = moment(startDate).format("YYYY-MM-DD");
                    }

                    return ExchangeRateArray;
                };
    
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
                $scope.start_date = $filter('date')(tzIndependentDate($rootScope.businessDate), $rootScope.dateFormat);

                endDate = moment(tzIndependentDate($rootScope.businessDate)).add(noOfDays, 'days');                                                          
                todayDate = moment().startOf('day');
                daysDiff = moment.duration(todayDate.diff(endDate)).asDays();

                if (daysDiff < checkDaysDiff) {
                    $scope.end_date = $filter('date')(tzIndependentDate(endDate.format("L")), $rootScope.dateFormat);
                } else {
                    $scope.end_date = $filter('date')(tzIndependentDate(moment($rootScope.businessDate).add(noOfDays, 'days')
                .calendar()), $rootScope.dateFormat);
                }
                setStartDateOptions();
                setEndDateOptions();
                fetchExhangeRates();
            };

            init();

        }]);
