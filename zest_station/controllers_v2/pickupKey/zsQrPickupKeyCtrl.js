sntZestStation.controller('zsQrPickupKeyCtrl', [
	'$scope',
	'$stateParams',
	'$state',
	'zsEventConstants',
	'$timeout',
	function($scope, $stateParams, $state, zsEventConstants, $timeout) {



		var qrScanFailed = function(){
			$scope.$emit('hideLoader');
			if($scope.zestStationData.pickup_qr_scan_fail_over){
				//provide small time out, so as to let user know what is happening
				$scope.qrCodeScanFailed = true;
			}
			else{
				$scope.talkToStaff();
			}
		};

		var initChromeAppQRCodeScanner = function() {
			if ($scope.inChromeApp) {
				//minimize the chrome app on loging out
				new chromeApp($scope.onChromeAppResponse, $scope.zestStationData.chrome_app_id, true);
				console.info("::Starting QR Code Scanner::");
			} else {
				$scope.$emit('showLoader');
				$timeout(function() {
					qrScanFailed();	
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