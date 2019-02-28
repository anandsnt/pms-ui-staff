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

            var commonDateOptions = {
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
                    var startDate = new tzIndependentDate(util.get_date_from_date_picker(datePicker));

                    $scope.start_date = $filter('date')(startDate, $rootScope.dateFormat);
                    $scope.end_date = $filter('date')(tzIndependentDate(moment(startDate).add(7, 'days')
                    .calendar()), $rootScope.dateFormat);
                    $timeout(function() {
                        $rootScope.apply();
                    }, 100);
                },
                setEndDateOptions = function () {
                    $scope.endDateOptions = _.extend({
                        onSelect: endDateChoosed
                    }, commonDateOptions);
                },
                endDateChoosed = function(date, datePicker) {
                    var endDate = new tzIndependentDate(util.get_date_from_date_picker(datePicker));

                    $scope.end_date = $filter('date')(endDate, $rootScope.dateFormat);
                    $scope.start_date = $filter('date')(tzIndependentDate(moment(endDate).subtract(7, 'days')
                    .calendar()), $rootScope.dateFormat);

                    $timeout(function() {
                        $rootScope.apply();
                    }, 200);
                },
                fetchExhangeRates = function() {

                    var successCallBackFetchAccountsReceivables = function(data) {
                        if (data.length > 0) {
                            $scope.exchangeRates = data;
                            angular.forEach($scope.exchangeRates, function(item, index) {
                                item.day = moment(tzIndependentDate(item.date)).format("dddd");
                                item.isDisabled = isDateDisabled(item.date)
                            });
                        } else {
                            $scope.exchangeRates = constructExchangeRateArray($scope.start_date);
                        }
                        $scope.refreshScroller("CURRENCY_SCROLLER");
                    };

                    var params = {
                        'start_date': moment(tzIndependentDate($scope.start_date)).format($rootScope.momentFormatForAPI),
                        'end_date': moment(tzIndependentDate($scope.end_date)).format($rootScope.momentFormatForAPI)
                    };

                    $scope.invokeApi(RVMultiCurrencyExchangeSrv.fetchExchangeRates, params, successCallBackFetchAccountsReceivables );
                },
                isDateDisabled = function(startDate) {
                   return startDate < moment($rootScope.businessDate);
                },
                constructExchangeRateArray = function(date) {
                    var startDate = moment(date),
                        ExchangeRateArray = [];

                    for (var i = 0; i < 7; i++) {
                        ExchangeRateArray[i] = {
                            day : startDate.format('dddd'),
                            date : $filter('date')(tzIndependentDate(startDate.calendar()), $rootScope.dateFormat),
                            conversion_rate : null,
                            isDisabled : isDateDisabled(startDate)
                        };
                        startDate = startDate.add(1, 'days');
                    }

                    return ExchangeRateArray;
                };
    

            $scope.save = function() {
                var successCallBackFetchAccountsReceivables = function(data) {
                    //$scope.exchangeRates = data;
                };

                angular.forEach($scope.exchangeRates, function(item, index) {
                    item.date = moment(tzIndependentDate(item.date)).format($rootScope.momentFormatForAPI);
                });

                var params = {
                    exchange_rates: $scope.exchangeRates
                };

                $scope.invokeApi(RVMultiCurrencyExchangeSrv.saveExchangeRates, params, successCallBackFetchAccountsReceivables );

            }

            var scrollerOptions = {
                tap: true,
                preventDefault: false,
                showScrollbar: true
            };

            $scope.setScroller("CURRENCY_SCROLLER", scrollerOptions);

            $scope.closeDialog = function() {
            // to add stjepan's popup showing animation
                $rootScope.modalOpened = false;
                $timeout(function() {
                    ngDialog.close();
                }, 200);
            };

            var init = function() {
                $scope.start_date = $filter('date')(tzIndependentDate($rootScope.businessDate), $rootScope.dateFormat);
                $scope.end_date = $filter('date')(tzIndependentDate(moment($rootScope.businessDate).add(7, 'days')
                .calendar()), $rootScope.dateFormat);
                // $scope.exchangeRates = constructExchangeRateArray($scope.start_date);
                setStartDateOptions();
                setEndDateOptions();
                fetchExhangeRates();
            };

            init();

        }]);
