sntRover.controller('RVWorkManagementCtrl', ['$rootScope', '$scope', 'employees', 'workTypes', 'shifts', 'floors',
	function($rootScope, $scope, employees, workTypes, shifts, floors) {

		$scope.setHeading = function(headingText) {
			$scope.heading = headingText;
			$scope.setTitle(headingText);
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
			"Arrived": "check-in",
			"Not Defined": "no-show"
		}

		$scope.arrivalClass = {
			"Arrival": "check-in",
			"Arrived": "check-in",
			"Due out": "no-show",
			"Departed": "no-show",
			"STAYOVER": "no-show",
			"Not Reserved": "no-show",
			"Not Defined": "no-show"
		}

		$scope.departureClass = {
			"Arrival": "no-show",
			"Arrived": "no-show",
			"Due out": "check-out",
			"Departed": "check-out",
			"STAYOVER": "inhouse",
			"Not Reserved": "no-show",
			"Not Defined": "no-show"
		}

		$scope.printWorkSheet = function() {
			window.print();
		}

		$scope.addDuration = function(augend, addend) {
			if (!addend) {
				return augend;
			}
			var existing = augend.split(":"),
				current = addend.split(":"),
				sumMinutes = parseInt(existing[1]) + parseInt(current[1]),
				sumHours = (parseInt(existing[0]) + parseInt(current[0]) + parseInt(sumMinutes / 60)).toString();

			return (sumHours.length < 2 ? "0" + sumHours : sumHours) +
				":" +
				((sumMinutes % 60).toString().length < 2 ? "0" + (sumMinutes % 60).toString() : (sumMinutes % 60).toString());
		}
	}
]);