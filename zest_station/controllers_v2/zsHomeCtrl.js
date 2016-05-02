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

			//if application is launched either in chrome app or ipad go to login page
            if($scope.zestStationData.isAdminFirstLogin && ($scope.inChromeApp || $scope.isIpad)){
                $state.go('zest_station.admin');
            }
            else{
                //we want to treat other clients are normal, ie need to provide 
                //user credentials before accesing admin
                $scope.zestStationData.isAdminFirstLogin = false;
            }
		}();


	}
]);