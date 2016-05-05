sntZestStation.controller('zsCheckinBIllDeliveryCtrl', [
	'$scope',
	'$state',
	'zsEventConstants',
	'$stateParams',
	'zsCheckinSrv',
	function($scope, $state, zsEventConstants, $stateParams, zsCheckinSrv) {

		BaseCtrl.call(this, $scope);
		
	}
]);