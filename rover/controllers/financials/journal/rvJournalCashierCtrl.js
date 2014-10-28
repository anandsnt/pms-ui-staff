sntRover.controller('RVJournalCashierController', ['$scope','RVJournalSrv',function($scope,RVJournalSrv) {
	BaseCtrl.call(this, $scope);

	$scope.setScroller('cashier_history', {});
	setTimeout(function(){$scope.refreshScroller('cashier_history');}, 3000);

    var fetchHistoryDetails = function(data){
         var fetchDetailsSuccessCallback = function(data){
            $scope.$emit('hideLoader');
            $scope.details = [];
            $scope.details = data;
        }
        var url = '/sample_json/journal/journal_cashier_details_'+data.id+'.json';
        $scope.invokeApi(RVJournalSrv.fetchCashierDetails, url, fetchDetailsSuccessCallback);  
    };
    fetchHistoryDetails({'id':$scope.data.cashierData.history[0].status});
   
	$scope.setScroller('cashier_shift', {});
	setTimeout(function(){$scope.refreshScroller('cashier_shift');}, 3000);
	
	$scope.selectedHistory = 0;
	$scope.historyClicked = function(index){
		$scope.selectedHistory = index;
        fetchHistoryDetails({'id':$scope.data.cashierData.history[index].status})
	};
}]);