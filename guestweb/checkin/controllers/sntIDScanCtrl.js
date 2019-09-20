	// Summary of screen flow is listed at the end of this file
	sntGuestWeb.controller('sntIDScanCtrl', [
		'$scope',
		'$rootScope',
		'$state',
		'$stateParams',
		'guestIDScanService',
		'checkinDetailsService',
		'$controller',
		function($scope, $rootScope, $state, $stateParams, guestIDScanService, checkinDetailsService, $controller) {

			$controller('sntIDCollectionBaseCtrl', {
				$scope: $scope
			});

			var stateParams = JSON.parse($stateParams.params);
			var SCANING_PENDING = "Not Started";
			var SCAN_ACCEPTED = "Accepted";

			$scope.checkinReservationData = checkinDetailsService.getResponseData();

			var recordIDScanActions = function(actionType, key, value) {
				value = value ? value : $scope.idScanData.selectedGuest.first_name + ' ' + $scope.idScanData.selectedGuest.last_name;
				var params = {
					"id": $scope.checkinReservationData.reservation_id,
					"application": (typeof $rootScope.application !== "undefined") ? $rootScope.application : 'WEB',
					"action_type": actionType,
					"details": [{
						"key": key,
						"new_value": value
					}]
				};

				guestIDScanService.recordReservationActions(params);
			};

			/* ******************* GUEST LIST *********************** */

			$scope.selectGuest = function(selectedGuest) {
				var selectGuest = _.find($scope.selectedReservation.guest_details, function(guestDetail) {
					return guestDetail.id === selectedGuest.id;
				});

				$scope.idScanData.selectedGuest = selectGuest;
				if (selectedGuest.idScanStatus === SCAN_ACCEPTED ) {
					$scope.screenData.scanMode = 'FINAL_ID_RESULTS';
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

			var saveFaceImage = function() {
				var avatar = $scope.idScanData.selectedGuest.faceImage.split(',').length > 1 ? $scope.idScanData.selectedGuest.faceImage.split(',')[1] : '';
				var apiParams = {
					'avatar': avatar,
					'guest_id': $scope.idScanData.selectedGuest.id,
					'reservation_id': $scope.checkinReservationData.reservation_id
				};

				guestIDScanService.saveFaceImage(apiParams);
			};

			$scope.acceptID = function() {
				var accpetIdSuccess = function() {
					$scope.idScanData.selectedGuest.idScanStatus = SCAN_ACCEPTED;
					$scope.screenData.scanMode = 'GUEST_LIST';
					recordIDScanActions('ID_ANALYZING', 'Success for the guest');
				};
				var apiParams = angular.copy($scope.idScanData.selectedGuest.scannedDetails);

				apiParams.front_image_data = $scope.idScanData.selectedGuest.front_image_data;
				apiParams.back_image_data = $scope.idScanData.selectedGuest.back_image_data;
				apiParams.reservation_id = $scope.checkinReservationData.reservation_id;
				apiParams.guest_id = $scope.idScanData.selectedGuest.id;
				if (apiParams.nationality_name) {
					delete apiParams.nationality_name;
				}
				$scope.isLoading = true;

				if ($rootScope.saveIdFaceImage && $scope.idScanData.selectedGuest.faceImage) {
					saveFaceImage();
				}
				guestIDScanService.savePassport(apiParams).then(function(response) {
					$scope.isLoading = false;
					if (response.status === 'failure') {
						$scope.netWorkError = true;
					} else {
						accpetIdSuccess();
					}
				}, function() {
					$scope.netWorkError = true;
					$scope.isLoading = false;
				});
			};
			var resetSscannedData = function() {
				$scope.idScanData.selectedGuest.front_image_data = '';
				$scope.idScanData.selectedGuest.back_image_data = '';
				$scope.idScanData.selectedGuest.scannedDetails = {};
			};


			$scope.$on('CLEAR_PREVIOUS_DATA', resetSscannedData);

			$scope.$on('FINAL_RESULTS', function(evt, data) {
				// Commented below code to avoid failures w/o expiry date
				// if (data.expiration_date === 'Invalid date' || _.isEmpty(data.expiration_date)) {
				// 	$scope.screenData.scanMode = 'EXPIRATION_DATE_INVALID';
				// 	recordIDScanActions('ID_ANALYZING', 'Failed (Invalid expiry date) for the guest');
				// }
				if (data.expirationStatus === 'Expired') {
					$scope.screenData.scanMode = 'ID_DATA_EXPIRED';
					recordIDScanActions('ID_ANALYZING', 'Failed (ID expired) for the guest');
				} else if (!data.document_number) {
					$scope.screenData.scanMode = 'ANALYSING_ID_DATA_FAILED';
					recordIDScanActions('ID_ANALYZING', 'Failed (blank ID number) for the guest');
				} else {
					$scope.idScanData.selectedGuest.scannedDetails = data;
					if ($rootScope.face_recognition_enabled) {
						$scope.screenData.scanMode = 'FACIAL_RECOGNITION_MODE';
					} 
				}
			});

			$scope.$on('FR_ANALYSIS_STARTED', function() {
				$scope.screenData.facialRecognitionInProgress = true;
				$scope.$emit('showLoader');
			});
			$scope.$on('FR_FAILED', function() {
				$scope.screenData.facialRecognitionInProgress = false;
				$scope.screenData.scanMode = 'FACIAL_RECOGNTION_FAILED';
				recordIDScanActions('ID_FACIAL_RECOGNITION', 'Failed for the guest');
			});

			$scope.$on('FR_SUCCESS', function() {
				$scope.screenData.scanMode = 'FINAL_ID_RESULTS';
				recordIDScanActions('ID_FACIAL_RECOGNITION', 'Success for the guest');
			});

			$scope.$on('IMAGE_ANALYSIS_FAILED', function(event, data) {
				var errorMessage = data && Array.isArray(data) ? data[0] + ' for the guest' : 'Failed for the guest';

				recordIDScanActions('ID_IMAGE_PROCESSING', errorMessage);
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
			});

			var nextPageActions = function() {
				$rootScope.idScanComplete = true;
				if (stateParams.mode === 'CHECKIN') {
					$state.go('checkinKeys');
				} else {
					$state.go('preCheckinStatus');
				}
			};

			$scope.doneButtonClicked = function() {
				nextPageActions();
			};

			$scope.skipIdScan = function() {
				$rootScope.idScanSkipped = true;
				nextPageActions();
			};

			$scope.toggleSkip = function() {
				$scope.idScanData.idScanSkipped = !$scope.idScanData.idScanSkipped;
			};
			
			var startScanning = function() {
				if ($scope.selectedReservation.guest_details.length > 1) {
					$scope.screenData.scanMode = 'GUEST_LIST';
				} else {
					$scope.selectGuest($scope.selectedReservation.guest_details[0]);
				}
			};

			$scope.$on('FACE_IMAGE_RETRIEVED', function(event, response) {
				$scope.idScanData.selectedGuest.faceImage = response;
			});

			(function() {
				
				$scope.selectedReservation = checkinDetailsService.getResponseData();

				if (!$rootScope.scan_all_guests) {
					$scope.selectedReservation.guest_details = _.filter($scope.selectedReservation.guest_details, function(guest) {
						return guest.is_primary;
					});
				}

				angular.forEach($scope.selectedReservation.guest_details, function(guestDetail) {
					guestDetail.idScanStatus = SCANING_PENDING;
				});
				
				
				$scope.idScanData = {
					mode: '',
					selectedGuest: {},
					verificationMethod: 'NONE', // FR will be added later
					idScanSkipped: false
				};
				startScanning();
				$scope.isLoading = false;
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

	When the required images are added, the result can be retrived and reviewed.

	***************************************************************************************************** */