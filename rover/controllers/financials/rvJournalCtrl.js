sntRover.controller('RVJournalController', ['$scope','$filter','$stateParams', 'ngDialog',	function($scope,$filter,$stateParams, ngDialog) {
		
	BaseCtrl.call(this, $scope);	
	// Setting up the screen heading.
	$scope.$emit('HeaderChanged', $filter('translate')('MENU_JOURNAL'));
	console.log($stateParams.id);
	$scope.activeTab = $stateParams.id=='' ? 0 : $stateParams.id;
	$scope.popupCalendar = function() {
      ngDialog.open({
        template: '/assets/partials/guestCard/contactInfoCalendarPopup.html',
        controller: 'RVContactInfoDatePickerController',
        className: 'single-date-picker',
        scope: $scope
      });
    };

}]);