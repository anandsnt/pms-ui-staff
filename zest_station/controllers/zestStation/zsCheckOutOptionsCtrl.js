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
		$scope.zestStationData.keyCardInserted =  false;
		$scope.zestStationData.isKeyCardLookUp = false;
		sntZestStation.filter('unsafe', function($sce) {
			return function(val) {
				return $sce.trustAsHtml(val);
			};
		});
		/**
		 * when the back button clicked
		 * @param  {[type]} event
		 * @return {[type]} 
		 */
		$scope.$on(zsEventConstants.CLICKED_ON_BACK_BUTTON, function(event) {
			$state.go('zest_station.home'); //go back to reservation search results
		});

		$scope.navToPrev = function() {
			$scope.$emit(zsEventConstants.CLICKED_ON_BACK_BUTTON);
		};
		/**
		 * when we clicked on checkout from home screen
		 */
		$scope.searchByName = function() {
			$state.lastAt = 'home';
			$state.isPickupKeys = false;
			$state.mode = zsModeConstants.CHECKOUT_MODE;
			$state.go('zest_station.reservation_search', {
				mode: zsModeConstants.CHECKOUT_MODE
			});
		};


		$scope.captureKey = function() {
			$state.go('zest_station.checkout_key_card_look_up');
		};

	}
]);