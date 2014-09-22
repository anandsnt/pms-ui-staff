sntRover.controller('RVWorkManagementCtrl', ['$rootScope', '$scope',
	function($rootScope, $scope) {

		$scope.setHeading = function(headingText) {
			$scope.heading = headingText;
		}

		$scope.setHeading("Work Management");
	}
]);