sntRover.controller('RVJournalCashierController', ['$scope','RVJournalSrv',function($scope,RVJournalSrv) {
	
    //fetch history details
    var fetchHistoryDetails = function(data){
         var fetchDetailsSuccessCallback = function(data){
            $scope.$emit('hideLoader');
            $scope.details = [];
            $scope.details = data;
            $scope.setScroller('cashier_shift', {});
            setTimeout(function(){$scope.refreshScroller('cashier_shift');}, 500);
        }
        var url = '/sample_json/journal/journal_cashier_details_'+data.id+'.json';
        $scope.invokeApi(RVJournalSrv.fetchCashierDetails, url, fetchDetailsSuccessCallback);  
    };

    //init
    var init = function(){
        BaseCtrl.call(this, $scope);
        $scope.selectedHistory = 0;
        $scope.setScroller('cashier_history', {});
        setTimeout(function(){$scope.refreshScroller('cashier_history');}, 500);
        fetchHistoryDetails({'id':$scope.data.cashierData.history[0].status});
    }

    init();	
	
    //click action of individual history
	$scope.historyClicked = function(index){
		$scope.selectedHistory = index;
        fetchHistoryDetails({'id':$scope.data.cashierData.history[index].status})
	};
}]);