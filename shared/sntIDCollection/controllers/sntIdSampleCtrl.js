angular.module('sntIDCollection').controller('sntIdSampleCtrl', function($scope, $controller, sntIDCollectionUtilsSrv) {
	$controller('sntIDCollectionBaseCtrl', {
		$scope: $scope
	});

	$scope.$on('FR_FAILED', function() {
		$scope.screenData.scanMode = 'FACIAL_RECOGNTION_FAILED';
	});

	$scope.$on('FR_SUCCESS', function() {
		$scope.confirmImages();
	});

	$scope.connectedCameras = [];
	var cameraCount = 0;

	$scope.cameraSourceChanged = function() {
		localStorage.setItem('ID_SCAN_CAMERA_ID', $scope.selectedCamera);

		if ($scope.screenData.extCamForBackIDActivated) {
			$scope.startExtCameraCapture('back-image');
		} else {
			$scope.startExtCameraCapture('front-image');
		}
	};

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
				useExtCamera: $scope.connectedCameras.length,
				useExtCamForFR: $scope.connectedCameras.length
			};
			
			$scope.setConfigurations(config);
			if ($scope.deviceConfig.useExtCamera) {
				$scope.screenData.scanMode = 'UPLOAD_FRONT_IMAGE';
				$scope.startExtCameraCapture('front-image');
				$scope.selectedCamera = localStorage.getItem('ID_SCAN_CAMERA_ID') || '';
			} else {
				$scope.screenData.scanMode = 'UPLOAD_FRONT_IMAGE';
			}
		});
	} else {
		$scope.screenData.scanMode = 'UPLOAD_FRONT_IMAGE';
		var config = {
			useAutoDetection: true,
			useThirdPartyScan: false,
			thirdPatrtyConnectionUrl: 'wss://localhost.stayntouch.com:4647/CCSwipeService'
		};
		
		$scope.setConfigurations(config);
	}

	$scope.$on('FRONT_SIDE_SCANNING_STARTED', function() {
		$scope.startExtCameraCapture('front-image');
	});

	$scope.$on('FRONT_IMAGE_CONFIRMED', function() {
		if ($scope.screenData.scanMode === 'UPLOAD_BACK_IMAGE' && $scope.deviceConfig.useExtCamera) {
			$scope.startExtCameraCapture('back-image');
		}
	});
	
});