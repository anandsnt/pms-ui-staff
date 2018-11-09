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

			var stateParams = JSON.parse($stateParams.params);
			var SCANING_PENDING = $filter('translate')('GID_SCAN_NOT_STARTED');
			var SCAN_REJECTED = $filter('translate')('GID_STAFF_REVIEW_REJECTED');
			var SCAN_ACCEPTED = $filter('translate')('GID_STAFF_REVIEW_ACCEPTED');
			var SCAN_WAITING_FOR_APPROVAL = 'SCANNED';;

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

			$scope.selectGuest = function(selectedGuest) {
				var selectGuest = _.find($scope.selectedReservation.guest_details, function(guestDetail) {
					return guestDetail.id === selectedGuest.id;
				});

				$scope.idScanData.selectedGuest = selectGuest;
				if (selectedGuest.idScanStatus === SCAN_ACCEPTED ||
					$scope.idScanData.staffVerified) {
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
					return guestDetail.idScanStatus !== SCANING_PENDING;
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
				apiParams.reservation_id = stateParams.reservation_id
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

			$scope.$on('CREDENTIALS_VALIDATED', function() {
				$scope.screenData.scanMode = 'GUEST_LIST';
			});

			$scope.$on('FINAL_RESULTS', function(evt, data) {
				$scope.idScanData.selectedGuest.scannedDetails = data;
				if ($scope.idScanData.verificationMethod === 'STAFF') {
					$scope.screenData.scanMode = 'GUEST_LIST';
					$scope.idScanData.selectedGuest.idScanStatus = SCAN_WAITING_FOR_APPROVAL;
					setPageNumberDetails();
				} else {
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

			var checkIfEmailIsBlackListedOrValid = function() {
				var email = !stateParams.guest_email ? '' : stateParams.guest_email;

				return email.length > 0 && !(stateParams.guest_email_blacklisted === 'true') && zsUtilitySrv.isValidEmail(email);
			};
			var afterGuestCheckinCallback = function() {
				$scope.checkinInProgress = false;
				// if email is valid and is not blacklisted
				var haveValidGuestEmail = checkIfEmailIsBlackListedOrValid();
				var nextStateParams = {
					'guest_id': stateParams.guest_id,
					'reservation_id': stateParams.reservation_id,
					'room_no': stateParams.room_no,
					'first_name': stateParams.first_name,
					'email': stateParams.guest_email
				};

				if ($scope.zestStationData.is_kiosk_ows_messages_active) {
					$scope.setScreenIcon('checkin');
					$state.go('zest_station.checkinSuccess', nextStateParams);
				}
				// if collectiing nationality after email, but email is already valid
				else if ($scope.zestStationData.check_in_collect_nationality && haveValidGuestEmail) {
					$scope.$emit('showLoader');
					$state.go('zest_station.collectNationality', nextStateParams);
				} else if (haveValidGuestEmail) {
					$state.go('zest_station.checkinKeyDispense', nextStateParams);
				} else {
					$state.go('zest_station.checkInEmailCollection', nextStateParams);
				}
			};

			var checkinGuest = function() {
				var stateParams = JSON.parse($stateParams.params);
				var checkinParams = {
					'reservation_id': stateParams.reservation_id,
					'workstation_id': $scope.zestStationData.set_workstation_id,
					'authorize_credit_card': false,
					'do_not_cc_auth': false,
					'is_promotions_and_email_set': false,
					'is_kiosk': true,
					'signature': stateParams.signature
				};
				var options = {
					params: checkinParams,
					successCallBack: afterGuestCheckinCallback,
					failureCallBack: function() {
						$state.go('zest_station.speakToStaff', {
							'message': 'Checkin Failed.'
						});
						$scope.checkinInProgress = false;
					}
				};

				if ($scope.inDemoMode()) {
					afterGuestCheckinCallback();
				} else {
					$scope.callAPI(zsCheckinSrv.checkInGuest, options);
				}
			};
			var verfiedStaffId;
			var nextPageActions = function() {
				if (stateParams.mode === 'PICKUP_KEY' || stateParams.from_pickup_key) {
					$scope.zestStationData.continuePickupFlow();
				} else {
					checkinGuest();
				}
			};

			var callApiToRecord = function() {
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

				$scope.callAPI(zsGeneralSrv.recordIdVerification, options);
			};

			$scope.doneButtonClicked = function() {
				if ($scope.idScanData.verificationMethod === 'STAFF') {
					callApiToRecord();
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
				$scope.screenData.adminMode = 'ADMIN_PIN_ENTRY'
			};

			$scope.goToNext = function() {
				$scope.callBlurEventForIpad();
				var successCallback = function(response) {
					$scope.screenData.adminPin = '';
					verfiedStaffId = response.user_id;
					$scope.screenData.scanMode = 'GUEST_LIST';
					$scope.idScanData.staffVerified = true;
					// For some reason keyboard did'nt dismiss even after the above code
					// TODO: investigate later
					$scope.callBlurEventForIpad();
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

			$scope.goBackToScanAgain = function() {
				verfiedStaffId = '';
				$scope.idScanData.staffVerified = false;
			};

			var initializeMe = (function() {
				$scope.pageData = zsGeneralSrv.retrievePaginationStartingData();
				$scope.selectedReservation = zsCheckinSrv.getSelectedCheckInReservation();
				angular.forEach($scope.selectedReservation.guest_details, function(guestDetail) {
					guestDetail.idScanStatus = SCANING_PENDING;
				});
				setPageNumberDetails();
				$scope.$emit(zsEventConstants.HIDE_BACK_BUTTON);
				$scope.$emit(zsEventConstants.SHOW_CLOSE_BUTTON);

				$scope.setScreenIcon('checkin'); // yotel only
				$scope.idScanData = {
					mode: '',
					selectedGuest: {},
					verificationMethod: 'STAFF',
					staffVerified: false
				};
				$scope.validateSubsription();
				$scope.setScroller('passport-validate', {
					disablePointer: true, // important to disable the pointer events that causes the issues
					disableTouch: false, // false if you want the slider to be usable with touch devices
					disableMouse: false, // false if you want the slider to be usable with a mouse (desktop)
					preventDefaultException: {
						className: /(^|\s)signature-pad-layout(\s|$)/
					}
				});
				$scope.setScroller('confirm-images');
			}());
		}
	]);