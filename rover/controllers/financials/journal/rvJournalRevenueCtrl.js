sntRover.controller('RVJournalRevenueController', ['$scope','$rootScope', 'RVJournalSrv','$timeout',function($scope, $rootScope, RVJournalSrv, $timeout) {
	BaseCtrl.call(this, $scope);
    $scope.errorMessage = "";
   
	$scope.setScroller('revenue_content',{});
    var refreshRevenueScroller = function(){
        $timeout(function(){$scope.refreshScroller('revenue_content');}, 500);
    };

	$scope.initRevenueData = function(){
		var successCallBackFetchRevenueData = function(data){
			$scope.data.revenueData = {};
            $scope.data.selectedChargeGroup = 'ALL';
            $scope.data.selectedChargeCode  = 'ALL';
			$scope.data.revenueData = data;
            console.log(data);
            $scope.errorMessage = "";
			refreshRevenueScroller();
            $scope.$emit("ApplyEmpOrDeptFilter");
            $scope.$emit('hideLoader');

		};
		$scope.invokeApi(RVJournalSrv.fetchRevenueDataByChargeGroups, {"from":$scope.data.fromDate , "to":$scope.data.toDate}, successCallBackFetchRevenueData);
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
$krish = $scope;
    /** Handle Expand/Collapse on Level1 **/
    $scope.clickedFirstLevel = function(index1){
        var toggleItem = $scope.data.revenueData.charge_groups[index1];
        console.log(toggleItem);
        if($scope.checkHasArrowLevel1(index1)){
            toggleItem.active = !toggleItem.active;
            refreshRevenueScroller();
            // When the system is in detailed view and we are collapsing each first Level
            // We have to toggle Details to Summary on print box.
            if(!toggleItem.active && !$scope.data.isRevenueToggleSummaryActive){
                if($scope.isAllRevenuesCollapsed())
                    $scope.data.isRevenueToggleSummaryActive = true;
            }
        }
        else{
            // No data - Call API
            var successCallBackFetchRevenueData = function(data){
                console.log(data);
                $scope.data.revenueData.charge_groups[index1].charge_codes = (data.charge_codes);
                $scope.errorMessage = "";
                toggleItem.active = !toggleItem.active;
                refreshRevenueScroller();
                $scope.$emit('hideLoader');
            };
            var postData = {"from":$scope.data.fromDate , "to":$scope.data.toDate , "charge_group_id":toggleItem.id };

            $scope.invokeApi(RVJournalSrv.fetchRevenueDataByChargeCodes, postData, successCallBackFetchRevenueData);
        }
    };
    
    /** Handle Expand/Collapse on Level2 **/
    $scope.clickedSecondLevel = function(index1, index2){
        var toggleItem = $scope.data.revenueData.charge_groups[index1].charge_codes[index2];
        if($scope.checkHasArrowLevel2(index1, index2)){
            toggleItem.active = !toggleItem.active;
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

    // To get total amount of Level3 - each charge code transactions.
    $scope.getTotalAmountOfCodeItem = function(index1, index2){
        var item = $scope.data.revenueData.charge_groups[index1].charge_codes[index2].transactions;
        var total = 0;
        if((typeof item !== 'undefined') && (item.length >0)){
            angular.forEach( item ,function(transactions, index) {
                if(transactions.show) {
                    total += (transactions.debit == '' ? 0 : transactions.debit);
                    total -= (transactions.credit == '' ? 0 : transactions.credit);
                }
            });
        }
        $scope.data.revenueData.charge_groups[index1].charge_codes[index2].total = total;
        return total;
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

    // To check whether all revenue tabs are collpased or not.
    $scope.isAllRevenuesCollapsed = function(){
        var isAllTabsCollapsed = true;
        angular.forEach($scope.data.revenueData.charge_groups,function(charge_groups, key) {
            if(charge_groups.active) isAllTabsCollapsed = false;
        });
        return isAllTabsCollapsed;
    };

    // To hanlde click inside revenue tab.
    $scope.clickedOnRevenue = function($event){
        $event.stopPropagation();
        if($scope.data.isDrawerOpened){
            $rootScope.$broadcast("CLOSEPRINTBOX");
        }
    };

}]);