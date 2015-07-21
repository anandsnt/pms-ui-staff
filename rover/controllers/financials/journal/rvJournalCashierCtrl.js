sntRover.controller('RVJournalCashierController', ['$scope','RVJournalSrv','$rootScope',function($scope,RVJournalSrv,$rootScope) {


    /**
    * fetch history details corresponding to selected user
    *
    */
    var fetchHistoryDetails = function(data){

         var fetchDetailsSuccessCallback = function(data){
            $scope.$emit('hideLoader');
            $scope.lastCashierId = data.last_cashier_period_id;
            $scope.detailsList = data.history;
            $scope.selectedHistory = ($scope.detailsList.length>0) ? 0:"";
            $scope.details = ($scope.detailsList.length>0) ?  $scope.detailsList[0] : {};//set first one as selected
            $scope.selectedHistoryId = ($scope.detailsList.length>0) ? $scope.detailsList[0].id :"";
            $scope.isLoading = false;
            setTimeout(function(){$scope.refreshScroller('cashier_history');}, 200);
            setTimeout(function(){$scope.refreshScroller('cashier_shift');}, 200);
        };

        var data =  {"user_id":$scope.data.filterData.selectedCashier,"date":$scope.data.cashierDate,"report_type_id":$scope.data.reportType};
        $scope.invokeApi(RVJournalSrv.fetchCashierDetails, data, fetchDetailsSuccessCallback);
    };

    //init
    var init = function(){

        BaseCtrl.call(this, $scope);
        $scope.errorMessage = "";
        $scope.selectedHistory = 0;
        $scope.setScroller('cashier_history', {});
        $scope.setScroller('cashier_shift', {});
        $scope.isLoading = true;
        fetchHistoryDetails();
    };

    init();


    $scope.isDateBeforeBusinnesDate = function(date){
        return ($rootScope.businessDate  !== date)?true:false;
    };

    $scope.isLastCashierPeriod = function(date){
        return ( parseInt($scope.lastCashierId) === parseInt($scope.details.id))?true:false;
    };


    /**
    * click action of individual history
    *
    */
	$scope.historyClicked = function(index){
		$scope.selectedHistory = index;
        $scope.details = $scope.detailsList[index];
        $scope.selectedHistoryId = $scope.detailsList[index].id;
	};

    /**
    * click action close shift
    *
    */
    $scope.closeShift = function(){

        var closeShiftSuccesCallback = function(data){
            $scope.$emit('hideLoader');
            $scope.detailsList[$scope.selectedHistory] = data;
            $scope.details = data;
            $scope.lastCashierId = $scope.details.id;
            $scope.data.filterData.cashierStatus = 'CLOSED';
        };
        var updateData = {};
        updateData.id = $scope.selectedHistoryId;
        var closing_balance_cash  = ($scope.details.opening_balance_cash + $scope.details.total_cash_received) - $scope.details.cash_submitted;
        var closing_balance_check = ($scope.details.opening_balance_check + $scope.details.total_check_received) - $scope.details.check_submitted;
        updateData.data ={"cash_submitted":$scope.details.cash_submitted,"check_submitted":$scope.details.check_submitted,"closing_balance_cash":closing_balance_cash,"closing_balance_check":closing_balance_check};
        $scope.invokeApi(RVJournalSrv.closeCashier, updateData, closeShiftSuccesCallback);

    };

    /**
    * click action reopen shift
    *
    */
    $scope.reOpen = function(){

        var reOpenSuccesCallback = function(data){
            $scope.$emit('hideLoader');
            $scope.detailsList[$scope.selectedHistory] = data;
            $scope.details = data;
            $scope.data.filterData.cashierStatus = 'OPEN';
        };
        var updateData = {};
        updateData.id = $scope.selectedHistoryId;
        $scope.invokeApi(RVJournalSrv.reOpenCashier, updateData, reOpenSuccesCallback);

    };

    /**
    * refresh scrollers on tab active
    *
    */

    $scope.$on('cashierTabActive',function(){
        setTimeout(function(){$scope.refreshScroller('cashier_history');}, 200);
        setTimeout(function(){$scope.refreshScroller('cashier_shift');}, 200);
    });

    /**
    * refresh data on filter change
    *
    */

     $scope.$on('refreshDetails',function(){
        fetchHistoryDetails();
    });

}]);