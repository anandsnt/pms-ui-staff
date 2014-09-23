sntRover.controller('RVWorkManagementCtrl', ['$rootScope', '$scope',
	function($rootScope, $scope) {

		$scope.setHeading = function(headingText) {
			$scope.heading = headingText;
		}

		$scope.setHeading("Work Management");

		$scope.workTypes = [{
			"id": 0,
			"name": "eu duis"
		}, {
			"id": 1,
			"name": "consectetur labore"
		}, {
			"id": 2,
			"name": "et in"
		}, {
			"id": 3,
			"name": "magna dolor"
		}, {
			"id": 4,
			"name": "incididunt voluptate"
		}, {
			"id": 5,
			"name": "dolore eu"
		}, {
			"id": 6,
			"name": "laborum Lorem"
		}];

		$scope.employeeList = [{
			"id": 0,
			"name": "Shannon Crane",
			"ticked": false,
			"checkboxDisabled": false
		}, {
			"id": 1,
			"name": "Annmarie Adkins",
			"ticked": false,
			"checkboxDisabled": false
		}, {
			"id": 2,
			"name": "Kathryn Byers",
			"ticked": false,
			"checkboxDisabled": false
		}, {
			"id": 3,
			"name": "Dorothy Cummings",
			"ticked": false,
			"checkboxDisabled": false
		}, {
			"id": 4,
			"name": "Kim Becker",
			"ticked": false,
			"checkboxDisabled": false
		}, {
			"id": 5,
			"name": "Gilmore Wilcox",
			"ticked": false,
			"checkboxDisabled": false
		}, {
			"id": 6,
			"name": "Moreno Odom",
			"ticked": false,
			"checkboxDisabled": false
		}, {
			"id": 7,
			"name": "Kirby Nichols",
			"ticked": false,
			"checkboxDisabled": false
		}, {
			"id": 8,
			"name": "Garrett Horn",
			"ticked": false,
			"checkboxDisabled": false
		}];

		$scope.workManagementMeta = {
			employees: $scope.employeeList,
			workTypes: $scope.workTypes
		}
	}
]);