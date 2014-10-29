sntRover.controller('RVJournalController', ['$scope','$filter','$stateParams', 'ngDialog', '$rootScope','RVJournalSrv', 'journalResponse','cashierData',function($scope,$filter,$stateParams, ngDialog, $rootScope, RVJournalSrv, journalResponse,cashierData) {
		
	BaseCtrl.call(this, $scope);	
	// Setting up the screen heading and browser title.
	$scope.$emit('HeaderChanged', $filter('translate')('MENU_JOURNAL'));
	$scope.setTitle($filter('translate')('MENU_JOURNAL'));
	$scope.activeTab = $stateParams.id=='' ? 0 : $stateParams.id;
	$scope.data = {};
	$scope.data.filterData = {};
	$scope.data.revenueData = {};
	$scope.data.filterData = journalResponse;
	console.log(journalResponse);
	$scope.data.filterData.checkedAllDepartments = true;
	$scope.data.fromDate = $rootScope.businessDate;
    $scope.data.toDate 	= $rootScope.businessDate;
    $scope.data.cashierDate = $rootScope.businessDate;
    $scope.isActiveRevenueFilter = false;
    $scope.data.cashierData = cashierData;
    $scope.data.activeChargeCodes = [];
    $scope.data.isDrawerOpened = false;
	$scope.data.reportType  =""; 
	
	// To toggle revenue filter.
	$scope.clickedRevenueFilter = function(){
		$scope.isActiveRevenueFilter = !$scope.isActiveRevenueFilter;
	};
	$scope.clickedFromDate = function(){
		$scope.popupCalendar('FROM');
	};
	$scope.clickedToDate = function(){
		$scope.popupCalendar('TO');
	};

	$scope.clickedCashierDate = function(){
		$scope.popupCalendar('CASHIER');
	};
	// Calendar popup.
	$scope.popupCalendar = function(clickedOn) {
		$scope.clickedOn = clickedOn;
      	ngDialog.open({
	        template: '/assets/partials/financials/journal/rvJournalCalendarPopup.html',
	        controller: 'RVJournalDatePickerController',
	        className: 'single-date-picker',
	        scope: $scope
      	});
    };

    // On selecting 'All Departments' radio button.
    $scope.selectAllDepartment = function(){
    	$scope.data.filterData.checkedAllDepartments = true;
    	$scope.clearAllDeptSelection();
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
    // Clicking on each Employees radio buttons.
    $scope.clickedEmployees = function(selectedIndex){
    	// Unselecting all radio buttons on Departments except the selectedIndex.
    	angular.forEach($scope.data.filterData.employees,function(item, index) {
    		if(selectedIndex == index){
    			item.checked = true;
    			$scope.data.filterData.selectedEmployeeId = item.id;
    		}
    		else{
    			item.checked = false;
    		}
       	});
       	console.log("$scope.data.filterData.selectedEmployeeId"+$scope.data.filterData.selectedEmployeeId);
    };
    // On selecting select button.
    $scope.clickedSelectButton = function(){
    	$scope.getListOfCheckedDepartments();
    	// Close the entire filter box
    	if(!$scope.data.filterData.checkedAllDepartments) $scope.isActiveRevenueFilter = false;
    };

    $scope.getListOfCheckedDepartments = function(){
    	var selectedDepartmentList = [];
    	angular.forEach($scope.data.filterData.departments,function(item, index) {
       		if(item.checked) selectedDepartmentList.push(item.id);
       	});
       	console.log(selectedDepartmentList);
    };

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
    	$scope.activeTab = index;
    	if(index == 0) $scope.$broadcast('revenueTabActive');
    	else if(index == 2) $scope.$broadcast('cashierTabActive');
    	else $scope.$broadcast('paymentTabActive');
    	$scope.$broadcast("CLOSEPRINTBOX");
    };
    /* Cahier filter ends here */

    
}]);