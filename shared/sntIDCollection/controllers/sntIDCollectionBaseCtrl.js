angular.module('sntIDCollection').controller('sntIDCollectionBaseCtrl', function($scope, sntIDCollectionSrv, sntIDCollectionUtilsSrv, screenModes, $log) {

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

	var getImageDetails = function() {
		sntIDCollectionSrv.getImageDetails($scope.screenData.imageSide).then(function(response) {
			if (response.image) {
				var base64String = sntIDCollectionUtilsSrv.base64ArrayBuffer(response.image);

				if ($scope.screenData.imageSide === 0) {
					document.getElementById('front-side-image').src = base64String;
				} else {
					document.getElementById('back-side-image').src = base64String;
				}
			}
			$scope.screenData.needBackSideScan = !(response.image_classification && response.image_classification.Type && response.image_classification.Type.Size === 3);

			if (!$scope.screenData.needBackSideScan || $scope.screenData.imageSide === 1) {
				$scope.screenData.scanMode = screenModes.confirm_id_images;
			} else {
				$scope.screenData.scanMode = screenModes.confirm_front_image;
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
		$('#front-image').click();
	};

	$scope.captureBackImage = function() {
		$('#back-image').click();
	};

	$scope.startScanning = function() {
		resetScreenData();
		$('#front-side-image').attr('src', '');
		$('#back-side-image').attr('src', '');

		$scope.screenData.scanMode = screenModes.upload_front_image;
	};

	$scope.validateSubsription = function() {
		sntIDCollectionSrv.validateCredentials().then(function() {
			$scope.screenData.scanMode = screenModes.valid_id_credentials;
		}, function(response) {
			$scope.screenData.scanMode = screenModes.invalid_id_credentials;
			$log.error(response);
		});
	};

	(function() {
		resetScreenData();
	}());
});