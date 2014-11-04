sntRover.controller('RVJournalCashierController', ['$scope','RVJournalSrv','$rootScope',function($scope,RVJournalSrv,$rootScope) {
	
    //fetch history details corresponding to selected user
    var fetchHistoryDetails = function(data){

         var fetchDetailsSuccessCallback = function(data){
            $scope.$emit('hideLoader');
            $scope.detailsList = data.history;         
            $scope.details = ($scope.detailsList.length>0) ?  $scope.detailsList[0] : {};//set first one as selected
            $scope.selectedHistoryId = ($scope.detailsList.length>0) ? $scope.detailsList[0].id :"";            
            setTimeout(function(){$scope.refreshScroller('cashier_shift');}, 500);
        };
        
        var data =  {"user_id":$scope.data.filterData.selectedCashier,"date":$scope.data.cashierDate,"report_type_id":$scope.data.reportType};
        $scope.invokeApi(RVJournalSrv.fetchCashierDetails, data, fetchDetailsSuccessCallback);  
    };

    //init
    var init = function(){

        BaseCtrl.call(this, $scope);
        $scope.selectedHistory = 0;
        $scope.setScroller('cashier_history', {});
        $scope.setScroller('cashier_shift', {});
        setTimeout(function(){$scope.refreshScroller('cashier_history');}, 500);
        fetchHistoryDetails();
    };

    init();	
	
    //click action of individual history
	$scope.historyClicked = function(index){
		$scope.selectedHistory = index;
        $scope.details = $scope.detailsList[index];
        $scope.selectedHistoryId = $scope.detailsList[index].id;
	};

    //click action close shift
    $scope.closeShift = function(){

        var closeShiftSuccesCallback = function(){
            $scope.$emit('hideLoader');
            $scope.detailsList[$scope.selectedHistory].status = "CLOSED";
        };
        var updateData = {};
        updateData.id = $scope.selectedHistoryId;
        updateData.data ={"cash_submitted":$scope.details.cash_submitted,"check_submitted":$scope.details.check_submitted}
        $scope.invokeApi(RVJournalSrv.closeCashier, updateData, closeShiftSuccesCallback); 
     
    };

    //click action reOpen
    $scope.reOpen = function(){
        
        var reOpenSuccesCallback = function(){
            $scope.$emit('hideLoader');
            $scope.detailsList[$scope.selectedHistory].status = "OPEN";
        };
        var updateData = {};
        updateData.id = $scope.selectedHistoryId;
        $scope.invokeApi(RVJournalSrv.reOpenCashier, updateData, reOpenSuccesCallback); 

    };

    //tab active

    $scope.$on('cashierTabActive',function(){
        setTimeout(function(){$scope.refreshScroller('cashier_history');}, 200);
        setTimeout(function(){$scope.refreshScroller('cashier_shift');}, 200);
    });

     $scope.$on('refreshDetails',function(){
        fetchHistoryDetails();
    });

}]);