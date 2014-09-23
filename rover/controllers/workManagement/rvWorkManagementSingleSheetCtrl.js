sntRover.controller('RVWorkManagementSingleSheetCtrl', ['$rootScope', '$scope', '$stateParams',
	function($rootScope, $scope, $stateParams) {
		$scope.setHeading("Work Sheet No."+ $stateParams.id +", " + $stateParams.date);

		$rootScope.setPrevState = {
			title: ('Work Management'),
			name: 'rover.workManagement.start'
		}
	}
]);