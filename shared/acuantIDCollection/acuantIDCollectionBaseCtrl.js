angular.module('acuantIDCollection').controller('acuantIDCollectionBaseCtrl', function($scope, acuantIDCollectionSrv, acuantIDCollectionUtilsSrv, $log) {

	var resetSCreenData = function() {
		$scope.screenData = {
			frontSideImage: '',
			backSideImage: '',
			imageSide: 0,
			scanMode: 'VALIDATE_SUBSCRIPTION',
			idDetails: {},
			needBackSideScan: false
		};
	};
	resetSCreenData();

	var getImageDetails = function() {
		acuantIDCollectionSrv.getImageDetails($scope.screenData.imageSide).then(function(response) {
			if (response.image) {
				var base64String = acuantIDCollectionUtilsSrv.base64ArrayBuffer(response.image);

				if ($scope.screenData.imageSide === 0) {
					document.getElementById('front-side-image').src = base64String;
				} else {
					document.getElementById('back-side-image').src = base64String;
				}
			}
			$scope.screenData.needBackSideScan = (response.image_classification && response.image_classification.Type && response.image_classification.Type.Size === 3) ? false : true;

			if (!$scope.screenData.needBackSideScan || $scope.screenData.imageSide === 1) {
				$scope.screenData.scanMode = 'CONFIRM_ID_IMAGES';
			} else {
				$scope.screenData.scanMode = 'CONFIRM_FRON_IMAGE';
			}
		}, function(response) {
			$scope.screenData.scanMode = $scope.screenData.imageSide === 0 ? 'UPLOAD_FRONT_IMAGE_FAILED' : 'UPLOAD_BACK_IMAGE_FAILED';
		});
	};

	var postBackImage = function() {
		acuantIDCollectionSrv.postBackImage($scope.screenData.backSideImage).then(function(response) {
			getImageDetails();
		}, function(response) {
			$scope.screenData.scanMode = 'UPLOAD_BACK_IMAGE_FAILED';
		});
	};

	var postFrontImage = function(instanceID) {
		acuantIDCollectionSrv.postFrontImage($scope.screenData.frontSideImage).then(function(response) {
			getImageDetails();
		}, function(response) {
			$scope.screenData.scanMode = 'UPLOAD_FRONT_IMAGE_FAILED';
		});
	};

	var getDocInstance = function() {
		acuantIDCollectionSrv.getDocInstance().then(function(response) {
			instanceID = response;

			postFrontImage(instanceID);
		}, function(response) {
			$scope.screenData.scanMode = 'UPLOAD_BACK_IMAGE_FAILED';
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
					var imageData = acuantIDCollectionUtilsSrv.resizeImage(img, file);

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
		$scope.screenData.scanMode = 'ANALYSING_ID_DATA';
		acuantIDCollectionSrv.getResults().then(function(response) {
			$scope.screenData.scanMode = 'FINAL_ID_RESULTS';
			$scope.screenData.idDetails = response;
			acuantIDCollectionSrv.deleteDocInstance(instanceID).then(function(response) {}, function(response) {});
		}, function(response) {
			$scope.screenData.scanMode = 'ANALYSING_ID_DATA_FAILED';
		});
	};

	$scope.confirmFrontImage = function() {
		$scope.screenData.imageSide = 1;
		$scope.screenData.scanMode = $scope.screenData.needBackSideScan ? 'UPLOAD_BACK_IMAGE' : 'CONFIRM_ID_IMAGES';
	};

	$scope.frontImageChanged = function(evt) {
		$scope.screenData.frontSideImage = '';
		processImage(evt, true);
		$scope.screenData.scanMode = 'ANALYSING_FRONT_IMAGE';
	};

	$scope.backImageChanged = function(evt) {
		$scope.screenData.backSideImage = '';
		processImage(evt, false);
		$scope.screenData.scanMode = 'ANALYSING_BACK_IMAGE';
	};

	$scope.captureFrontImage = function() {
		$('#front-image').click();
	};

	$scope.captureBackImage = function() {
		$('#back-image').click();
	};

	$scope.startScanning = function() {
		resetSCreenData();
		$('#front-side-image').attr('src','');
		$('#back-side-image').attr('src','');

		$scope.screenData.scanMode = 'UPLOAD_FRONT_IMAGE';
	};

	$scope.validateSubsription = function() {
		acuantIDCollectionSrv.validateCredentials().then(function(response) {
			$scope.screenData.scanMode = 'VALID_ID_CREDENTIALS';
		}, function(response) {
			$scope.screenData.scanMode = 'INVALID_ID_CREDENTIALS';
			$log.error(response);
		});
	};
});


/*  ********* SCREEN MODES **************

VALIDATE_SUBSCRIPTION
VALID_ID_CREDENTIALS
INVALID_ID_CREDENTIALS

UPLOAD_FRONT_IMAGE
ANALYSING_FRONT_IMAGE
UPLOAD_FRONT_IMAGE_FAILED
CONFIRM_FRON_IMAGE

UPLOAD_BACK_IMAGE
ANALYSING_BACK_IMAGE
UPLOAD_BACK_IMAGE_FAILED

CONFIRM_ID_IMAGES
ANALYSING_ID_DATA
ANALYSING_ID_DATA_FAILED

FINAL_ID_RESULT

******************************************  */