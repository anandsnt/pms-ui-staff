sntRover.controller('RVJournalRevenueController', ['$scope','RVJournalSrv',function($scope, RVJournalSrv) {
	BaseCtrl.call(this, $scope);
	var successCallBackFetchRevenueData = function(data){
		console.log(data);
		$scope.data.revenueData = data;
		$scope.$emit('hideLoader');
		setTimeout(function(){$scope.refreshScroller('revenue-content');}, 200);
	};
	$scope.invokeApi(RVJournalSrv.fetchRevenueData, {}, successCallBackFetchRevenueData);
	$scope.setScroller('revenue-content');

	$scope.$on('revenueTabActive',function(){
        setTimeout(function(){$scope.refreshScroller('revenue-content');}, 200);
    });
	
	

}]);