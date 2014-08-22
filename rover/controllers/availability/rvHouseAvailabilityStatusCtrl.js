sntRover.controller('RVHouseAvailabilityStatusCtrl', [
	'$scope', 
	'$timeout', 
	'ngDialog', 
	'$rootScope',
	'$filter',
	'rvAvailabilitySrv',
	function($scope, $timeout, ngDialog, $rootScope, $filter, rvAvailabilitySrv){
		$s = $scope;
		
		$scope.$on('$includeContentLoaded', function(event){
			$scope.$emit("hideLoader");
		});

	}
]);