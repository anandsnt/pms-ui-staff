	// Summary of screen flow is listed at the end of this file
	sntZestStation.controller('zsSntIDScanCtrl', [
		'$scope',
		'$state',
		'zsEventConstants',
		'$stateParams',
		'zsGeneralSrv',
		'zsCheckinSrv',
		'zsUtilitySrv',
		'$controller',
		'$filter',
		'$timeout',
		function($scope, $state, zsEventConstants, $stateParams, zsGeneralSrv, zsCheckinSrv, zsUtilitySrv, $controller, $filter, $timeout) {

			BaseCtrl.call(this, $scope);
			$controller('sntIDCollectionBaseCtrl', {
				$scope: $scope
			});
			$controller('zsCheckinNextPageBaseCtrl', {
				$scope: $scope
			});

			var stateParams = JSON.parse($stateParams.params);
			var SCANING_PENDING = $filter('translate')('GID_SCAN_NOT_STARTED');
			var SCAN_REJECTED = $filter('translate')('GID_STAFF_REVIEW_REJECTED');
			var SCAN_ACCEPTED = $filter('translate')('GID_STAFF_REVIEW_ACCEPTED');
			var SCAN_WAITING_FOR_APPROVAL = $filter('translate')('GID_SCAN_SUCCESS');

			/* ******************* GUEST LIST *********************** */

			var setPageNumberDetails = function() {
				var itemsPerPage = 3;

				$scope.pageData = zsGeneralSrv.proceesPaginationDetails($scope.selectedReservation.guest_details, itemsPerPage, $scope.pageData.pageNumber);
			};

			$scope.paginationAction = function(isNextPage) {
				if ((isNextPage && $scope.pageData.disableNextButton) || (!isNextPage && $scope.pageData.disablePreviousButton)) {
					return;
				}
				$scope.pageData.pageNumber = isNextPage ? ++$scope.pageData.pageNumber : --$scope.pageData.pageNumber;
				setPageNumberDetails();
			};

			var demoModeScanActions = function () {

                var options = {
                    successCallBack: function(response) {
                        $scope.idScanData.selectedGuest.scannedDetails = response;
                        $scope.idScanData.selectedGuest.front_image_data = response.front_image_data;
                        $scope.idScanData.selectedGuest.back_image_data = '';
						if ($scope.idScanData.verificationMethod === 'STAFF') {
							$scope.idScanData.selectedGuest.idScanStatus = SCAN_WAITING_FOR_APPROVAL;
						} else {
							$scope.screenData.scanMode = 'FINAL_ID_RESULTS';
							refreshIDdetailsScroller();
						}
						setPageNumberDetails();
                    }
                };

                $scope.callAPI(zsCheckinSrv.getSampleAcuantIdScanDetails, options);
			};

			$scope.selectGuest = function(selectedGuest) {
				var selectGuest = _.find($scope.selectedReservation.guest_details, function(guestDetail) {
					return guestDetail.id === selectedGuest.id;
				});

				$scope.idScanData.selectedGuest = selectGuest;
				if ($scope.inDemoMode() && !$scope.idScanData.staffVerified) {
					demoModeScanActions();
				} else if (selectedGuest.idScanStatus === SCAN_ACCEPTED || $scope.idScanData.staffVerified) {
					$scope.screenData.scanMode = 'FINAL_ID_RESULTS';
					refreshIDdetailsScroller();
				} else {
					$scope.startScanning();
				}
			};

			$scope.areAllGuestsApproved = function() {
				var allGuestsScaned = _.all($scope.selectedReservation.guest_details, function(guestDetail) {
					return guestDetail.idScanStatus === SCAN_ACCEPTED;
				});

				return allGuestsScaned;
			};
			$scope.areAllGuestsScanned = function() {
				var allGuestsScaned = _.all($scope.selectedReservation.guest_details, function(guestDetail) {
					return guestDetail.idScanStatus !== SCANING_PENDING && guestDetail.idScanStatus !== SCAN_REJECTED;
				});

				return allGuestsScaned;
			};

			/* ******************* SCROLLERS *********************** */

			var refreshIDdetailsScroller = function() {
				$scope.refreshScroller('passport-validate');

				var scroller = $scope.getScroller('passport-validate');

				$timeout(function() {
					scroller.scrollTo(0, 0, 300);
				}, 0);
			};

			var refreshConfrimImagesScroller = function() {
				$scope.refreshScroller('confirm-images');

				var scroller = $scope.getScroller('confirm-images');

				$timeout(function() {
					scroller.scrollTo(0, 0, 300);
				}, 0);
			};

			$scope.acceptID = function() {
				var accpetIdSuccess = function() {
					$scope.idScanData.selectedGuest.idScanStatus = SCAN_ACCEPTED;
					$scope.screenData.scanMode = 'GUEST_LIST';
					setPageNumberDetails();
				};
				var apiParams = angular.copy($scope.idScanData.selectedGuest.scannedDetails);

				apiParams.front_image_data = $scope.idScanData.selectedGuest.front_image_data;
				apiParams.back_image_data = $scope.idScanData.selectedGuest.back_image_data;
				apiParams.reservation_id = stateParams.reservation_id;
				apiParams.guest_id = $scope.idScanData.selectedGuest.id;
				$scope.callAPI(zsCheckinSrv.savePassport, {
					params: apiParams,
					successCallBack: accpetIdSuccess
				});
			};
			var resetSscannedData = function() {
				$scope.idScanData.selectedGuest.front_image_data = '';
				$scope.idScanData.selectedGuest.back_image_data = '';
				$scope.idScanData.selectedGuest.scannedDetails = {};
			};

			$scope.rejectID = function() {
				$scope.idScanData.selectedGuest.idScanStatus = SCAN_REJECTED;
				$scope.screenData.scanMode = 'GUEST_LIST';
				setPageNumberDetails();
			};

			$scope.$on('CLEAR_PREVIOUS_DATA', resetSscannedData);

			$scope.$on('FINAL_RESULTS', function(evt, data) {
				if (data.expiration_date === 'Invalid date' || _.isEmpty(data.expiration_date)) {
					$scope.screenData.scanMode = 'EXPIRATION_DATE_INVALID';
				} else if (data.expirationStatus === 'Expired') {
					$scope.screenData.scanMode = 'ID_DATA_EXPIRED';
				} else if (!data.document_number) {
					$scope.screenData.scanMode = 'ANALYSING_ID_DATA_FAILED';
				} else if ($scope.idScanData.verificationMethod === 'STAFF') {
					$scope.idScanData.selectedGuest.scannedDetails = data;
					$scope.screenData.scanMode = 'GUEST_LIST';
					$scope.idScanData.selectedGuest.idScanStatus = SCAN_WAITING_FOR_APPROVAL;
					setPageNumberDetails();
				} else {
					$scope.idScanData.selectedGuest.scannedDetails = data;
					refreshIDdetailsScroller();
				}
			});

			$scope.showGuestList = function() {
				$scope.screenData.scanMode = 'GUEST_LIST';
			};

			$scope.$on('IMAGE_UPDATED', function(evt, data) {
				if (data.isFrontSide) {
					$scope.idScanData.selectedGuest.front_image_data = data.imageData;
				} else {
					$scope.idScanData.selectedGuest.back_image_data = data.imageData;
				}
				refreshConfrimImagesScroller();
			});

			var verfiedStaffId;
			var nextPageActions = function() {
				if (stateParams.mode === 'PICKUP_KEY') {
					$scope.zestStationData.continuePickupFlow();
				} else {
					$scope.checkinGuest(stateParams);
				}
			};

			/* ********************* STAFF VERIFICATION ************************* */

			var recordIDApproval = function() {
				// application name is set to ROVER to log staff name
				var params = {
					"id": stateParams.reservation_id,
					"user_id": verfiedStaffId,
					"application": 'ROVER',
					"action_type": "ID_REVIEWED",
					"details": []
				};

				var newData = {
					'key': 'Guests Verified With ID',
					'new_value': ''
				};
				var guestNames = _.map($scope.selectedReservation.guest_details, function(guest) {
					return guest.first_name + ' ' + guest.last_name;
				});

				newData.new_value = guestNames.join(', ');
				params.details.push(newData);

				var options = {
					params: params,
					successCallBack: nextPageActions,
					failureCallback: nextPageActions
				};

				if ($scope.inDemoMode()) {
					nextPageActions();
				} else {
					$scope.callAPI(zsGeneralSrv.recordIdVerification, options);
				}
				
			};

			$scope.doneButtonClicked = function() {
				if ($scope.idScanData.verificationMethod === 'STAFF') {
					recordIDApproval();
				} else {
					nextPageActions();
				}
			};

			$scope.scanCompleted = function() {
				$scope.screenData.scanMode = 'ADMIN_LOGIN';
				$scope.screenData.adminMode = 'WAIT_FOR_STAFF';
			};

			$scope.ringBell = function() {
				$scope.$emit('PLAY_BELL_SOUND');
			};

			$scope.adminVerify = function() {
				$scope.screenData.adminMode = 'ADMIN_PIN_ENTRY';
			};

			$scope.verifyStaff = function() {
				$scope.callBlurEventForIpad();
				var successCallback = function(response) {
					$scope.pageData.pageNumber = 1;
					setPageNumberDetails();
					$scope.screenData.adminPin = '';
					verfiedStaffId = response.user_id;
					$scope.screenData.scanMode = 'GUEST_LIST';
					$scope.idScanData.staffVerified = true;
					// For some reason keyboard did'nt dismiss even after the above code
					// TODO: investigate later
					$scope.callBlurEventForIpad();
					$scope.$emit(zsEventConstants.SHOW_BACK_BUTTON);
				};
				var failureCallback = function() {
					$scope.screenData.adminPin = '';
					$scope.screenData.adminMode = 'PIN_ERROR';
				};
				var options = {
					params: {
						'pin_code': $scope.screenData.adminPin
					},
					successCallBack: successCallback,
					failureCallBack: failureCallback
				};

				if ($scope.inDemoMode()) {
					successCallback({
						id: 123
					});
				} else {
					$scope.callAPI(zsGeneralSrv.verifyStaffByPin, options);
				}

			};

			$scope.retryPinEntry = function() {
				$scope.screenData.adminMode = 'ADMIN_PIN_ENTRY';
			};

			var goBackToScanAgain = function() {
				if ($scope.screenData.scanMode === 'FINAL_ID_RESULTS') {
					$scope.showGuestList();
				} else {
					verfiedStaffId = '';
					$scope.idScanData.staffVerified = false;
					$scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);
				}
			};
			// Back button will be only shown when staff is reviewwing
			$scope.$on(zsEventConstants.CLICKED_ON_BACK_BUTTON, goBackToScanAgain);

			$scope.$on('CREDENTIALS_VALIDATED', function() {
				$scope.screenData.scanMode = 'GUEST_LIST';
			});

			(function() {
				$scope.pageData = zsGeneralSrv.retrievePaginationStartingData();
				$scope.selectedReservation = zsCheckinSrv.getSelectedCheckInReservation();

				if (!$scope.zestStationData.kiosk_scan_all_guests) {
					$scope.selectedReservation.guest_details = _.filter($scope.selectedReservation.guest_details, function(guest) {
						return guest.is_primary;
					});
				}

				angular.forEach($scope.selectedReservation.guest_details, function(guestDetail) {
					guestDetail.idScanStatus = SCANING_PENDING;
				});
				setPageNumberDetails();

				$scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);
				$scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);

				$scope.setScreenIcon('checkin');
				$scope.idScanData = {
					mode: '',
					selectedGuest: {},
					verificationMethod: $scope.zestStationData.kiosk_scan_mode === 'id_scan_with_staff_verification' ? 'STAFF' : 'NONE', // FR will be added later
					staffVerified: false
				};
				$scope.validateSubsription();
				$scope.setScroller('passport-validate', {
					disablePointer: true, // important to disable the pointer events that causes the issues
					disableTouch: false, // false if you want the slider to be usable with touch devices
					disableMouse: false, // false if you want the slider to be usable with a mouse (desktop)
				});
				$scope.setScroller('confirm-images');
			}());
		}
	]);


	/* ***************************************************************************************************
	
	We are using Acuant webservices for retrieving data from the IDs (we are using sntIDCollection App)
	
	The screen flow is as follows,

	Guest will reach this page either from checkin flow or from pickup key flow.

	UI will check if the hotel has a valid active Acuant subscription. If no will ask guest to see staff.

	If there is a valid subsription, the guest list will be shown with a max of 3 guest + accompanying guests
	in a paginated view.

	Guests need to select from the listed guest + accompanying list to start scanning.

	For passports only front image is to be captured, for IDs both side are required.

	UI will show captured images before proceeding to analyze the images for retrieving the ID details.

	This has to be done for all the listed guest +  accompanying guests

	When the required images are added, the result can be retrived, viewed and approved with or without Staff verification.

	If staff verification is turned ON, after guest scans all guests, they will confirm they have finished scanning.

	Guest can call staff (if notification sound is enabled, they can use it for calling staff).

	Staff comes and enter their PIN code to proceed.

	***************************************************************************************************** */