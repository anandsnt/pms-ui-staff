sntRover.controller('RVWorkManagementCtrl', ['$rootScope', '$scope', 'employees', 'workTypes', 'shifts', 'floors',
	function($rootScope, $scope, employees, workTypes, shifts, floors) {

		$scope.setHeading = function(headingText) {
			$scope.heading = headingText;
		}

		$scope.setHeading("Work Management");

		$scope.workTypes = workTypes;

		$scope.employeeList = employees;

		$scope.shifts = shifts;

		$scope.floors = floors;
	}
]);