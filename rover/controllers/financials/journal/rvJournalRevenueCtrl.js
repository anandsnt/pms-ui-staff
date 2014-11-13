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

    /** Handle Expand/Collapse on Level1 **/
    $scope.clickedFirstLevel = function(index1){
        var toggleData = $scope.data.revenueData.charge_groups[index1];
        if($scope.checkHasArrowLevel1(index1)){
            toggleData.active = !toggleData.active;
            refreshRevenueScroller(); 
        }
    };
    
    /** Handle Expand/Collapse on Level2 **/
    $scope.clickedSecondLevel = function(index1, index2){
        var toggleData = $scope.data.revenueData.charge_groups[index1].charge_codes[index2];
        if($scope.checkHasArrowLevel2(index1, index2)){
            toggleData.active = !toggleData.active;
            refreshRevenueScroller();
        }
    };

    // To show/hide table heading for Level3.
    $scope.isShowTableHeading = function(index1, index2){
        var isShowTableHeading = false;
        var item = $scope.data.revenueData.charge_groups[index1].charge_codes[index2].transactions;
        if((typeof item !== 'undefined') && (item.length >0)){
            angular.forEach( item ,function(transactions, index) {
                if(transactions.show) isShowTableHeading = true;
            });
        }
        return isShowTableHeading;
    };

    // To show/hide expandable arrow to level1
    $scope.checkHasArrowLevel1 = function(index){
        var hasArrow = false;
        var item = $scope.data.revenueData.charge_groups[index].charge_codes;
        if((typeof item !== 'undefined') && (item.length >0)){
            hasArrow = true;
        }
        return hasArrow;
    };

    // To show/hide expandable arrow to level2
    $scope.checkHasArrowLevel2 = function(index1, index2){
        var hasArrow = false;
        var item = $scope.data.revenueData.charge_groups[index1].charge_codes[index2].transactions;
        if((typeof item !== 'undefined') && (item.length >0)){
            hasArrow = true;
        }
        return hasArrow;
    };
    
}]);