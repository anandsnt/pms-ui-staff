sntZestStation.controller('zsQrPickupKeyCtrl', [
    '$scope',
    '$stateParams',
    '$state',
    'zsEventConstants',
    '$timeout',
    'zsGeneralSrv',
    'zsCheckinSrv',
    function($scope, $stateParams, $state, zsEventConstants, $timeout, zsGeneralSrv, zsCheckinSrv) {

		/** ********************************************************************************************
		 **		Expected state params -----> none			  
		 **		Exit function -> onSuccessFetchReservation								
		 **																		 
		 ***********************************************************************************************/

        var onQRScanFail = function() {
            $scope.$emit('hideLoader');
            $scope.zestStationData.qrCodeScanning = false;
            if ($scope.zestStationData.pickup_qr_scan_fail_over) {
				// provide small time out, so as to let user know what is happening
                $scope.qrCodeScanFailed = true;
            } else {
                $scope.talkToStaff();
            }
        };

		// qr scan arrow
        $scope.arrowDirection = $scope.zestStationData.qr_scanner_arrow_direction ? $scope.zestStationData.qr_scanner_arrow_direction : 'right';

        var fetchReservationDetails = function(reservation_id) {
            $scope.zestStationData.qrCodeScanning = false;
			/*
			 * The Scanned QR-code returns the Reservation_id
			 *  to lookup the reservation, we need to get the Room No. + Last name
			 */
            var onFailureFetchReservation = function(response) {
                console.warn(response);
                onQRScanFail();
            };
            var onSuccessFetchReservation = function(response) {
                var reservation_status = response.reservation_card.reservation_status;
				
                if (reservation_status !== 'CHECKEDIN' && reservation_status !== 'CHECKING_OUT') {
                    onFailureFetchReservation('Reservation Status: ' + reservation_status);
                } else {
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
                }

            };


            var options = {
                params: {
                    'id': reservation_id
                },
                successCallBack: onSuccessFetchReservation,
                failureCallBack: onFailureFetchReservation
            };

            console.info('Fetching Reservation by Scanned QR Code: ', reservation_id);
            $scope.callAPI(zsCheckinSrv.fetchReservationInfo, options);

        };

		/** ************** DATALOGIC *****************/
		/**
		 *  Call back action broadcasted from root ctrl
		 **/
        var onDatalogicQRScanSuccess = function(event, data) {
            console.info('QR scanned reservation_id:------>' + data.reservation_id);
            fetchReservationDetails(data.reservation_id);
        };

		/** ************** /DATALOGIC ************************/

        $scope.scanQRCode = function() {
            if ($scope.zestStationData.qr_scanner_samsotech) {
                console.info('scan samsotech');
                samsoTechScan();
            } else {
                console.info('scan datalogic');
				// $scope.zestStationData.qr_scanner_datalogic
                initScanQRWithDatalogic();
            }
            $scope.zestStationData.qrCodeScanning = true;
        };

		/** ***************** SAMSOTECH ********************/
        var receiveSamsoTechMsg = function(evt, info) {
            console.log(arguments);
            if (typeof info.msg === typeof 'str') {
                if (info.msg.indexOf('Invalid') !== -1) {
                    $scope.at = 'input-qr-code';
                    onQRScanFail();
                    console.warn('QR Scan failed: invalid. ',info.msg);
                    $scope.runDigestCycle();
                } else if (info.msg.indexOf(' : ') !== -1) {
					// qr code coming from the samsotech will look like "PR_DF_BC1 : somevalue"
                    var reservationId = info.msg.split(' : ')[1];

                    if (reservationId) {
                        fetchReservationDetails(reservationId);
                    } else {
                        onQRScanFail();
                    }
                }
            }
        };
		// should only be listening for websocket activity 
		//		if chromeapp + samsotech is the selected reader
        var listenForWebsocketActivity = function() {
            $scope.$on('SOCKET_CONNECTED', function() {
                console.info('socket connected, start capture');
                if ($scope.zestStationData.qr_scanner_samsotech) {
                    $scope.socketOperator.CaptureQRViaPassportScanner();	
					
                } else if ($scope.zestStationData.qr_scanner_datalogic) {
                    $scope.socketOperator.CaptureQRViaDatalogic();
                }
				
            });
            $scope.$on('SOCKET_FAILED', function() {
                console.info('socket failed.');
                onQRScanFail();
            });
        };

        var samsoTechScan = function() {
            if ($scope.socketOperator.returnWebSocketObject().readyState === 1) {
                $scope.socketOperator.CaptureQRViaPassportScanner();
            } else {
                listenForWebsocketActivity();
                $scope.$emit('CONNECT_WEBSOCKET'); // connect socket
            }
        };
        var qrWithHandler = true; // if needed, switch to false to use old 'direct via usb' method with ChromeApp

        var initScanQRWithDatalogic = function() {
            console.info('::Starting QR Code Scanner via Handler::');
            if (qrWithHandler) {
				// use datalogic with the handler / websocket (*new for yotel CICO-39515)
                if ($scope.socketOperator.returnWebSocketObject().readyState === 1) {
                    console.info('websocket :: Ready');
                    $scope.socketOperator.CaptureQRViaDatalogic();
                } else {
                    console.warn('websocket :: Not Ready');
                    listenForWebsocketActivity();
                    $scope.$emit('CONNECT_WEBSOCKET'); // connect socket
                }
            } else {
				// will use the old method (chrome app/usb direct)
                if ($scope.inChromeApp && !$scope.inElectron) {
                    $scope.chromeApp.fetchQRCode();
                    console.info('::Starting QR Code Scanner::');
                } else {
                    $scope.$emit('showLoader');
                    $timeout(function() {
                        onQRScanFail();
                    }, 1000);
                }
            }

        };

		/** ***************** /SAMSOTECH ********************/


		/**
		 * [initializeMe description]
		 */
        var initializeMe = (function() {
			// hide back button
            $scope.$emit(zsEventConstants.SHOW_BACK_BUTTON);

			// hide close button
            $scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);
			// back button action
            $scope.$on(zsEventConstants.CLICKED_ON_BACK_BUTTON, function(event) {
                $state.go('zest_station.home');
            });
            $scope.qrCodeScanFailed = false;
            $scope.setScreenIcon('key');

			// 
			// we'll start the scanner up initially, and if it times-out, ignore the failure while not in that flow,
			// 
            $scope.scanQRCode();

        }());

		/** ****************** LISTENERS ***********************/

        $scope.$on('QR_SCAN_SUCCESS', onDatalogicQRScanSuccess);
        $scope.$on('QR_SCAN_FAILED', onQRScanFail);
        $scope.$on('QR_SCAN_REATTEMPT', function() {
			// need to wait at least a second to re-start the scan with datalogic device
            $timeout(function() {
                $scope.scanQRCode();
                $scope.$digest();
            }, 1000);
        });
		
        $scope.$on('QR_PASSPORT_SCAN_MSG', receiveSamsoTechMsg);

		/** ****************** /LISTENERS ***********************/
		/**
		 * QR scan failure actions
		 **/

        $scope.quitQRScanMode = function() {
			// do normal QR scan
            $state.go('zest_station.checkOutReservationSearch', {
                'mode': 'PICKUP_KEY'
            });
        };

        $scope.retryQRScan = function() {
            $scope.qrCodeScanFailed = false;
            if (qrWithHandler && $scope.zestStationData.qr_scanner_datalogic) {
				// auto-starts qr code scanning with datalogic
                $scope.scanQRCode();
            }
			// initScanQRWithDatalogic();
        };


    }
]);