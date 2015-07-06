sntRover.controller('RVJournalRevenueController', ['$scope','$rootScope', 'RVJournalSrv','$timeout',function($scope, $rootScope, RVJournalSrv, $timeout) {
	BaseCtrl.call(this, $scope);
    $scope.errorMessage = "";
   
	$scope.setScroller('revenue_content',{});
    var refreshRevenueScroller = function(){
        $timeout(function(){$scope.refreshScroller('revenue_content');}, 500);
    };

    var fetchDepartments = function(){
        var successCallBackFetchDepartment = function(data){
            $scope.data.filterData.departments = data.departments;
            $scope.$emit('hideLoader');
        };
        $scope.invokeApi(RVJournalSrv.fetchDepartments, {}, successCallBackFetchDepartment);
    };

	var initRevenueData = function(){
        
		var successCallBackFetchRevenueData = function(data){
			$scope.data.revenueData = {};
            $scope.data.activeChargeGroups = [];
            $scope.data.selectedChargeGroup = '';
            $scope.data.selectedChargeCode  = '';
			$scope.data.revenueData = data;
            $scope.data.activeChargeGroups = data.charge_groups;
            $scope.errorMessage = "";
			refreshRevenueScroller();
            $scope.$emit('hideLoader');
		};
		$scope.invokeApi(RVJournalSrv.fetchRevenueDataByChargeGroups, { "from":$scope.data.fromDate , "to":$scope.data.toDate }, successCallBackFetchRevenueData);
    };

	initRevenueData();
    
    fetchDepartments();

    $rootScope.$on('REFRESHREVENUECONTENT',function(){
        refreshRevenueScroller();
    });

    $rootScope.$on('fromDateChanged',function(){
        initRevenueData();
    });

    $rootScope.$on('toDateChanged',function(){
        initRevenueData();
    });

    /** Handle Expand/Collapse on Level1 **/
    $scope.clickedFirstLevel = function(index1){

        var toggleItem = $scope.data.revenueData.charge_groups[index1];
            
        var successCallBackFetchRevenueDataChargeCodes = function(data){
            if(data.charge_codes.length > 0){
                toggleItem.charge_codes = data.charge_codes;
                toggleItem.active = !toggleItem.active;
                refreshRevenueScroller();
            }
            $scope.errorMessage = "";
            $scope.$emit('hideLoader');
        };
        
        // Call api only while expanding the tab ..
        if(!toggleItem.active){
            var postData = { "from":$scope.data.fromDate , "to":$scope.data.toDate , "charge_group_id":toggleItem.id };
            $scope.invokeApi(RVJournalSrv.fetchRevenueDataByChargeCodes, postData, successCallBackFetchRevenueDataChargeCodes);
        }
        else{
            toggleItem.active = !toggleItem.active;
        }
    };
    
    /** Handle Expand/Collapse on Level2 **/
    $scope.clickedSecondLevel = function(index1, index2){
        var toggleItem = $scope.data.revenueData.charge_groups[index1].charge_codes[index2];
        
        var successCallBackFetchRevenueDataTransactions = function(data){
            if(data.transactions.length >0){
                toggleItem.transactions = data.transactions;
                toggleItem.active = !toggleItem.active;
                refreshRevenueScroller();
            }
            $scope.errorMessage = "";
            $scope.$emit('hideLoader');
        };

        // Call api only while expanding the tab ..
        if(!toggleItem.active){
            var postData = {
                "from_date":$scope.data.fromDate ,
                "to_date":$scope.data.toDate ,
                "charge_code_id":toggleItem.id ,
                "employee_ids" : $scope.data.selectedEmployeeList ,
                "department_ids" : $scope.data.selectedDepartmentList
            };
            $scope.invokeApi(RVJournalSrv.fetchRevenueDataByTransactions, postData, successCallBackFetchRevenueDataTransactions);
        }
        else{
            toggleItem.active = !toggleItem.active;
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

    // To hanlde click inside revenue tab.
    $scope.clickedOnRevenue = function($event){
        $event.stopPropagation();
        if($scope.data.isDrawerOpened){
            $rootScope.$broadcast("CLOSEPRINTBOX");
        }
        $scope.errorMessage = "";
    };

}]);