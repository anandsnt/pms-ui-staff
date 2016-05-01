sntZestStation.controller('zsQrPickupKeyCtrl', [
	'$scope',
	'$stateParams',
	'$state',
	'zsEventConstants',
	'$timeout',
	function($scope, $stateParams, $state, zsEventConstants, $timeout) {


		var initChromeAppQRCodeScanner = function() {
			if ($scope.inChromeApp) {
				//minimize the chrome app on loging out
				new chromeApp($scope.onChromeAppResponse, zestStationSettings.chrome_app_id, true);
				console.info("::Starting QR Code Scanner::");
			} else {
				$scope.$emit('showLoader');
				$timeout(function() {
					//provide small time out, so as to let user know what is happening
					$scope.qrCodeScanFailed = true;
					$scope.$emit('hideLoader');
				}, 1000);
			}
		};
		/**
		 * [initializeMe description]
		 */
		var initializeMe = function() {
			//hide back button
			$scope.$emit(zsEventConstants.SHOW_BACK_BUTTON);

			//hide close button
			$scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);
			//back button action
			$scope.$on(zsEventConstants.CLICKED_ON_BACK_BUTTON, function(event) {
				$state.go('zest_station.home');
			});
			$scope.qrCodeScanFailed = false;
			initChromeAppQRCodeScanner();
		}();

		/**
		 * QR scan failure actions
		 **/

		$scope.quitQRScanMode = function() {
			//do normal QR scan
			$state.go('zest_station.checkOutReservationSearch', {
				'mode': 'PICKUP_KEY'
			});
		};
		$scope.retryQRScan = function() {
			$scope.qrCodeScanFailed = false;
			initChromeAppQRCodeScanner();
		};


	}
]);