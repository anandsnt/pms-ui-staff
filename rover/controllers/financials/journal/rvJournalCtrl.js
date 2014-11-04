sntRover.controller('RVJournalController', ['$scope','$filter','$stateParams', 'ngDialog', '$rootScope','RVJournalSrv', 'journalResponse','cashierData',function($scope,$filter,$stateParams, ngDialog, $rootScope, RVJournalSrv, journalResponse,cashierData) {
		
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
    $scope.data.selectedChargeGroup = 'ALL';
    $scope.data.selectedChargeCode  = 'ALL';
    $scope.data.selectedPaymentType = 'ALL';
	/*
	 *	Setting Revenue & Payment date pickers.
	 *	All date fields should default to yesterday's date.
	 */
	var yesterday = tzIndependentDate($rootScope.businessDate);
	yesterday.setDate(yesterday.getDate()-1);
	$scope.data.fromDate = $filter('date')(yesterday, 'yyyy-MM-dd');
	$scope.data.toDate 	 = $filter('date')(yesterday, 'yyyy-MM-dd');
	$scope.data.paymentDate = $rootScope.businessDate;
    $scope.data.cashierDate = $rootScope.businessDate;
    $scope.data.isActiveRevenueFilter = false;
    $scope.data.cashierData = cashierData;
    $scope.data.activeChargeCodes = [];
    $scope.data.selectedDepartmentList = [];
    $scope.data.selectedEmployeeList = [];
    $scope.data.isDrawerOpened = false;
	$scope.data.reportType  = ""; 
	
    $scope.setScroller('employee-content');
    $scope.setScroller('department-content');

	/* Handling different date picker clicks */
	$scope.clickedFromDate = function(){
		$scope.popupCalendar('FROM');
	};
	$scope.clickedToDate = function(){
		$scope.popupCalendar('TO');
	};
	$scope.clickedPaymentDate = function(){
		$scope.popupCalendar('PAYMENT');
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

    // To toggle revenue filter.
	$scope.clickedRevenueFilter = function(){
		$scope.data.isActiveRevenueFilter = !$scope.data.isActiveRevenueFilter;
        setTimeout(function(){
            $scope.refreshScroller('employee-content');
            $scope.refreshScroller('department-content');
        }, 200);
	};

    // On selecting 'All Departments' radio button.
    $scope.selectAllDepartment = function(){
    	$scope.data.filterData.checkedAllDepartments = true;
    	$scope.clearAllDeptSelection();

        if($scope.data.activeTab == '0' ){
            $scope.resetRevenueFilters();
        }
        else if ($scope.data.activeTab == '1' ){
           $scope.resetPaymentFilters();
        }
    };

    // Clicking each checkbox on Departments
    $scope.clickedDepartment = function(index){

    	$scope.data.filterData.departments[index].checked = !$scope.data.filterData.departments[index].checked;
    	
    	if($scope.isAllDepartmentsUnchecked()) $scope.data.filterData.checkedAllDepartments = true;
    	else $scope.data.filterData.checkedAllDepartments = false;
    };

    // Unchecking all checkboxes on Departments.
    $scope.clearAllDeptSelection = function(index){
    	angular.forEach($scope.data.filterData.departments,function(item, index) {
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

    // Clicking on each Employees check boxes.
    $scope.clickedEmployees = function(selectedIndex){
        $scope.data.filterData.employees[selectedIndex].checked = !$scope.data.filterData.employees[selectedIndex].checked;
    };

    // On selecting select button.
    $scope.clickedSelectButton = function(){
    	
    	if(!$scope.data.filterData.checkedAllDepartments){

            $scope.setupDeptAndEmpList();
            $scope.data.isActiveRevenueFilter = false; // Close the entire filter box

            if($scope.data.activeTab == '0' ){
                $scope.filterRevenueByDepartmentsOrEmployees();
            }
            else if ($scope.data.activeTab == '1' ){
                $scope.filterPaymentByDepartmentsOrEmployees();
            }
        }   
    };

    // To setup Lists of selected ids of employees and departments.
    $scope.setupDeptAndEmpList = function(){

        // To get the list of departments id selected.
        $scope.data.selectedDepartmentList = [];
        angular.forEach($scope.data.filterData.departments,function(item, index) {
            if(item.checked) $scope.data.selectedDepartmentList.push(item.id);
        });

        // To get the list of employee id selected.
        $scope.data.selectedEmployeeList = [];
        angular.forEach($scope.data.filterData.employees,function(item, index) {
            if(item.checked) $scope.data.selectedDepartmentList.push(item.id);
        });
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

    // To Filter by Departments or Employees
    $scope.filterRevenueByDepartmentsOrEmployees = function(){

        $scope.resetRevenueFilters();

        // Searching for transactions having department_id/employee_id from above lists.
        angular.forEach($scope.data.revenueData.charge_groups,function(charge_groups, index1) {
            
            var isResultsFoundInCodes = false;
            angular.forEach(charge_groups.charge_codes,function(charge_codes, index2) {
                
                var isResultsFoundInTransactions = false;
                angular.forEach(charge_codes.transactions,function(transactions, index3) {

                    if( $scope.searchDeptOrEmpId(transactions) ){
                        transactions.show  = true;
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
                    charge_codes.show = true;
                    isResultsFoundInCodes = true;
                }
            });
            if(isResultsFoundInCodes){
                charge_groups.show = true;
            }
            else charge_groups.show = false;
        });
    };

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
                            transactions.show  = true;
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
                        credit_cards.show = true;
                        isResultsFoundInCards = true;
                    }

                });

                if(isResultsFoundInCards) {
                    payment_types.show = true;
                }
                else payment_types.show = false;
                
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

                if(isResultsFoundInTransactions) {
                    payment_types.show = true;
                }
                else payment_types.show = false;

            }
        });
    };

    // Reset the filters in revenue tab as in the initial case.
    // Showing only groups.
    $scope.resetRevenueFilters = function(){
        angular.forEach($scope.data.revenueData.charge_groups,function(charge_groups, index1) {
            charge_groups.show = true;
            angular.forEach(charge_groups.charge_codes,function(charge_codes, index2) {
                charge_codes.show = false;
                angular.forEach(charge_codes.transactions,function(transactions, index3) {
                    transactions.show = false;
                });
            });
        });
    };
    // Reset the filters in payment tab as in the initial case.
    // Showing only payment types.
    $scope.resetPaymentFilters = function(){
        angular.forEach($scope.data.paymentData.payment_types,function(payment_types, index1) {
            payment_types.show = true ;
            if(payment_types.payment_type == "Credit Card"){
                angular.forEach(payment_types.credit_cards,function(credit_cards, index2) {
                    credit_cards.show = false ;
                    angular.forEach(credit_cards.transactions,function(transactions, index3) {
                        transactions.show = false;
                    });
                });
            }
            else{
                angular.forEach(payment_types.transactions,function(transactions, index3) {
                    transactions.show = false;
                });
            }
        });
    };
    /** Employee/Departments Filter ends here .. **/

    /* Cahier filter starts here */
    var callCashierFilterService = function(){
    	var cashierDataFilterSuccessCallBack = function(data){
    		$scope.$emit("hideLoader");
    		console.log($scope.currentCashier)
    		console.log($scope.data.cashierDate)
    		console.log($scope.data.reportType);
    		$scope.data.cashierData = cashierData;
    	}
    	$scope.invokeApi(RVJournalSrv.fetchCashierDetails, '', cashierDataFilterSuccessCallBack);
    }
    $scope.$on('cashierDateChanged',function(){
    	//call filter service
    	callCashierFilterService();
    });

    $scope.cashierFilterChanged = function(){
       //call filter service
       callCashierFilterService();
    };

    $scope.activatedTab = function(index){
    	$scope.data.activeTab = index;
    	if(index == 0) $scope.$broadcast('revenueTabActive');
    	else if(index == 2) $scope.$broadcast('cashierTabActive');
    	else $scope.$broadcast('paymentTabActive');
    	$scope.$broadcast("CLOSEPRINTBOX");
    };
    /* Cahier filter ends here */

    
}]);