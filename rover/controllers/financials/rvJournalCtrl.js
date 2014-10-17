sntRover.controller('RVJournalController', ['$scope','$filter','$stateParams', 'ngDialog', '$rootScope',	function($scope,$filter,$stateParams, ngDialog, $rootScope) {
		
	BaseCtrl.call(this, $scope);	
	// Setting up the screen heading.
	$scope.$emit('HeaderChanged', $filter('translate')('MENU_JOURNAL'));
	console.log($stateParams.id);
	$scope.activeTab = $stateParams.id=='' ? 0 : $stateParams.id;
	$scope.popupCalendar = function() {
      ngDialog.open({
        template: '/assets/partials/financials/rvJournalCalendarPopup.html',
        controller: 'RVJournalDatePickerController',
        className: 'single-date-picker',
        scope: $scope
      });
    };

    $scope.date = $rootScope.businessDate;

}]);