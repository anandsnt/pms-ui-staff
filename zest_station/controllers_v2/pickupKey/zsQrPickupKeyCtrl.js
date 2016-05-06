sntZestStation.controller('zsQrPickupKeyCtrl', [
	'$scope',
	'$stateParams',
	'$state',
	'zsEventConstants',
	'$timeout',
	'zsGeneralSrv',
	function($scope, $stateParams, $state, zsEventConstants, $timeout, zsGeneralSrv) {



		var qrScanFailed = function() {
			$scope.$emit('hideLoader');
			if ($scope.zestStationData.pickup_qr_scan_fail_over) {
				//provide small time out, so as to let user know what is happening
				$scope.qrCodeScanFailed = true;
			} else {
				$scope.talkToStaff();
			}
		};



		var fetchReservationDetails = function(reservation_id) {
			/*
			 * The Scanned QR-code returns the Reservation_id
			 *  to lookup the reservation, we need to get the Room No. + Last name
			 *  then just do the reservation search like normal.
			 *  
			 *  Well i am not convinced by above comment, why do we need to find reservation 
			 *  by room no and last name when we already have reservation id ? 
			 *  Using that itslef now, as i don't have time --  resheil
			 *  
			 */
			var room_no, last_name;

			var reservation_id = reservation_id;

			var onFailureFetchReservation = function(response) {
				console.warn(response);
				qrScanFailed();
			};
			var onSuccessFetchReservation = function(response) {
				var room_no = response.reservation_card.room_number;
				var onFetchGuestDataSuccess = function(guest_response) {
					var stateParams = {
						'reservation_id': reservation_id,
						'room_no': room_no,
						'first_name': guest_response.primary_guest_details.first_name
					};
					$state.go('zest_station.pickUpKeyDispense', stateParams);
				};


				var options = {
					params: {
						'id': reservation_id
					},
					successCallBack: onFetchGuestDataSuccess,
					failureCallBack: onFailureFetchReservation
				};
				$scope.callAPI(zsGeneralSrv.fetchGuestDetails, options);
			};


			var options = {
				params: {
					'reservation_id': reservation_id
				},
				successCallBack: onSuccessFetchReservation,
				failureCallBack: onFailureFetchReservation
			};
			console.info('Fetching Reservation by Scanned QR Code: ', reservation_id);
			$scope.callAPI(zsGeneralSrv.fetchReservationDetails, options);

		};

		/**
		*  Call back action broadcasted from root ctrl
		**/
		$scope.$on('QR_SCAN_SUCCESS', function(event, data) {
			console.info("QR scanned reservation_id:------>"+data.reservation_id);
			fetchReservationDetails(data.reservation_id);
		});

		var initChromeAppQRCodeScanner = function() {
			if ($scope.inChromeApp) {
				$scope.chromeApp.fetchQRCode();
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