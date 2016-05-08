sntZestStation.controller('zsHomeCtrl', [
	'$scope',
	'$rootScope',
	'$state',
	'zsEventConstants',
	function($scope, $rootScope, $state, zsEventConstants) {

		/**
		 * when we clicked on pickup key from home screen
		 */
		$scope.clickedOnPickUpKey = function() {
			if($scope.zestStationData.pickup_qr_scan){
				$state.go('zest_station.qrPickupKey');
			}
			else{
				$state.go('zest_station.checkOutReservationSearch',{'mode':'PICKUP_KEY'});
			}
		};

		/**
		 * when we clicked on checkin from home screen
		 */
		$scope.clickedOnCheckinButton = function() {
			$state.go('zest_station.checkInReservationSearch');
		};


		/**
		 * when we clicked on checkout from home screen
		 */
		$scope.clickedOnCheckoutButton = function() {
			if (!$scope.zestStationData.checkout_keycard_lookup) {
				$state.go('zest_station.checkOutReservationSearch');
			} else {
				$state.go('zest_station.checkoutSearchOptions');
			};
		};

		/**
		 * [initializeMe description]
		 */
		var initializeMe = function() {
			//hide back button
			$scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);

			//hide close button
			$scope.$emit(zsEventConstants.HIDE_CLOSE_BUTTON);
			//eject if any key card is inserted
			$scope.$emit('EJECT_KEYCARD');
			//set this to false always on entering home screen
			$scope.zestStationData.keyCardInserted = false;
			
            if($scope.zestStationData.workstationStatus === 'out-of-order'){
            	var params = {};
            	params.reason = $scope.zestStationData.wsFailedReason;
				params.status = 'out-of-order';
            	$scope.$emit(zsEventConstants.UPDATE_LOCAL_STORAGE_FOR_WS,params);
				$state.go('zest_station.outOfService');
			}
			else{
				//do nothing
			}
		}();


	}
]);