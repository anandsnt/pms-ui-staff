sntRover.controller('RVWorkManagementCtrl', ['$rootScope', '$scope', 'employees', 'workTypes', 'shifts',
	function($rootScope, $scope, employees, workTypes, shifts) {

		$scope.setHeading = function(headingText) {
			$scope.heading = headingText;
		}

		$scope.setHeading("Work Management");

		$scope.workTypes = workTypes;

		$scope.employeeList = employees;

		$scope.shifts = shifts;
	}
]);