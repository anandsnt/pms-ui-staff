sntRover.controller('rvHeaderAvailabilityController', [
	'$scope', '$timeout',
	function($scope, $timeout){

		$scope.$on('$includeContentLoaded', function(event){
			$scope.$emit("hideLoader");
		});

	}
]);