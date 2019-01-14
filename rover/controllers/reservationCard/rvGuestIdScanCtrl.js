sntRover.controller('rvGuestIdScanCtrl', ['$scope',
	'$rootScope',
	'$filter',
	'ngDialog',
	'RVGuestCardsSrv',
	'dateFilter',
	'$timeout',
	'$controller',
	'sntIDCollectionSrv',
	'sntIDCollectionUtilsSrv',
	function($scope, $rootScope, $filter, ngDialog, RVGuestCardsSrv, dateFilter, $timeout, $controller, sntIDCollectionSrv, sntIDCollectionUtilsSrv) {

		BaseCtrl.call(this, $scope);

		$controller('sntIDCollectionBaseCtrl', {
			$scope: $scope
		});

		$scope.screenData.showBackSideScan = false;
		var faceImage;

		var dateInHotelsFormat = function(date) {
			var dateFormat = $rootScope.dateFormat ? $rootScope.dateFormat.toUpperCase() : 'MM-DD-YYYY';
			
			return moment(date, 'MM-DD-YYYY').format(dateFormat);
		};

		$scope.guestIdData.dob_for_display = $scope.guestIdData.date_of_birth ? dateInHotelsFormat($scope.guestIdData.date_of_birth) : '';
		$scope.guestIdData.expiry_date_for_display = $scope.guestIdData.expiration_date ? dateInHotelsFormat($scope.guestIdData.expiration_date) : '';
		$scope.guestIdData.errorMessage = "";

		var isIDDetailsChanged = false;

		if ($scope.guestIdData.document_type && $scope.guestIdData.document_type.length > 0) {
			$scope.guestIdData.document_type = $scope.guestIdData.document_type.toUpperCase();
		}

		var scrollOptions = {
			preventDefaultException: {
				tagName: /^(INPUT|SELECT|BUTTON)$/
			},
			tap: true,
			preventDefault: false,
			deceleration: 0.0001,
			preventDefault: false
		};

		$scope.setScroller('id-details', scrollOptions);
		$scope.refreshScroller('id-details');
   

		$scope.callAPI(RVGuestCardsSrv.fetchNationsList, {
			params: {},
			successCallBack: function(response) {
				$scope.countyList = response;
			}
		});

		$scope.closeGuestIdModal = function() {
			if (isIDDetailsChanged) {
				$scope.$emit('ON_GUEST_ID_POPUP_CLOSE');
			}
			ngDialog.close();
		};

		var dobDialog,
			expirationDateDialog,
			errorPopup;

		$scope.dateOfBirthdateOptions = {
			changeYear: true,
			changeMonth: true,
			maxDate: tzIndependentDate($rootScope.businessDate),
			yearRange: "-100:+0",
			onSelect: function() {
				$scope.guestIdData.dob_for_display =  dateInHotelsFormat($scope.guestIdData.date_of_birth);
				dobDialog.close();
			}
		};

		$scope.openDobCalendar = function() {
			dobDialog = ngDialog.open({
				template: '/assets/partials/guestId/rvGuestIDDobCalendar.html',
				className: 'single-date-picker',
				scope: $scope
			});
		};

		$scope.idExpiryDateOptions = {
			changeYear: true,
			changeMonth: true,
			yearRange: "-10:+50",
			defaultDate: new Date(),
			onSelect: function() {
				$scope.guestIdData.expiry_date_for_display =  dateInHotelsFormat($scope.guestIdData.expiration_date);
				expirationDateDialog.close();
			}
		};

		$scope.openExpiryCalendar = function() {
			// To solve isssue with initial date selection, 
			// set current date as default and pass to API only if a selection is made
			if (!$scope.guestIdData.expiration_date) {
				$scope.guestIdData.expiration_date = $filter('date')(new Date(), 'mm-dd-yy');
			}
			expirationDateDialog = ngDialog.open({
				template: '/assets/partials/guestId/rvGuestIDExpiryCalendar.html',
				className: 'single-date-picker',
				scope: $scope
			});
		};

		$scope.uploadFrontImage = function() {
			$('#front-image-upload').trigger('click');
		};

		$scope.uploadBackImage = function() {
			$('#back-image-upload').trigger('click');
		};

		var markIDDetailsHasChanged = function() {
			isIDDetailsChanged = true;
		};

		var generalFailureCallBack = function() {
			errorPopup = ngDialog.open({
				template: '/assets/partials/guestId/rvGuestIDDetailsErrorPopup.html',
				className: 'single-date-picker',
				scope: $scope
			});
		};

		$scope.closeErrorPopup = function() {
			$scope.guestIdData.errorMessage = "";
			errorPopup.close();
		};

		$scope.clearDob = function() {
			$scope.guestIdData.dob_for_display = '';
			$scope.guestIdData.date_of_birth = '';
		};

		$scope.clearExpiryDate = function() {
			$scope.guestIdData.expiry_date_for_display = '';
			$scope.guestIdData.expiration_date = '';
		};

		var formatDateForApi = function(date) {
			// API expects date in format dd-mm-yyyyy
			var dateComponents = date.split("-");

			return dateComponents[1] + '-' + dateComponents[0] + '-' + dateComponents[2];
		};
		var isTheImageValid = function(encoded) {
			var result = null;

			if (typeof encoded !== 'string') {
				return false;
			}

			var mime = encoded.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);

			if (mime && mime.length) {
				result = mime[1];
			}

			var isValidImage = result && (result === "image/png" ||
				result === "image/jpeg" ||
				result === "image/gif" ||
				result === "image/bmp" ||
				result === "image/webp" ||
				result === "image/x-icon" ||
				result === "image/vnd.microsoft.icon");

			return isValidImage;
		};

		$scope.ImageChange = function(imageType) {
			var imageData = imageType === 'front-image' ? $scope.guestIdData.front_image_data : $scope.guestIdData.back_image_data;

			if (!isTheImageValid(imageData)) {
				$scope.guestIdData.errorMessage = imageType === 'front-image' ? 'Front side Image...wrong file type!' : 'Back side Image...wrong file type!';
				$scope.guestIdData.front_image_data = imageType === 'front-image' ? '' : $scope.guestIdData.front_image_data;
				$scope.guestIdData.back_image_data = imageType === 'back-image' ? '' : $scope.guestIdData.back_image_data;
				generalFailureCallBack();
			}
		};

		var saveFaceImage = function() {
			var apiParams = {
				'image': faceImage,
				'guest_id': $scope.guestIdData.guest_id
			};

			$scope.callAPI(RVGuestCardsSrv.saveFaceImage, {
				params: apiParams,
				loader: 'NONE'
			});
		};

		$scope.saveGuestIdDetails = function(action, imageType) {

			var apiParams = angular.copy($scope.guestIdData);

			apiParams.reservation_id = $scope.reservationData.reservation_card.reservation_id;
			apiParams.document_type = $scope.guestIdData.document_type ? $scope.guestIdData.document_type : 'ID_CARD';

			apiParams.date_of_birth = apiParams.date_of_birth ? formatDateForApi(apiParams.date_of_birth) : '';
			apiParams.expiration_date = apiParams.expiration_date && apiParams.expiry_date_for_display ? formatDateForApi(apiParams.expiration_date) : '';

			delete apiParams.expiry_date_for_display;
			delete apiParams.dob_for_display;
            delete apiParams.nationality;
            delete apiParams.errorMessage;

			if (action === 'DELETE') {
				apiParams.front_image_data = (imageType === 'front-image') ? '' : apiParams.front_image_data;
				apiParams.back_image_data = (imageType === 'back-image') ? '' : apiParams.back_image_data;
				apiParams.action_type = (imageType === 'front-image') ? 'Delete front image' : 'Delete back image';
			}

			var saveSuccessCallBack;

			if (action === 'DELETE') {
				saveSuccessCallBack = function() {
					$scope.guestIdData.front_image_data = (imageType === 'front-image') ? '' : $scope.guestIdData.front_image_data;
					$scope.guestIdData.back_image_data = (imageType === 'back-image') ? '' : $scope.guestIdData.back_image_data;
					markIDDetailsHasChanged();
				};
			} else {
				saveSuccessCallBack = function() {
					markIDDetailsHasChanged();

					var idType = $scope.guestIdData.document_type && $scope.guestIdData.document_type === 'ID_CARD' ? 1 : 3;
					var nationalityId = $scope.guestIdData.nationality_id ? parseInt($scope.guestIdData.nationality_id) : '';

					if ($scope.guestIdData.is_primary_guest) {
						var dataToUpdate = {
							id_type: idType,
							nationality_id: nationalityId,
							id_number: $scope.guestIdData.document_number,
							birthday: $filter('date')(new Date($scope.guestIdData.date_of_birth), 'yyyy-MM-dd')
						};

						$scope.$emit('PRIMARY_GUEST_ID_CHANGED', dataToUpdate);
					}

					$scope.closeGuestIdModal();
				};
			}

			if (faceImage) {
				saveFaceImage();
			}
			$scope.callAPI(RVGuestCardsSrv.saveGuestIdDetails, {
				params: apiParams,
				successCallBack: saveSuccessCallBack,
				failureCallBack: generalFailureCallBack
			});
		};

		/* *************************** ID SCAN **************************** */

		$scope.scanFrontSide = function() {
			$scope.screenData.imageSide = 0;
			document.getElementById('front-image').click();
			
		};
		$scope.scanBackSide = function() {
			$scope.screenData.imageSide = 1;
			document.getElementById('back-image').click();
		};

		$scope.$on('IMAGE_UPDATED', function(evt, data) {
			if (data.isFrontSide) {
				$scope.guestIdData.front_image_data = data.imageData;
				$scope.guestIdData.back_image_data = '';
				$scope.screenData.extCamForFrontIDActivated = false;
			} else {
				$scope.guestIdData.back_image_data = data.imageData;
				$scope.screenData.extCamForBackIDActivated = false;
			}
			$scope.refreshScroller('id-details');

			// If back side of ID is not needed, retrive the ID details
			if ($scope.screenData.scanMode === 'CONFIRM_ID_IMAGES') {
				$scope.confirmImages();
				$scope.screenData.showBackSideScan = false;
			} else {
				$scope.screenData.showBackSideScan = true;
				$scope.$emit('hideLoader');
			}
		});


		var setIDDetailsForScannedDocument = function(data) {
			var frontSideImage = angular.copy($scope.guestIdData.front_image_data);
			var backSideImage = angular.copy($scope.guestIdData.back_image_data);
			

			var expirationDate = moment(data.expiration_date, 'DD-MM-YYYY');
			var dateOfBirth = moment(data.date_of_birth, 'DD-MM-YYYY');

			$scope.guestIdData.expiration_date = expirationDate.isValid() ? expirationDate.format('MM-DD-YYYY') : '';
			$scope.guestIdData.date_of_birth = dateOfBirth.isValid() ? dateOfBirth.format('MM-DD-YYYY') : '';

			$scope.guestIdData.front_image_data = frontSideImage;
			$scope.guestIdData.back_image_data = backSideImage;
			$scope.guestIdData.last_name = data.first_name;
			$scope.guestIdData.first_name = data.last_name;
			$scope.guestIdData.document_number = data.document_number;
			$scope.guestIdData.document_type = data.document_type && data.document_type.toUpperCase() === 'PASSPORT' ? 'PASSPORT' : 'ID_CARD';
			$scope.guestIdData.expiry_date_for_display = $scope.guestIdData.expiration_date ? dateInHotelsFormat($scope.guestIdData.expiration_date) : '';
			$scope.guestIdData.dob_for_display = $scope.guestIdData.date_of_birth ? dateInHotelsFormat($scope.guestIdData.date_of_birth) : '';
			var nationality_id = '';

			if (data.nationality_name) {
				_.each($scope.countyList, function(country) {
					_.each(country.names, function(countryName) {
						if (data.nationality_name === countryName) {
							nationality_id = country.id.toString();
						}
					});
				});
			}
			$scope.guestIdData.nationality_id = nationality_id;
		};

		var idScanFailureActions = function(errorMessage) {
			$scope.guestIdData.errorMessage = errorMessage;
			generalFailureCallBack();
			$scope.guestIdData.front_image_data = '';
			$scope.guestIdData.back_image_data = '';
			$scope.screenData.extCamForFrontIDActivated = false;
			$scope.screenData.extCamForBackIDActivated = false;
		};

		$scope.$on('FINAL_RESULTS', function(evt, data) {
			$scope.$emit('hideLoader');
			if (data.expiration_date === 'Invalid date' || _.isEmpty(data.expiration_date)) {
				idScanFailureActions('INVALID EXPIRATION DATE. PLEASE RETRY OR USE ANOTHER ID.');
			} else if (data.expirationStatus === 'Expired') {
				idScanFailureActions('ID IS EXPIRED. PLEASE RETRY OR USE ANOTHER ID.');
			} else if (!data.document_number) {
				idScanFailureActions('FAILED TO ANALYZE THE DOCUMENT. PLEASE RETRY OR USE ANOTHER ID.');
			} else {
				setIDDetailsForScannedDocument(data);
				$scope.refreshScroller('id-details');
			}
		});

		$scope.$on('IMAGE_ANALYSIS_STARTED', function() {
			$scope.$emit('showLoader');
		});

		var restartVideoStream = function() {
			if ($scope.showScanOption) {
				if ($scope.screenData.extCamForFrontIDActivated) {
					$scope.startExtCameraCapture('front-image');
				}
				if ($scope.screenData.extCamForBackIDActivated) {
					$scope.startExtCameraCapture('back-image');
				}
			}
		};
		
		$scope.$on('IMAGE_ANALYSIS_FAILED', function() {
			$scope.$emit('hideLoader');
			$scope.guestIdData.errorMessage = 'Failed to Analyze the image';
			generalFailureCallBack();
			restartVideoStream();
		});

		if (!sntIDCollectionSrv.isInDevEnv && $scope.hotelDetails.id_collection) {
			sntIDCollectionSrv.setAcuantCredentialsForProduction($scope.hotelDetails.id_collection.acuant_credentials);
		}

		$scope.showScanOption = $scope.hotelDetails.id_collection &&
		 						$scope.hotelDetails.id_collection.rover.enabled && sntIDCollectionUtilsSrv.isInMobile();

		$scope.connectedCameras = [];
		var cameraCount = 0;

		$scope.selectedCamera = localStorage.getItem('ID_SCAN_CAMERA_ID');

		$scope.cameraSourceChanged = function() {
			localStorage.setItem('ID_SCAN_CAMERA_ID', $scope.selectedCamera);
			restartVideoStream();
		};

		// for non mobile devices, check if cameras are present, if yes show options to scan based
		// settings
		if (!sntIDCollectionUtilsSrv.isInMobile() && navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
			navigator.mediaDevices.enumerateDevices().then(function gotDevices(deviceInfos) {

				angular.forEach(deviceInfos, function(device) {
					if (device.kind === 'videoinput') {
						$scope.connectedCameras.push({
							'id': device.deviceId,
							'label': device.label || 'camera ' + (cameraCount + 1)
						});
						cameraCount++;
					}
				});
				var config = {
					useExtCamera: $scope.connectedCameras.length > 0
				};

				$scope.showScanOption = $scope.hotelDetails.id_collection &&
		 								$scope.hotelDetails.id_collection.rover.enabled &&
		 								$scope.connectedCameras.length > 0;
				$scope.setConfigurations(config);
			});
		}
		
		$scope.$on('EXT_CAMERA_STARTING', function() {
			$scope.$emit('showLoader');
		});
		$scope.$on('EXT_CAMERA_STARTED', function() {
			$timeout(function() {
				$scope.$emit('hideLoader');
			}, 3000);
		});
		$scope.$on('EXT_CAMERA_FAILED', function() {
			$scope.$emit('hideLoader');
		});

		$scope.$on('FACE_IMAGE_RETRIEVED', function(event, response) {
			faceImage = response;
		});

	}
]);
