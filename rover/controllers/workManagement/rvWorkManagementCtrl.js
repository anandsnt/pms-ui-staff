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

		$scope.reservationStatus = {
			"Due out": "check-out",
			"Departed": "check-out",
			"STAYOVER": "inhouse",
			"Not Reserved": "no-show",
			"Arrival": "check-in",
			"Arrived": "check-in"
		}

		$scope.arrivalClass = {
			"Arrival": "check-in",
			"Arrived": "check-in",
			"Due out": "no-show",
			"Departed": "no-show",
			"STAYOVER": "no-show",
			"Not Reserved": "no-show",
		}

		$scope.departureClass = {
			"Arrival": "no-show",
			"Arrived": "no-show",
			"Due out": "check-out",
			"Departed": "check-out",
			"STAYOVER": "inhouse",
			"Not Reserved": "no-show",
		}
	}
]);