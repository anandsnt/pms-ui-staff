sntRover.controller('rvGroupSearchCtrl',	[
	'$scope',
	'$rootScope',
	'rvGroupSrv',
	'initialGroupListing',
	function($scope, $rootScope, rvGroupSrv, initialGroupListing) {
			
		BaseCtrl.call(this, $scope);
		
	}]);