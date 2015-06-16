sntRover.controller('RVccTransactionsController', ['$scope','$filter','$stateParams', 'ngDialog', '$rootScope','RVccTransactionsSrv','$timeout',function($scope, $filter,$stateParams, ngDialog, $rootScope, RVccTransactionsSrv, $timeout) {
		
	BaseCtrl.call(this, $scope);	
	// Setting up the screen heading and browser title.
	$scope.$emit('HeaderChanged', $filter('translate')('MENU_CC_TRANSACTIONS'));
	$scope.setTitle($filter('translate')('MENU_CC_TRANSACTIONS'));

	$scope.data = {};
	$scope.data.activeTab = $stateParams.id == '' ? 0 : $stateParams.id;
    $scope.data.transactionDate = $rootScope.businessDate;
    
    $scope.data.isAuthToggleSummaryActive = true;
    $scope.data.isPaymentToggleSummaryActive = true;
	
	/* Handling TransactionDate date picker click */
	$scope.clickedTransactionDate = function(){
		$scope.popupCalendar('TRANSACTIONS');
	};
console.log($scope.data.activeTab);
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
    
    $scope.activatedTab = function(index){
    	$scope.data.activeTab = index;
    	
    };

    
}]);