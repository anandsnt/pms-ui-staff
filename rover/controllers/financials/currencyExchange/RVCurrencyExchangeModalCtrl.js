sntRover.controller('RVCurrencyExchangeModalController',
    ['$scope', 
        '$rootScope', 
        '$filter',
        '$timeout',
        'rvUtilSrv',
        'RVMultiCurrencyExchangeSrv',
        function($scope, $rootScope, $filter, $timeout, util, RVMultiCurrencyExchangeSrv) {


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
                        //$scope.exchangeRates = data;
                    };

                    var params = {
                        'start_date': $scope.start_date,
                        'end_date': $scope.end_date
                    };

                    $scope.invokeApi(RVMultiCurrencyExchangeSrv.fetchExchangeRates, params, successCallBackFetchAccountsReceivables );
                },
                isDateDisabled = function(){
                   return false;
                },
                constructExchangeRateArray = function(date) {
                    var startDate = moment(date),
                        ExchangeRateArray = [];

                    for (var i = 0; i < 7; i++) {
                        ExchangeRateArray[i] = {
                            day : startDate.format('dddd'),
                            date : $filter('date')(tzIndependentDate(startDate.calendar()), $rootScope.dateFormat),
                            exchange_rate : null,
                            isDisabled : isDateDisabled(startDate)
                        };
                        startDate = startDate.add(1, 'days');
                    }

                    return ExchangeRateArray;
                };
    
            $scope.exchangeRates = {};
            $scope.exchangeRates.data = [{ 'date': '20-02-2019',
                'conversion_rate': 12.33 }, { 'date': '21-02-2019',
                    'conversion_rate': 12.33 }, { 'date': '22-02-2019',
                        'conversion_rate': 12.33 }, { 'date': '23-02-2019',
                            'conversion_rate': 12.33 }, { 'date': '24-02-2019',
                                'conversion_rate': 12.33 }, { 'date': '25-02-2019',
                                    'conversion_rate': 13.33 }];


            angular.forEach($scope.exchangeRates.data, function(item, index) {
                item.day = moment(item.date, 'DD-MM-YYYY').format('dddd');
            });

            $scope.save = function() {
                var successCallBackFetchAccountsReceivables = function(data) {
                    //$scope.exchangeRates = data;
                };

                var params = {
                    exchange_rates: $scope.exchangeRates
                };

                $scope.invokeApi(RVMultiCurrencyExchangeSrv.saveExchangeRates, params, successCallBackFetchAccountsReceivables );

            }

            var init = function() {
                $scope.start_date = $filter('date')(tzIndependentDate($rootScope.businessDate), $rootScope.dateFormat);
                $scope.end_date = $filter('date')(tzIndependentDate(moment($rootScope.businessDate).add(7, 'days')
                .calendar()), $rootScope.dateFormat);
                $scope.exchangeRates = constructExchangeRateArray($scope.start_date);
                setStartDateOptions();
                setEndDateOptions();
                fetchExhangeRates();
            };

            init();

        }]);
