sntRover.controller('RVJournalCashierController', ['$scope','RVJournalSrv',function($scope,RVJournalSrv) {
	
    //fetch history details
    var fetchHistoryDetails = function(data){

         var fetchDetailsSuccessCallback = function(data){
            $scope.$emit('hideLoader');
            $scope.details = [];
            $scope.details = data;
            setTimeout(function(){$scope.refreshScroller('cashier_shift');}, 500);
        };
        var url = '/sample_json/journal/journal_cashier_details_'+data.id+'.json';
        $scope.invokeApi(RVJournalSrv.fetchCashierDetails, url, fetchDetailsSuccessCallback);  
    };

    //init
    var init = function(){

        BaseCtrl.call(this, $scope);
        $scope.selectedHistory = 0;
        $scope.setScroller('cashier_history', {});
        $scope.setScroller('cashier_shift', {});
        setTimeout(function(){$scope.refreshScroller('cashier_history');}, 500);
        fetchHistoryDetails({'id':$scope.data.cashierData.history[0].status});
    };

    init();	
	
    //click action of individual history
	$scope.historyClicked = function(index){

		$scope.selectedHistory = index;
        fetchHistoryDetails({'id':$scope.data.cashierData.history[index].status});
	};

    //click action close shift
    $scope.closeShift = function(){

        var closeShiftSuccesCallback = function(){
            $scope.data.cashierData.history[$scope.selectedHistory].status = "closed";
            $scope.details.status ='closed';
        };
        closeShiftSuccesCallback();
    };

    //click action reOpen
    $scope.reOpen = function(){
        
        var reOpenSuccesCallback = function(){
            $scope.data.cashierData.history[$scope.selectedHistory].status = "open";
            $scope.details.status ='open';
        };
        reOpenSuccesCallback();

    };

    //tab active

    $scope.$on('cashierTabActive',function(){
        setTimeout(function(){$scope.refreshScroller('cashier_history');}, 200);
        setTimeout(function(){$scope.refreshScroller('cashier_shift');}, 200);
    });

}]);