sntZestStation.controller('zsCheckOutOptionsCtrl', [
	'$scope',
	'$state',
	'zsEventConstants',
	'zsModeConstants',
	'$stateParams',
	'$sce', 'zsTabletSrv',
	function($scope, $state, zsEventConstants,zsModeConstants, $stateParams, $sce, zsTabletSrv) {

		BaseCtrl.call(this, $scope);

		$scope.$emit(zsEventConstants.SHOW_BACK_BUTTON);
		$scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);

		$scope.$on(zsEventConstants.CLICKED_ON_BACK_BUTTON, function(event) {
			$state.go('zest_station.home');
		});
		/**
		 * when we clicked on checkout from home screen
		 */
		$scope.searchByName = function() {
			$state.go('zest_station.checkOutReservationSearch');
		};

		$scope.captureKey = function() {
			$state.go('zest_station.checkoutKeyCardLookUp');
		};
	}
]);