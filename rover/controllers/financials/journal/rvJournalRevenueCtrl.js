sntRover.controller('RVJournalRevenueController', ['$scope','RVJournalSrv',function($scope, RVJournalSrv) {
	BaseCtrl.call(this, $scope);
	var successCallBackFetchRevenueData = function(data){
		console.log(data);
		$scope.data.revenueData = data;
		$scope.$emit('hideLoader');
	};
	$scope.invokeApi(RVJournalSrv.fetchRevenueData, {}, successCallBackFetchRevenueData);
}]);