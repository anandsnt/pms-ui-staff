sntRover.controller('RVJournalController', ['$scope','$filter','$stateParams',	function($scope,$filter,$stateParams) {
		
	BaseCtrl.call(this, $scope);	
	// Setting up the screen heading.
	$scope.$emit('HeaderChanged', $filter('translate')('MENU_JOURNAL'));
	console.log($stateParams.id);
	$scope.activeTab = $stateParams.id=='' ? 0 : $stateParams.id;


}]);