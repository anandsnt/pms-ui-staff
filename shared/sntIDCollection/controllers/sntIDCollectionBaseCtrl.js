angular.module('sntIDCollection').controller('sntIDCollectionBaseCtrl', function($scope, sntIDCollectionSrv, sntIDCollectionUtilsSrv, screenModes, $timeout, $log) {

	var resetScreenData = function() {
		$scope.screenData = {
			frontSideImage: '',
			backSideImage: '',
			imageSide: 0,
			scanMode: screenModes.validate_subscription,
			idDetails: {},
			needBackSideScan: false,
			extCamForFrontIDActivated: false,
			extCamForBackIDActivated: false
		};
	};
	var domIDMappings;

	$scope.deviceConfig = {
		useExtCamera: false,
		useiOSAppCamera: false,
		useExtCamForFR: false
	};

	var stopVideoStream = function() {
		if (window.localVideoStream && window.localVideoStream.getVideoTracks() && window.localVideoStream.getVideoTracks().length) {
			window.localVideoStream.getVideoTracks()[0].stop();
		}
	};

	$scope.setIDsForImageElements = function(domIDMapping) {
		// Incase the image elements have different IDs in different places
		domIDMappings = {
			front_side_upload: domIDMapping ? domIDMapping.front_side_upload : 'front-image',
			back_side_upload: domIDMapping ? domIDMapping.back_side_upload : 'back-image',
			front_image_preview: domIDMapping ? domIDMapping.front_image_preview : 'front-side-image',
			back_image_preview: domIDMapping ? domIDMapping.back_image_preview : 'back-side-image',
			face_img_upload: domIDMapping ? domIDMapping.face_img_upload : 'face-image-upload',
			face_image: domIDMapping ? domIDMapping.face_image : 'face-image'
		};
	};

	$scope.setConfigurations = function(config) {
		$scope.deviceConfig = config;
	};

	var getImageDetails = function() {
		sntIDCollectionSrv.getImageDetails($scope.screenData.imageSide).then(function(response) {

			$scope.screenData.needBackSideScan = !(response.image_classification && response.image_classification.Type && response.image_classification.Type.Size === 3);
			
			if (!$scope.screenData.needBackSideScan || $scope.screenData.imageSide === 1) {
				$scope.screenData.scanMode = screenModes.confirm_id_images;
			} else {
				$scope.screenData.scanMode = screenModes.confirm_front_image;
			}
			if (response.image) {
				var base64String = sntIDCollectionUtilsSrv.base64ArrayBuffer(response.image);

				$scope.$emit('IMAGE_UPDATED', {
					isFrontSide: $scope.screenData.imageSide === 0,
					imageData: base64String
				});
				if ($scope.screenData.imageSide === 0) {
					$('#' + domIDMappings.front_image_preview).attr('src', base64String);
				} else {
					$('#' + domIDMappings.back_image_preview).attr('src', base64String);
				}
			}
			stopVideoStream();
		}, function(response) {
			$log.error(response);
			stopVideoStream();
			$scope.$emit('IMAGE_ANALYSIS_FAILED');
			$scope.screenData.scanMode = $scope.screenData.imageSide === 0 ? screenModes.upload_front_image_failed : screenModes.upload_back_image_failed;
		});
	};

	var postBackImage = function() {
		sntIDCollectionSrv.postBackImage($scope.screenData.backSideImage).then(function() {
			getImageDetails();
		}, function(response) {
			$log.error(response);
			$scope.$emit('IMAGE_ANALYSIS_FAILED', response);
			$scope.screenData.scanMode = screenModes.upload_back_image_failed;
			stopVideoStream();
		});
	};

	var postFrontImage = function() {
		sntIDCollectionSrv.postFrontImage($scope.screenData.frontSideImage).then(function() {
			getImageDetails();
		}, function(response) {
			$log.error(response);
			$scope.$emit('IMAGE_ANALYSIS_FAILED', response);
			$scope.screenData.scanMode = screenModes.upload_front_image_failed;
			stopVideoStream();
		});
	};

	var getDocInstance = function() {
		sntIDCollectionSrv.getDocInstance().then(function(response) {
			if (response) {
				postFrontImage();
			} else {
				$scope.screenData.scanMode = screenModes.upload_front_image_failed;
			}
		}, function(response) {
			$log.error(response);
			$scope.$emit('IMAGE_ANALYSIS_FAILED');
			$scope.screenData.scanMode = screenModes.upload_front_image_failed;
		});
	};

	var verifyFaceImageWithId = function(frontSideImage, facialImage) {
		var facialRecognitionFailed = function() {
			$scope.$emit('FR_FAILED');
			$scope.screenData.scanMode = screenModes.facial_recognition_failed;
			stopVideoStream();
		};

		sntIDCollectionSrv.verifyFacialMatch(frontSideImage, facialImage).then(function(response) {
			// alert(response.FacialMatchConfidenceRating);
			if (response && response.FacialMatch && response.FacialMatchConfidenceRating > 95) {
				$scope.$emit('FR_SUCCESS');
				stopVideoStream();
			} else {
				facialRecognitionFailed();
			}
		}, facialRecognitionFailed);
	};


    var unmodifiedFrontImage, unmodifiedFaceImage;
	var processImage = function(evt, frontSideImage, faceImage, previousState) {

		var file = evt.target;
		var reader = new FileReader();

		reader.onload = function(e) {
			if (window.File && window.FileReader && window.FileList && window.Blob) {
				var img = document.createElement('img');

				img.src = e.target.result;
				img.onload = function() {
					var imageData = sntIDCollectionUtilsSrv.resizeImage(img, file);

					if (faceImage) {
						unmodifiedFaceImage = sntIDCollectionUtilsSrv.dataURLtoBlob(reader.result);
						$timeout(function() {
							$scope.screenData.scanMode = screenModes.analysing_id_data;
						}, 0);
						verifyFaceImageWithId(unmodifiedFrontImage, unmodifiedFaceImage);
						$scope.$emit('FR_ANALYSIS_STARTED');
					}
					else if (frontSideImage) {
						unmodifiedFrontImage = sntIDCollectionUtilsSrv.dataURLtoBlob(reader.result);
						getDocInstance();
						$scope.screenData.frontSideImage = imageData;
					} else {
						$scope.screenData.backSideImage = imageData;
						postBackImage();
					}
					$scope.$emit('IMAGE_ANALYSIS_STARTED');
				};
			} else {
				$log.error('The File APIs are not fully supported in this browser.');
			}
		};
		if (file.files.length > 0) {
			reader.readAsDataURL(file.files[0]);
		} else {
			$timeout(function() {
				$scope.screenData.scanMode = previousState;
			}, 0);
		}
	};

	$scope.confirmImages = function() {
		$scope.screenData.scanMode = screenModes.analysing_id_data;
		sntIDCollectionSrv.getResults().then(function(response) {
			$log.info(response);
			$scope.screenData.scanMode = screenModes.final_id_results;
			$scope.screenData.idDetails = response.Fields;
			$scope.screenData.idDetails.iDAuthenticationStatus = sntIDCollectionUtilsSrv.retrieveAuthenticationStatus(response.Result);
			$scope.screenData.idDetails.expirationStatus = sntIDCollectionUtilsSrv.isIDExpired(response.Alerts) ? 'Expired' : 'Unexpired';

			var idDetailsForPms = sntIDCollectionUtilsSrv.formatResults($scope.screenData.idDetails);
			
			idDetailsForPms.iDAuthenticationStatus = sntIDCollectionUtilsSrv.retrieveAuthenticationStatus(response.Result);
			idDetailsForPms.expirationStatus = sntIDCollectionUtilsSrv.isIDExpired(response.Alerts) ? 'Expired' : 'Unexpired';

			$scope.$emit('FINAL_RESULTS', idDetailsForPms);
			
			sntIDCollectionSrv.deleteDocInstance().then(function() {}, function() {});
		}, function(response) {
			$log.error(response);
			$scope.screenData.scanMode = screenModes.analysing_id_data_failed;
		});
	};

	$scope.confirmFrontImage = function() {
		$scope.screenData.imageSide = 1;
		$scope.screenData.scanMode = $scope.screenData.needBackSideScan ? screenModes.upload_back_image : screenModes.confirm_id_images;
		$scope.$emit('FRONT_IMAGE_CONFIRMED');
	};

	$scope.frontImageChanged = function(evt) {
		$scope.screenData.frontSideImage = '';
		processImage(evt, true, false, angular.copy($scope.screenData.scanMode));
		$scope.screenData.scanMode = screenModes.analysing_front_image;
	};

	$scope.backImageChanged = function(evt) {
		$scope.screenData.backSideImage = '';
		processImage(evt, false, false, angular.copy($scope.screenData.scanMode));
		$scope.screenData.scanMode = screenModes.analysing_back_image;
	};

	$scope.faceImageChanged = function (evt) {
		$scope.screenData.faceImage = '';
		processImage(evt, false, true, angular.copy($scope.screenData.scanMode));
	};

	var processImageFromIos = function(faceImage, frontSideImage, imageData) {
		var img = document.createElement('img');

		var unmodifiedFaceImage = "data:image/jpeg;base64," + imageData;

		img.src = unmodifiedFaceImage;
		img.onload = function() {
			// var imageData = sntIDCollectionUtilsSrv.resizeImage(img);

			if (faceImage) {
				unmodifiedFaceImage = sntIDCollectionUtilsSrv.dataURLtoBlob(unmodifiedFaceImage);
				verifyFaceImageWithId(unmodifiedFrontImage, unmodifiedFaceImage);
				$scope.screenData.scanMode = 'FACIAL_RECOGNITION_MODE';
				$scope.$emit('FR_ANALYSIS_STARTED');
				$scope.$digest();
			}
			// else if (frontSideImage) {
			// 	unmodifiedFrontImage = sntIDCollectionUtilsSrv.dataURLtoBlob(reader.result);
			// 	getDocInstance();
			// 	$scope.screenData.frontSideImage = imageData;
			// } else {
			// 	$scope.screenData.backSideImage = imageData;
			// 	postBackImage();
			// }

		};

		img.onerror = function() {
			$scope.$emit('FR_FAILED');
		};
	};

	$scope.captureFrontImage = function() {
		$timeout(function() {
			angular.element(document.querySelector('#' + domIDMappings.front_side_upload)).click();
		}, 0);

	};

	$scope.captureBackImage = function() {
		$timeout(function() {
			angular.element(document.querySelector('#' + domIDMappings.back_side_upload)).click();
		}, 0);
	};

	$scope.startScanning = function() {
		resetScreenData();
		$('#'+ domIDMappings.front_image_preview).attr('src', '');
		$('#'+ domIDMappings.back_image_preview).attr('src', '');
		$scope.screenData.scanMode = screenModes.upload_front_image;
		$scope.$emit('CLEAR_PREVIOUS_DATA');
		if ($scope.deviceConfig.useExtCamera) {
			$scope.$emit('FRONT_SIDE_SCANNING_STARTED');
		}
	};

	$scope.validateSubsription = function() {
		sntIDCollectionSrv.validateCredentials().then(function() {
			$scope.screenData.scanMode = screenModes.valid_id_credentials;
			$scope.$emit('CREDENTIALS_VALIDATED');
		}, function(response) {
			$scope.screenData.scanMode = screenModes.invalid_id_credentials;
			$log.error(response);
		});
	};

	$scope.startFacialRecognition = function() {

		if ($scope.deviceConfig.useiOSAppCamera) {
			cordova.exec(function(response) {
				processImageFromIos(true, undefined, response.image_base64);
			}, function(error) {
				$log.error(error);
				$scope.$emit('FR_FAILED');
			}, 'RVCardPlugin', 'captureFacePhoto', [5, 3]);
		} else {
			$timeout(function() {
				angular.element(document.querySelector('#' + domIDMappings.face_img_upload)).click();
			}, 0);
		}
	};
	
	$scope.startExtCameraCapture = function(type) {
		$scope.$emit('EXT_CAMERA_STARTING');
		var video = type === 'front-image' ? document.querySelector('#id-video') : document.querySelector('#id-back-video');

		var cameraId = localStorage.getItem('ID_SCAN_CAMERA_ID');

		navigator.mediaDevices.getUserMedia({
			video: {
				deviceId: cameraId ? {
					exact: cameraId
				} : undefined,
				width: 2560,
				height: 1920
			}
		}).
		then(function handleSuccess(stream) {
			window.localVideoStream = stream;
			video.srcObject = stream;
			if (type === 'front-image') {
				$scope.screenData.extCamForFrontIDActivated = true;
			} else {
				$scope.screenData.extCamForBackIDActivated = true;
			}
			$scope.$emit('EXT_CAMERA_STARTED');
			$scope.$digest();
		})
		.catch(function() {
			$scope.$emit('EXT_CAMERA_FAILED');
		});
	};

	$scope.startFacialRecognitionUsingExtCamera = function() {
		$scope.screenData.extCamForSelfieActivated = false;
		$scope.screenData.scanMode = 'FACIAL_RECOGNITION_MODE';
		var video = document.querySelector('#fr-id-video');
		var cameraId = localStorage.getItem('FR_CAMERA_ID');

		$scope.$emit('FR_CAMERA_STARTING');
		navigator.mediaDevices.getUserMedia({
			video: {
				deviceId: cameraId ? {
					exact: cameraId
				} : undefined,
				width: 2560,
				height: 1920
			}
		}).
		then(function handleSuccess(stream) {
			window.localVideoStream = stream;
			video.srcObject = stream;
			$scope.screenData.extCamForSelfieActivated = true;
			$scope.$emit('EXT_CAMERA_STARTED');
			$scope.$digest();
		})
		.catch(function() {
			$scope.$emit('EXT_CAMERA_FAILED');
		});
	};

	$scope.captureFaceImageUsingExtCamera = function() {
		var video = document.querySelector('#fr-id-video'); 
		var imageData = sntIDCollectionUtilsSrv.resizeImage(video, undefined, 2560, 1920);

		verifyFaceImageWithId(imageData, unmodifiedFrontImage);
		$scope.screenData.scanMode = 'FACIAL_RECOGNITION_MODE';
	    $scope.$emit('FR_ANALYSIS_STARTED');
	};

    $scope.stopExtCamera = function(type) {
        if (type === 'front-image') {
            $scope.screenData.extCamForFrontIDActivated = false;
        } else {
            $scope.screenData.extCamForBackIDActivated = false;
        }
    };

	$scope.captureFrontImageUsingExtCamera = function () {
		$scope.screenData.imageSide = 0;
		var video = document.querySelector('#id-video');
		var imageData = sntIDCollectionUtilsSrv.resizeImage(video, undefined, 2560, 1920);

		$scope.screenData.frontSideImage = imageData;
		$scope.$emit('IMAGE_ANALYSIS_STARTED');
		getDocInstance();
	};

	$scope.retryFrontImageUsingExtCamera = function () {
		$scope.screenData.scanMode = 'UPLOAD_FRONT_IMAGE';
		$scope.startExtCameraCapture('front-image');
	};

	$scope.captureBackImageUsingExtCamera = function () {
		$scope.screenData.imageSide = 1;
		var video = document.querySelector('#id-back-video');
		var imageData = sntIDCollectionUtilsSrv.resizeImage(video, undefined, 2560, 1920);

		$scope.screenData.backSideImage = imageData;
		$scope.$emit('IMAGE_ANALYSIS_STARTED');
		postBackImage();
	};

	$scope.retryBackImageUsingExtCamera = function () {
		$scope.screenData.scanMode = 'UPLOAD_BACK_IMAGE';
		$scope.startExtCameraCapture('back-image');
	};

	$scope.$on('STOP_EXT_CAM', stopVideoStream);
	$scope.$on('$destroy', stopVideoStream);

	(function() {
		resetScreenData();
		$scope.setIDsForImageElements();
	}());
});