angular.module('sntIDCollection').controller('sntIDCollectionBaseCtrl', function($scope, sntIDCollectionSrv, sntIDCollectionUtilsSrv, screenModes, $timeout, $log, $interval) {

	var resetScreenData = function() {
		$scope.screenData = {
			frontSideImage: '',
			backSideImage: '',
			imageSide: 0,
			scanMode: screenModes.validate_subscription,
			idDetails: {},
			needBackSideScan: false,
			useExtCamera: true
		};
	};
	var domIDMappings;

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

	var getImageDetails = function() {
		sntIDCollectionSrv.getImageDetails($scope.screenData.imageSide).then(function(response) {

			$scope.screenData.needBackSideScan = !(response.image_classification && response.image_classification.Type && response.image_classification.Type.Size === 3);
			$scope.screenData.needBackSideScan = false;

			
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
		}, function(response) {
			$log.error(response);
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
		});
	};

	var postFrontImage = function() {
		sntIDCollectionSrv.postFrontImage($scope.screenData.frontSideImage).then(function() {
			getImageDetails();
		}, function(response) {
			$log.error(response);
			$scope.$emit('IMAGE_ANALYSIS_FAILED', response);
			$scope.screenData.scanMode = screenModes.upload_front_image_failed;
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
		};

		sntIDCollectionSrv.verifyFacialMatch(frontSideImage, facialImage).then(function(response) {
			if (response && response.FacialMatch && response.FacialMatchConfidenceRating > 95) {
				$scope.$emit('FR_SUCCESS');
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
						verifyFaceImageWithId(unmodifiedFaceImage, unmodifiedFaceImage);
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
		$timeout(function() {
			angular.element(document.querySelector('#' + domIDMappings.face_img_upload)).click();
		}, 0);
	};

	$scope.startExtCameraCapture1 = function() {
		$scope.screenData.cameraTimer = 5;
		var video = document.getElementById('id-video');
		if (video && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
			// Not adding `{ audio: true }` since we only want video now
			navigator.mediaDevices.getUserMedia({
				video: true
			}).then(function(stream) {
				video.srcObject = stream;
				video.play();
				var selfieTimerInterval = $interval(function() {
					$scope.screenData.cameraTimer--;
					if ($scope.screenData.cameraTimer === 3) {
						$interval.cancel(selfieTimerInterval);
						// var canvas = document.createElement('canvas');
						// var context = canvas.getContext('2d');
						// context.drawImage(video, 0, 0, 680, 480);
						// var dataURLstring = canvas.toDataURL();

						// var imageData = sntIDCollectionUtilsSrv.resizeImage(video);

	
						// unmodifiedFrontImage = sntIDCollectionUtilsSrv.dataURLtoBlob(dataURLstring);
						// //getDocInstance();
						// $scope.screenData.frontSideImage = imageData;

						// $scope.videoCapture = dataURLstring;
						var canvas = document.createElement('canvas');
						canvas.id = "CursorLayer";
						var context = canvas.getContext('2d');
						

						context.drawImage(video, 0, 0, 500, 375);

						var dataURLstring = canvas.toDataURL();
						unmodifiedFaceImage = sntIDCollectionUtilsSrv.dataURLtoBlob(dataURLstring);
						$scope.videoCapture = dataURLstring;
					}
				}, 1000);
			});
		}
	};

	$scope.startExtCameraCapture = function() {
		var screenshotButton = document.querySelector('#screenshot-button');
		var img = document.querySelector('#screenshot-img');
		var video = document.querySelector('#id-video');

		var canvas = document.createElement('canvas');

	
		navigator.mediaDevices.getUserMedia({
				video: true
			}).
			then(handleSuccess).catch(function(){

			});
	

		screenshotButton.onclick = video.onclick = function() {
			// canvas.width = video.videoWidth;
			// canvas.height = video.videoHeight;
			// canvas.getContext('2d').drawImage(video, 0, 0);
			// // Other browsers will fall back to image/png
			// var dataURLstring =canvas.toDataURL('image/webp');
			// img.src = dataURLstring;

			// unmodifiedFrontImage = sntIDCollectionUtilsSrv.dataURLtoBlob(dataURLstring);

			// unmodifiedFaceImage = sntIDCollectionUtilsSrv.dataURLtoBlob(dataURLstring);

			var imageData = sntIDCollectionUtilsSrv.resizeImage(video, undefined, video.videoWidth, video.videoHeight);

		    ///verifyFaceImageWithId(imageData, imageData);
		    $scope.screenData.frontSideImage = imageData;
			getDocInstance();
			
			//download(dataURLstring, 'strFileName', 'image/png');
		};

		function handleSuccess(stream) {
			screenshotButton.disabled = false;
			video.srcObject = stream;
		};
	};

	(function() {
		resetScreenData();
		$scope.setIDsForImageElements();
	}());
});