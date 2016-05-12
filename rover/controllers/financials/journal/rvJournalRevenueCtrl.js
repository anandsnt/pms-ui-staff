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

        var postData = {
            "from_date":$scope.data.fromDate,
            "to_date":$scope.data.toDate,
            "employee_ids" : $scope.data.selectedEmployeeList ,
            "department_ids" : $scope.data.selectedDepartmentList
        };
		$scope.invokeApi(RVJournalSrv.fetchRevenueDataByChargeGroups, postData, successCallBackFetchRevenueData);
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
    
    // CICO-28060 : Update dates for Revenue & Payments upon changing summary dates
    $rootScope.$on('REFRESH_REVENUE_PAYMENT_DATA',function( event, date ){
        $scope.data.fromDate = date;
        $scope.data.toDate   = date;
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
                $scope.data.selectedChargeCode  = '';
            }
            $scope.errorMessage = "";
            $scope.$emit('hideLoader');
        };

        // Call api only while expanding the tab ..
        if(!toggleItem.active){

            var postData = {
                "from_date":$scope.data.fromDate,
                "to_date":$scope.data.toDate,
                "charge_group_id": toggleItem.id,
                "employee_ids" : $scope.data.selectedEmployeeList ,
                "department_ids" : $scope.data.selectedDepartmentList
            };
            $scope.invokeApi(RVJournalSrv.fetchRevenueDataByChargeCodes, postData, successCallBackFetchRevenueDataChargeCodes);
        }
        else{
            toggleItem.active = !toggleItem.active;
        }
    };

    // Load the transaction details
    var loadTransactionDeatils = function(chargeCodeItem, isFromPagination){

        var successCallBackFetchRevenueDataTransactions = function(data){

            chargeCodeItem.transactions = [];
            chargeCodeItem.transactions = data.transactions;
            chargeCodeItem.total_count = data.total_count;
            chargeCodeItem.end = chargeCodeItem.start + data.transactions.length - 1;

            if(isFromPagination){
                // Compute the start, end and total count parameters
                if(chargeCodeItem.nextAction){
                    chargeCodeItem.start = chargeCodeItem.start + $scope.data.filterData.perPage;
                }
                if(chargeCodeItem.prevAction){
                    chargeCodeItem.start = chargeCodeItem.start - $scope.data.filterData.perPage;
                }
                chargeCodeItem.end = chargeCodeItem.start + chargeCodeItem.transactions.length - 1;
            }
            else if(data.transactions.length > 0){
                chargeCodeItem.active = !chargeCodeItem.active;
            }

            refreshRevenueScroller();
            $scope.errorMessage = "";
            $scope.$emit('hideLoader');
        };

        // Call api only while expanding the tab or on pagination Next/Prev button actions ..
        if(!chargeCodeItem.active || isFromPagination){
            var postData = {
                "from_date":$scope.data.fromDate ,
                "to_date":$scope.data.toDate ,
                "charge_code_id":chargeCodeItem.id ,
                "employee_ids" : $scope.data.selectedEmployeeList ,
                "department_ids" : $scope.data.selectedDepartmentList,
                "page_no" :  chargeCodeItem.page_no,
                "per_page": $scope.data.filterData.perPage
            };
            $scope.invokeApi(RVJournalSrv.fetchRevenueDataByTransactions, postData, successCallBackFetchRevenueDataTransactions);
        }
        else {
            chargeCodeItem.active = !chargeCodeItem.active;
        }
    };

    /** Handle Expand/Collapse on Level2 **/
    $scope.clickedSecondLevel = function(index1, index2){

        var toggleItem = $scope.data.revenueData.charge_groups[index1].charge_codes[index2];

        loadTransactionDeatils(toggleItem, false);
    };

    // To show/hide expandable arrow to level1
    $scope.checkHasArrowFirstLevel = function(index){
        var hasArrow = false;
        var item = $scope.data.revenueData.charge_groups[index].charge_codes;
        if((typeof item !== 'undefined') && (item.length >0)){
            hasArrow = true;
        }
        return hasArrow;
    };

    // To show/hide expandable arrow to level2
    $scope.checkHasArrowSecondLevel = function(index1, index2){
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

    // Logic for pagination starts here ..
    $scope.loadNextSet = function(index1, index2){
        var item = $scope.data.revenueData.charge_groups[index1].charge_codes[index2];
        item.page_no ++;
        item.nextAction = true;
        item.prevAction = false;
        loadTransactionDeatils(item , true);
    };

    $scope.loadPrevSet = function(index1, index2){

        var item = $scope.data.revenueData.charge_groups[index1].charge_codes[index2];
        item.page_no --;
        item.nextAction = false;
        item.prevAction = true;
        loadTransactionDeatils(item, true);
    };

    $scope.isNextButtonDisabled = function(index1, index2){

        var item = $scope.data.revenueData.charge_groups[index1].charge_codes[index2],
            isDisabled = false;

        if(item.end >= item.total_count){
            isDisabled = true;
        }
        return isDisabled;
    };

    $scope.isPrevButtonDisabled = function(index1, index2){

        var item = $scope.data.revenueData.charge_groups[index1].charge_codes[index2],
            isDisabled = false;

        if(item.page_no === 1){
            isDisabled = true;
        }
        return isDisabled;
    };
    // Pagination logic ends ...

}]);