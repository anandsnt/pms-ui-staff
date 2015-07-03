sntRover.controller('RVJournalController', ['$scope','$filter','$stateParams', 'ngDialog', '$rootScope','RVJournalSrv', 'journalResponse','$timeout',function($scope, $filter,$stateParams, ngDialog, $rootScope, RVJournalSrv, journalResponse, $timeout) {
		
	BaseCtrl.call(this, $scope);
	// Setting up the screen heading and browser title.
	$scope.$emit('HeaderChanged', $filter('translate')('MENU_JOURNAL'));
	$scope.setTitle($filter('translate')('MENU_JOURNAL'));

	$scope.data = {};
	$scope.data.activeTab = $stateParams.id=='' ? 0 : $stateParams.id;
	$scope.data.filterData = {};
	$scope.data.revenueData = {};
    $scope.data.paymentData = {};
	$scope.data.filterData = journalResponse;
	$scope.data.filterData.checkedAllDepartments = true;
    $scope.data.filterData.isSelectButtonActive = false;
    $scope.data.selectedChargeGroup = 'ALL';
    $scope.data.selectedChargeCode  = 'ALL';
    $scope.data.selectedPaymentType = 'ALL';
    $scope.data.reportType = "";
    $scope.data.filterTitle = "All Departments";
    
    $scope.data.isActiveRevenueFilter = false;
    $scope.data.activeChargeCodes = [];
    $scope.data.selectedDepartmentList = [];
    $scope.data.selectedEmployeeList = [];
    $scope.data.isDrawerOpened = false;
	$scope.data.reportType  = "";

    $scope.data.isRevenueToggleSummaryActive = true;
    $scope.data.isPaymentToggleSummaryActive = true;
    $scope.data.selectedCashier = "";
	
    $scope.setScroller('employee-content');
    $scope.setScroller('department-content');

    //CICO-14865 - Due to this bad architecture (calling API at diff. placed & gets the loader hidden with first API completion)
    // and no time flexiblity, going for this BAD solution
    $scope.howManyAPIgotCompleted = 0;
    
    //CICO-14865 - Due to this bad architecture (calling API at diff. placed & gets the loader hidden with first API completion)
    // and no time flexiblity, going for this BAD solution
    $scope.$on ('I_COMPLTED_THE_API_CALL', function(){
        $scope.howManyAPIgotCompleted++;

        if ($scope.howManyAPIgotCompleted == 2){
            $scope.$emit('hideLoader');
            $scope.howManyAPIgotCompleted = 0;
        }
    });
    var retrieveCashierName = function(){
        if($scope.data.filterData.selectedCashier !== ""){
            angular.forEach($scope.data.filterData.cashiers,function(item, index) {
                if(item.id == $scope.data.filterData.selectedCashier){
                   $scope.data.selectedCashier = item.name;
                }
            });
        };
    };
    retrieveCashierName();

	/* Handling different date picker clicks */
	$scope.clickedFromDate = function(){
		$scope.popupCalendar('FROM');
	};
	$scope.clickedToDate = function(){
		$scope.popupCalendar('TO');
	};
	$scope.clickedCashierDate = function(){
		$scope.popupCalendar('CASHIER');
	};
	// Show calendar popup.
	$scope.popupCalendar = function(clickedOn) {
		$scope.clickedOn = clickedOn;
      	ngDialog.open({
	        template: '/assets/partials/financials/journal/rvJournalCalendarPopup.html',
	        controller: 'RVJournalDatePickerController',
	        className: 'single-date-picker',
	        scope: $scope
      	});
    };

    /** Employee/Departments Filter starts here ..**/

    // Filter by Logged in user id.
    $scope.filterByLoggedInUser = function(){
        angular.forEach($scope.data.filterData.employees,function(item, index) {
            if(item.id == $scope.data.filterData.loggedInUserId ){
                item.checked = true;
                $scope.data.filterData.isSelectButtonActive = true;
                $scope.clickedSelectButton();
            }
        });
    };

    // To toggle revenue filter box.
	$scope.clickedRevenueFilter = function(){
		$scope.data.isActiveRevenueFilter = !$scope.data.isActiveRevenueFilter;
        setTimeout(function(){
            $scope.refreshScroller('employee-content');
            $scope.refreshScroller('department-content');
        }, 200);
	};

    $scope.refreshRevenueTab = function(){
        $rootScope.$broadcast('REFRESHREVENUECONTENT');
        $rootScope.$broadcast('UpdateRevenueTabTotal');
        $scope.data.selectedChargeGroup = 'ALL';
        $scope.data.selectedChargeCode  = 'ALL';
    };

    $scope.refreshPaymentTab = function(){
        $rootScope.$broadcast('REFRESHPAYMENTCONTENT');
        $rootScope.$broadcast('UpdatePaymentTabTotal');
        $scope.data.selectedPaymentType = 'ALL';
    };

    // On selecting 'All Departments' radio button.
    $scope.selectAllDepartment = function(){
    	$scope.data.filterData.checkedAllDepartments = true;
    	$scope.clearAllDeptSelection();
        $scope.clearAllEmployeeSelection();
        $scope.getSelectButtonStatus();

        $scope.resetRevenueFilters();
        $scope.refreshRevenueTab();
        $scope.resetPaymentFilters();
        $scope.refreshPaymentTab();

        $scope.data.filterTitle = "All Departments";
    };

    // Clicking each checkbox on Departments
    $scope.clickedDepartment = function(index){

    	$scope.data.filterData.departments[index].checked = !$scope.data.filterData.departments[index].checked;
    	$scope.getSelectButtonStatus();

    	if($scope.isAllDepartmentsUnchecked()) $scope.selectAllDepartment();
    	else $scope.data.filterData.checkedAllDepartments = false;
    };

    // Unchecking all checkboxes on Departments.
    $scope.clearAllDeptSelection = function(index){
    	angular.forEach($scope.data.filterData.departments,function(item, index) {
       		item.checked = false;
       	});
    };

    // Unchecking all checkboxes on Employees.
    $scope.clearAllEmployeeSelection = function(index){
        angular.forEach($scope.data.filterData.employees,function(item, index) {
            item.checked = false;
        });
    };

    // Checking whether all department checkboxes are unchecked or not
    $scope.isAllDepartmentsUnchecked = function(){
    	var isAllDepartmentsUnchecked = true;
    	angular.forEach($scope.data.filterData.departments,function(item, index) {
       		if(item.checked) isAllDepartmentsUnchecked = false;
       	});
       	return isAllDepartmentsUnchecked;
    };

    // Checking whether all employees checkboxes are unchecked or not
    $scope.isAllEmployeesUnchecked = function(){
        var isAllEmployeesUnchecked = true;
        angular.forEach($scope.data.filterData.employees,function(item, index) {
            if(item.checked) isAllEmployeesUnchecked = false;
        });
        return isAllEmployeesUnchecked;
    };

    // Clicking on each Employees check boxes.
    $scope.clickedEmployees = function(selectedIndex){
        $scope.data.filterData.employees[selectedIndex].checked = !$scope.data.filterData.employees[selectedIndex].checked;
        $scope.getSelectButtonStatus();
    };

    $scope.getSelectButtonStatus = function(){
        if($scope.isAllEmployeesUnchecked() && $scope.isAllDepartmentsUnchecked()){
            $scope.data.filterData.isSelectButtonActive = false;
        }
        else{
            $scope.data.filterData.isSelectButtonActive = true;
        }
    };

    // On selecting select button.
    $scope.clickedSelectButton = function(){
    	
    	if($scope.data.filterData.isSelectButtonActive){

            $scope.setupDeptAndEmpList();
            $scope.data.isActiveRevenueFilter = false; // Close the entire filter box

            $scope.filterRevenueByDepartmentsOrEmployees();
            $scope.refreshRevenueTab();
            $scope.filterPaymentByDepartmentsOrEmployees();
            $scope.refreshPaymentTab();
        }
    };

    // To setup Lists of selected ids of employees and departments.
    $scope.setupDeptAndEmpList = function(){
        var filterTitle = "";
        // To get the list of departments id selected.
        $scope.data.selectedDepartmentList = [];
        angular.forEach($scope.data.filterData.departments,function(item, index) {
            if(item.checked){
                $scope.data.selectedDepartmentList.push(item.id);
                filterTitle = item.name;
            }
        });

        // To get the list of employee id selected.
        $scope.data.selectedEmployeeList = [];
        angular.forEach($scope.data.filterData.employees,function(item, index) {
            if(item.checked){
                $scope.data.selectedEmployeeList.push(item.id);
                filterTitle = item.name;
            }
        });

        if(($scope.data.selectedDepartmentList.length + $scope.data.selectedEmployeeList.length) > 1 ){
            $scope.data.filterTitle = "Multiple";
        }
        else if( ($scope.data.selectedDepartmentList.length == 0) && ($scope.data.selectedEmployeeList.length == 0) ){
            $scope.data.filterTitle = "All Departments";
        }
        else{
            $scope.data.filterTitle = filterTitle;
        }
    };

    // Searching for employee/dept id in their respective selected lists.
    $scope.searchDeptOrEmpId = function(transactions){
        // Flag to find whether the transaction item found in departmnts/employee list.
        var itemFoundInDeptOrEmpLists = false;
        for( var i=0; i < $scope.data.selectedDepartmentList.length; i++ ){
            if($scope.data.selectedDepartmentList[i] == transactions.department_id)
                itemFoundInDeptOrEmpLists = true;
        }
        for( var i=0; i < $scope.data.selectedEmployeeList.length; i++ ){
            if($scope.data.selectedEmployeeList[i] == transactions.employee_id)
                itemFoundInDeptOrEmpLists = true;
        }
        return itemFoundInDeptOrEmpLists;
    };

    /*********************************************************************************************

        Flags used for REVENUE DATA and PAYMENTS DATA filters.

        # All flags are of type boolean true/false.

    'show'  :   Used to show / hide each items on Level1 , Level2 and Level 3.
                We will set this flag as true initially.
                While apply Department/Employee filter we will set this flag as false
                for the items we dont want to show.

    'filterFlag': Used to show / hide Level1 and Level2 based on filter flag applied on print box.
                Initially it will be true for all items.

    'active':   Used for Expand / Collapse status of each tabs on Level1 and Level2.
                Initially everything will be collapsed , so setting as false.

    ***********************************************************************************************/

    // To Filter by Departments or Employees for REVENUE data.
    $scope.filterRevenueByDepartmentsOrEmployees = function(){

        $scope.resetRevenueFilters();
        
        // Searching for transactions having department_id/employee_id from above lists.
        angular.forEach($scope.data.revenueData.charge_groups,function(charge_groups, index1) {
            
            var isResultsFoundInCodes = false;
            angular.forEach(charge_groups.charge_codes,function(charge_codes, index2) {

                var isResultsFoundInTransactions = false;
                angular.forEach(charge_codes.transactions,function(transactions, index3) {
                    
                    if( $scope.searchDeptOrEmpId(transactions) ){
                        isResultsFoundInTransactions = true;
                    }
                    else{
                        transactions.show  = false;
                    }
                });

                /*  No results on transactions matching employee_id or department_id
                 *  So we have to hide its parent tabs - charge_groups & charge_codes
                 */
                if(isResultsFoundInTransactions) {
                    isResultsFoundInCodes = true;
                }
                else{
                    charge_codes.show = false;
                }
            });
            if(isResultsFoundInCodes){
                charge_groups.active = true;
            }
            else {
                charge_groups.show = false;
            }
        });
    };

    // To Filter by Departments or Employees for PAYMENT data.
    $scope.filterPaymentByDepartmentsOrEmployees = function(){

        $scope.resetPaymentFilters();
        
        // Searching for transactions having department_id/employee_id from above lists.
        angular.forEach($scope.data.paymentData.payment_types,function(payment_types, index1) {
            
            if(payment_types.payment_type == "Credit Card"){

                var isResultsFoundInCards = false;
                angular.forEach(payment_types.credit_cards,function(credit_cards, index2) {
                    
                    var isResultsFoundInTransactions = false;
                    angular.forEach(credit_cards.transactions,function(transactions, index3) {

                        if( $scope.searchDeptOrEmpId(transactions) ){
                            isResultsFoundInTransactions = true;
                        }
                        else{
                            transactions.show  = false;
                        }
                    });

                    /*  No results on transactions matching employee_id or department_id
                     *  So we have to hide its parent tabs - charge_groups & charge_codes
                     */
                    if(isResultsFoundInTransactions) {
                        isResultsFoundInCards = true;
                    }
                    else{
                        credit_cards.show = false;
                    }

                });

                if(isResultsFoundInCards) {
                    payment_types.active = true;
                }
                else {
                    payment_types.show = false;
                }
                
            }
            else{
                var isResultsFoundInTransactions = false;
                angular.forEach(payment_types.transactions,function(transactions, index3) {
                    
                    if( $scope.searchDeptOrEmpId(transactions) ){
                        transactions.show  = true;
                        isResultsFoundInTransactions = true;
                    }
                    else{
                        transactions.show  = false;
                    }
                });

                if(!isResultsFoundInTransactions) {
                    payment_types.show = false;
                }
            }
        });
    };

    // Reset the filters in revenue tab as in the initial case.
    // Showing only groups.
    $scope.resetRevenueFilters = function(){
        
        angular.forEach($scope.data.revenueData.charge_groups,function(charge_groups, index1) {
            
            charge_groups.filterFlag = true;
            charge_groups.show = true;
            charge_groups.active = false;
            
            angular.forEach(charge_groups.charge_codes,function(charge_codes, index2) {
                
                charge_codes.filterFlag = true;
                charge_codes.show = true;
                charge_codes.active = false;
                
                angular.forEach(charge_codes.transactions,function(transactions, index3) {
                    transactions.show = true;
                });
            });
        });
    };

    // Reset the filters in payment tab as in the initial case.
    // Showing only payment types.
    $scope.resetPaymentFilters = function(){
        
        angular.forEach($scope.data.paymentData.payment_types,function(payment_types, index1) {
            
            payment_types.filterFlag = true;
            payment_types.show   = true ;
            payment_types.active = false ;
            
            if(payment_types.payment_type == "Credit Card"){
                angular.forEach(payment_types.credit_cards,function(credit_cards, index2) {
                    
                    credit_cards.filterFlag = true;
                    credit_cards.show   = true ;
                    credit_cards.active = false ;
                    
                    angular.forEach(credit_cards.transactions,function(transactions, index3) {
                        transactions.show = true;
                    });
                });
            }
            else{
                angular.forEach(payment_types.transactions,function(transactions, index3) {
                    transactions.show = true;
                });
            }
        });
    };

    if($stateParams.id == 0){
        // 2. Go to Financials -> Journal.
        // a) Upon logging in, default Tab should be Revenue
        $scope.data.activeTab = 0;
        $scope.$emit("updateRoverLeftMenu", "journals");
        // b) All employee fields should default to ALL users
        // c) All date fields should default to yesterday's date
        var yesterday = tzIndependentDate($rootScope.businessDate);
        yesterday.setDate(yesterday.getDate()-1);
        $scope.data.fromDate = $filter('date')(yesterday, 'yyyy-MM-dd');
        $scope.data.toDate   = $filter('date')(yesterday, 'yyyy-MM-dd');
        $scope.data.cashierDate = $filter('date')(yesterday, 'yyyy-MM-dd');
    }
    else if($stateParams.id == 2){
        // 1. Go to Front Office -> Cashier
        // a) Upon logging in, default Tab should be Cashier
        $scope.data.activeTab = 2;
        $scope.$emit("updateRoverLeftMenu", "cashier");
        // c) All date fields should default to Business Date
        $scope.data.fromDate = $rootScope.businessDate;
        $scope.data.toDate   = $rootScope.businessDate;
        $scope.data.cashierDate = $rootScope.businessDate;
        // b) All employee fields should default to logged in user
        $timeout(function(){
            $scope.filterByLoggedInUser();
        },2000);
    }

    /** Employee/Departments Filter ends here .. **/

    /* Cashier filter starts here */
    var callCashierFilterService = function(){
        $scope.$broadcast('refreshDetails');
    }
    $scope.$on('cashierDateChanged',function(){
    	//call filter service
    	callCashierFilterService();
    });

    $scope.cashierFilterChanged = function(){
       //call filter service
       callCashierFilterService();
       retrieveCashierName();
    };

    /* Cashier filter ends here */

    $scope.activatedTab = function(index){
    	$scope.data.activeTab = index;
    	if(index == 0) $rootScope.$broadcast('REFRESHREVENUECONTENT');
    	else if(index == 2) $scope.$broadcast('cashierTabActive');
    	else $rootScope.$broadcast('REFRESHPAYMENTCONTENT');
    	$scope.$broadcast("CLOSEPRINTBOX");
        $scope.data.isActiveRevenueFilter = false;
    };

    // Utility method use to check data being blank or undefined.
    $scope.escapeNullData = function(data){

        var returnData = data;

        if((data == "") || (typeof data == 'undefined') || (data == null)){
            returnData = '-';
        }
        
        return returnData;
    };

    /* get the time string from the date-time string */

    $scope.getTimeString = function(date, time){
        var date = $filter('date')(date, $rootScope.dateFormat);
        return date + ', ' + time;
    };
    // CICO-12472 Apply Employee or Department filter
    $scope.$on('ApplyEmpOrDeptFilter',function(){
        $scope.clickedSelectButton();
    });

}]);