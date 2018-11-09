angular.module('sntIDCollection').controller('sntIDCollectionBaseCtrl', function($scope, sntIDCollectionSrv, sntIDCollectionUtilsSrv, screenModes, $timeout, $log) {

	var resetScreenData = function() {
		$scope.screenData = {
			frontSideImage: '',
			backSideImage: '',
			imageSide: 0,
			scanMode: screenModes.validate_subscription,
			idDetails: {},
			needBackSideScan: false
		};
	};
	var domIDMappings;

	$scope.setIDsForImageElements = function(domIDMapping) {
		// Incase the image elements have different IDs in different places
		domIDMappings = {
			front_side_upload: domIDMapping ? domIDMapping.front_side_upload : 'front-image',
			back_side_upload: domIDMapping ? domIDMapping.back_side_upload : 'back-image',
			front_image_preview: domIDMapping ? domIDMapping.front_image_preview : 'front-side-image',
			back_image_preview: domIDMapping ? domIDMapping.back_image_preview : 'back-side-image'
		};
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
		}, function(response) {
			$log.error(response);
			$scope.screenData.scanMode = $scope.screenData.imageSide === 0 ? screenModes.upload_front_image_failed : screenModes.upload_back_image_failed;
		});
	};

	var postBackImage = function() {
		sntIDCollectionSrv.postBackImage($scope.screenData.backSideImage).then(function() {
			getImageDetails();
		}, function(response) {
			$log.error(response);
			$scope.screenData.scanMode = screenModes.upload_back_image_failed;
		});
	};

	var postFrontImage = function() {
		sntIDCollectionSrv.postFrontImage($scope.screenData.frontSideImage).then(function() {
			getImageDetails();
		}, function(response) {
			$log.error(response);
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
			$scope.screenData.scanMode = screenModes.upload_front_image_failed;
		});
	};

	var processImage = function(evt, frontSideImage) {

		var file = evt.target;
		var reader = new FileReader();

		reader.onload = function(e) {
			if (window.File && window.FileReader && window.FileList && window.Blob) {
				var img = document.createElement('img');

				img.src = e.target.result;
				img.onload = function() {
					var imageData = sntIDCollectionUtilsSrv.resizeImage(img, file);

					if (frontSideImage) {
						getDocInstance();
						$scope.screenData.frontSideImage = imageData;
					} else {
						$scope.screenData.backSideImage = imageData;
						postBackImage();
					}
				};
			} else {
				$log.error('The File APIs are not fully supported in this browser.');
			}
		};
		reader.readAsDataURL(file.files[0]);
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
		processImage(evt, true);
		$scope.screenData.scanMode = screenModes.analysing_front_image;
	};

	$scope.backImageChanged = function(evt) {
		$scope.screenData.backSideImage = '';
		processImage(evt, false);
		$scope.screenData.scanMode = screenModes.analysing_back_image;
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

	(function() {
		resetScreenData();
		$scope.setIDsForImageElements();
	}());
});