sntRover.controller('RVJournalController', ['$scope','$filter','$stateParams', 'ngDialog', '$rootScope','RVJournalSrv', 'journalResponse','$timeout','rvPermissionSrv',function($scope, $filter,$stateParams, ngDialog, $rootScope, RVJournalSrv, journalResponse, $timeout, rvPermissionSrv) {

	BaseCtrl.call(this, $scope);
	// Setting up the screen heading and browser title.
	$scope.$emit('HeaderChanged', $filter('translate')('MENU_JOURNAL'));
	$scope.setTitle($filter('translate')('MENU_JOURNAL'));

	$scope.data = {};
	$scope.data.filterData = {};
    $scope.data.summaryData = {};
	$scope.data.revenueData = {};
    $scope.data.paymentData = {};
	$scope.data.filterData = journalResponse;
	$scope.data.filterData.checkedAllDepartments = true;
    $scope.data.filterData.isSelectButtonActive = false;
    $scope.data.filterData.perPage = 50;    // For pagination
    $scope.data.selectedChargeGroup = '';
    $scope.data.selectedChargeCode  = '';
    $scope.data.selectedPaymentType = '';
    $scope.data.filterTitle = "All Departments";

    $scope.data.isActiveRevenueFilter = false;
    $scope.data.activeChargeGroups = [];
    $scope.data.activeChargeCodes = [];
    $scope.data.activePaymentTypes = [];
    $scope.data.selectedDepartmentList = [];
    $scope.data.selectedEmployeeList = [];
    $scope.data.isDrawerOpened = false;
	$scope.data.reportType  = "";
    $scope.data.isShowSummaryTab  = true;

    $scope.data.isRevenueToggleSummaryActive = true;
    $scope.data.isPaymentToggleSummaryActive = true;
    $scope.data.selectedCashier = "";
    $scope.data.activePaymentTab = "";
    $scope.setScroller('employee-content');
    $scope.setScroller('department-content');
    $scope.data.selectedDepartmentName = [];
    $scope.data.selectedDepartmentName.push('All Departments');

    var retrieveCashierName = function(){
        if($scope.data.filterData.selectedCashier !== ""){
            angular.forEach($scope.data.filterData.cashiers,function(item, index) {
                if(item.id === $scope.data.filterData.selectedCashier){
                   $scope.data.selectedCashier = item.name;
                }
            });
        };
    };
    retrieveCashierName();

    // Show calendar popup.
    var popupCalendar = function(clickedOn) {
        $scope.clickedOn = clickedOn;
        ngDialog.open({
            template: '/assets/partials/financials/journal/rvJournalCalendarPopup.html',
            controller: 'RVJournalDatePickerController',
            className: 'single-date-picker',
            scope: $scope
        });
    };

	/* Handling different date picker clicks */
	$scope.clickedFromDate = function(){
		popupCalendar('FROM');
	};
	$scope.clickedToDate = function(){
		popupCalendar('TO');
	};
	$scope.clickedCashierDate = function(){
		popupCalendar('CASHIER');
	};

    // Filter by Logged in user id.
    var filterByLoggedInUser = function(){
        angular.forEach($scope.data.filterData.employees,function(item, index) {
            if(item.id === $scope.data.filterData.loggedInUserId ){
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

    // Checking whether all department checkboxes are unchecked or not
    var isAllDepartmentsUnchecked = function(){
        var flag = true;
        angular.forEach($scope.data.filterData.departments,function(item, index) {
            if(item.checked) {
                flag = false;
            }
        });
        return flag;
    };

    var getSelectButtonStatus = function(){
        if(isAllEmployeesUnchecked() && isAllDepartmentsUnchecked()){
            $scope.data.filterData.isSelectButtonActive = false;
        }
        else{
            $scope.data.filterData.isSelectButtonActive = true;
        }
    };

    // Unchecking all checkboxes on Departments.
    var clearAllDeptSelection = function(index){
        angular.forEach($scope.data.filterData.departments,function(item, index) {
            item.checked = false;
        });
    };

    // Unchecking all checkboxes on Employees.
    var clearAllEmployeeSelection = function(index){
        angular.forEach($scope.data.filterData.employees,function(item, index) {
            item.checked = false;
        });
    };

    // Checking whether all employees checkboxes are unchecked or not
    var isAllEmployeesUnchecked = function(){
        var flag = true;
        angular.forEach($scope.data.filterData.employees,function(item, index) {
            if(item.checked) {
                flag = false;
            }
        });
        return flag;
    };

    // On selecting 'All Departments' radio button.
    $scope.selectAllDepartment = function(){
    	$scope.data.filterData.checkedAllDepartments = true;
    	clearAllDeptSelection();
        clearAllEmployeeSelection();
        getSelectButtonStatus();

        $scope.data.filterTitle = "All Departments";
    };

    // Clicking each checkbox on Departments
    $scope.clickedDepartment = function(index){

    	$scope.data.filterData.departments[index].checked = !$scope.data.filterData.departments[index].checked;
        getSelectButtonStatus();

        if(isAllDepartmentsUnchecked()) {
            $scope.selectAllDepartment();
        }
        else {
            $scope.data.filterData.checkedAllDepartments = false;
        };
    };

    // Clicking on each Employees check boxes.
    $scope.clickedEmployees = function(selectedIndex){
        $scope.data.filterData.employees[selectedIndex].checked = !$scope.data.filterData.employees[selectedIndex].checked;
        getSelectButtonStatus();
    };

    // To setup Lists of selected ids of employees and departments.
    var setupDeptAndEmpList = function(){
        var filterTitle = "";
        // To get the list of departments id selected.
        $scope.data.selectedDepartmentList = [];
        $scope.data.selectedDepartmentName = [];
        angular.forEach($scope.data.filterData.departments,function(item, index) {
            if(item.checked){
                $scope.data.selectedDepartmentList.push(item.id);
                $scope.data.selectedDepartmentName.push(item.name);
                console.log()
                filterTitle = item.name;
            }
        });

        // To get the list of employee id selected.
        $scope.data.selectedEmployeeList = [];
        $scope.data.selectedEmployeesName = [];
        angular.forEach($scope.data.filterData.employees,function(item, index) {
            if(item.checked){
                $scope.data.selectedEmployeeList.push(item.id);
                $scope.data.selectedEmployeesName.push(item.name);
                filterTitle = item.name;
            }
        });

        if(($scope.data.selectedDepartmentList.length + $scope.data.selectedEmployeeList.length) > 1 ){
            $scope.data.filterTitle = "Multiple";
        }
        else if( ($scope.data.selectedDepartmentList.length === 0) && ($scope.data.selectedEmployeeList.length === 0) ){
            $scope.data.filterTitle = "All Departments";
            $scope.data.selectedDepartmentName = [];
            $scope.data.selectedDepartmentName.push('All Departments');
        }
        else{
            $scope.data.filterTitle = filterTitle;
        }
    };

    // On selecting select button.
    $scope.clickedSelectButton = function(){
        console.log($scope.data.filterData);

        if($scope.data.filterData.isSelectButtonActive){
            setupDeptAndEmpList();
            $scope.data.isActiveRevenueFilter = false; // Close the entire filter box
        }
    };

    if( $stateParams.id === 'CASHIER' ){
        // if we come from the cashier scenario, we should not display the summary screen at all
        $scope.data.isShowSummaryTab = false;
        // 1. Go to Front Office -> Cashier
        // a) Upon logging in, default Tab should be Cashier
        $scope.data.activeTab = 'CASHIER';
        $scope.$emit("updateRoverLeftMenu", "cashier");
        // c) All date fields should default to Business Date
        $scope.data.fromDate = $rootScope.businessDate;
        $scope.data.toDate   = $rootScope.businessDate;
        $scope.data.cashierDate = $rootScope.businessDate;
        $scope.data.summaryDate = $rootScope.businessDate;
        // b) All employee fields should default to logged in user
        $timeout(function(){
            filterByLoggedInUser();
        },2000);
    }
    else{
        // 2. Go to Financials -> Journal.
        // a) Upon logging in, default Tab should be SUMMARY
        $scope.data.activeTab = 'SUMMARY';
        $scope.$emit("updateRoverLeftMenu", "journals");
        // b) All employee fields should default to ALL users
        // c) All date fields should default to yesterday's date
        var yesterday = tzIndependentDate($rootScope.businessDate);
        yesterday.setDate(yesterday.getDate()-1);
        $scope.data.fromDate = $filter('date')(yesterday, 'yyyy-MM-dd');
        $scope.data.toDate   = $filter('date')(yesterday, 'yyyy-MM-dd');
        $scope.data.cashierDate = $filter('date')(yesterday, 'yyyy-MM-dd');
        $scope.data.summaryDate = $filter('date')(yesterday, 'yyyy-MM-dd');
    }

    /** Employee/Departments Filter ends here .. **/

    /* Cashier filter starts here */
    var callCashierFilterService = function(){
        $scope.$broadcast('refreshDetails');
    };
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

    $scope.activatedTab = function(tabName){
    	$scope.data.activeTab = tabName;
    	if(tabName === 'REVENUE') {
            $rootScope.$broadcast('REFRESHREVENUECONTENT');
        }
    	else if(tabName === 'CASHIER') {
            $scope.$broadcast('cashierTabActive');
        }
    	else if(tabName === 'PAYMENTS'){
            $rootScope.$broadcast('REFRESHPAYMENTCONTENT');
        }
    	$scope.$broadcast("CLOSEPRINTBOX");
        $scope.data.isActiveRevenueFilter = false;
    };

    // Utility method use to check data being blank or undefined.
    $scope.escapeNullData = function(data){

        var returnData = data;

        if((data === "") || (typeof data === 'undefined') || (data === null)){
            returnData = '-';
        }

        return returnData;
    };

    /* get the time string from the date-time string */

    $scope.getTimeString = function(date, time){
        var date = $filter('date')(date, $rootScope.dateFormat);
        return date + ', ' + time;
    };

    /* To PRINT Summary Deatils */
    $scope.printSummary = function(){
        $scope.$broadcast("PRINTSUMMARY");
    };

}]);