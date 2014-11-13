sntRover.controller('RVJournalRevenueController', ['$scope','$rootScope', 'RVJournalSrv','$timeout',function($scope, $rootScope, RVJournalSrv, $timeout) {
	BaseCtrl.call(this, $scope);
    $scope.errorMessage = "";

	$scope.setScroller('revenue-content');
    var refreshRevenueScroller = function(){
        setTimeout(function(){$scope.refreshScroller('revenue-content');}, 200);
    };

	$scope.initRevenueData = function(){
		var successCallBackFetchRevenueData = function(data){
			$scope.data.revenueData = {};
            $scope.data.selectedChargeGroup = 'ALL';
            $scope.data.selectedChargeCode  = 'ALL';
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

    // To get total amount of Level1 - each charge group.
    $scope.getTotalAmountOfGroupItem = function(index){
        var item = $scope.data.revenueData.charge_groups[index].charge_codes;
        var total = 0;
        if((typeof item !== 'undefined') && (item.length >0)){
            angular.forEach( item ,function(charge_codes, index2) {
                if(charge_codes.show && charge_codes.filterFlag) total += charge_codes.total;
            });
        }
        $scope.data.revenueData.charge_groups[index].total = total;
        return total;
    };

    // To get total revenue amount by adding up charge group amounts.
    $scope.getTotalOfAllChargeGroups = function(){
        var revenueTotal = 0;
        angular.forEach($scope.data.revenueData.charge_groups,function(charge_groups, index1) {
            if(charge_groups.show && charge_groups.filterFlag) revenueTotal += charge_groups.total;
        });
        return revenueTotal;
    };

    // Update amount on Revenue Tab header.
    $rootScope.$on('UpdateRevenueTabTotal',function(){
        $timeout(function() {
            var total = $scope.getTotalOfAllChargeGroups();
            $scope.data.revenueData.total_revenue = total;
        }, 100);
    });

}]);