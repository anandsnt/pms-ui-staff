sntRover.controller('RVJournalRevenueController', ['$scope','$rootScope', 'RVJournalSrv',function($scope, $rootScope, RVJournalSrv) {
	BaseCtrl.call(this, $scope);
    $scope.errorMessage = "";

	$scope.setScroller('revenue-content');
    var refreshRevenueScroller = function(){
        setTimeout(function(){$scope.refreshScroller('revenue-content');}, 200);
    };

	$scope.initRevenueData = function(){
		var successCallBackFetchRevenueData = function(data){
			$scope.data.revenueData = {};
			$scope.data.revenueData = data;
			$scope.$emit('hideLoader');
            $scope.errorMessage = "";
			refreshRevenueScroller();
		};
		$scope.invokeApi(RVJournalSrv.fetchRevenueData, {"from":$scope.data.fromDate , "to":$scope.data.toDate}, successCallBackFetchRevenueData);
	};
	$scope.initRevenueData();
    
    $rootScope.$on('REFRESHREVENUECONTENT',function(){
        refreshRevenueScroller();
    });

    $rootScope.$on('fromDateChanged',function(){
        $scope.initRevenueData();
    });

    $rootScope.$on('toDateChanged',function(){
        $scope.initRevenueData();
    });

    /** Handle Expand/Collapse on each revenue level items **/
    $scope.clickedFirstLevel = function(index1){
        $scope.data.revenueData.charge_groups[index1].active = !$scope.data.revenueData.charge_groups[index1].active;
        refreshRevenueScroller(); 
    };

    $scope.clickedSecondLevel = function(index1, index2){
        $scope.data.revenueData.charge_groups[index1].charge_codes[index2].active = !$scope.data.revenueData.charge_groups[index1].charge_codes[index2].active;
        refreshRevenueScroller();
    };

    $scope.isShowTableHeading = function(index1, index2){
        var isShowTableHeading = false;
        var data = $scope.data.revenueData.charge_groups[index1].charge_codes[index2].transactions;
        if(typeof data !== 'undefined' && data.length>0){
            angular.forEach(data,function(transactions, index) {
                if(transactions.show) isShowTableHeading=true;
            });
        }
        return isShowTableHeading;
    };

    $scope.checkHasArrowLevel1 = function(index){
        var hasArrow = false;
        if(typeof $scope.data.revenueData.charge_groups[index].charge_codes !== 'undefined'){
            if($scope.data.revenueData.charge_groups[index].charge_codes.length >0)
                hasArrow = true;
        }
        return hasArrow;
    };

    $scope.checkHasArrowLevel2 = function(index1, index2){
        var hasArrow = false;
        if(typeof $scope.data.revenueData.charge_groups[index1].charge_codes[index2].transactions !== 'undefined'){
            if($scope.data.revenueData.charge_groups[index1].charge_codes[index2].transactions.length >0)
                hasArrow = true;
        }
        return hasArrow;
    };

}]);