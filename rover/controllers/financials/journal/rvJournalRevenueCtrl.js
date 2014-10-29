sntRover.controller('RVJournalRevenueController', ['$scope','$rootScope', 'RVJournalSrv',function($scope, $rootScope, RVJournalSrv) {
	BaseCtrl.call(this, $scope);
	$scope.setScroller('revenue-content');

	$scope.initData = function(){
		var successCallBackFetchRevenueData = function(data){
			console.log(data);
			$scope.data.revenueData = {};
			$scope.data.revenueData = data;
			$scope.$emit('hideLoader');
			setTimeout(function(){$scope.refreshScroller('revenue-content');}, 200);
		};
		$scope.invokeApi(RVJournalSrv.fetchRevenueData, {}, successCallBackFetchRevenueData);
	};
	$scope.initData();

	$scope.$on('revenueTabActive',function(){
        setTimeout(function(){$scope.refreshScroller('revenue-content');}, 200);
    });
	
	$rootScope.$on('fromDateChanged',function(){
        console.log("fromDateChanged"+$scope.data.fromDate);
    });

    $rootScope.$on('toDateChanged',function(){
        console.log("toDateChanged"+$scope.data.toDate);
    });

}]);