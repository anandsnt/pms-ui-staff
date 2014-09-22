sntRover.controller('RVWorkManagementSingleSheetCtrl', ['$rootScope', '$scope',
	function($rootScope, $scope) {
		$scope.setHeading("Work Sheet No.{#}, {date}");

		$rootScope.setPrevState = {
			title: ('Work Management'),
			name: 'rover.workManagement.start'
		}
	}
]);