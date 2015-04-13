sntRover.controller('rvGroupActivityCtrl', [
	'$scope', 
	'$rootScope', 
	'$filter', 
	'$stateParams', 
	function($scope, $rootScope, $filter, $stateParams) {
		BaseCtrl.call(this, $scope);
		$scope.count = 10;
		
	}
]);