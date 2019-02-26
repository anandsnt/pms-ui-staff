sntRover.controller('RVCurrencyExchangeModalController', 
    ['$scope', 
    '$rootScope', 
    '$filter', function($scope, $rootScope, $filter) {

    BaseCtrl.call(this, $scope);
    
    $scope.exchangeRates = {};
    $scope.exchangeRates.data = [{ "date": '20-02-2019', "exchange_rate": 12.33 },{ "date": '21-02-2019', "exchange_rate": 12.33 },{ "date": '22-02-2019', "exchange_rate": 12.33 },{ "date": '23-02-2019', "exchange_rate": 12.33 },{ "date": '24-02-2019', "exchange_rate": 12.33 }, { "date":'25-02-2019',  "exchange_rate": 13.33 }];


    angular.forEach($scope.exchangeRates.data, function(item, index) {
		item.day  = moment(item.date, "DD-MM-YYYY").format('dddd');
	});

    init();

}]);
