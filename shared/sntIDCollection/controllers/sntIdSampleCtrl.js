angular.module('sntIDCollection').controller('sntIdSampleCtrl', function($scope, $controller) {
	$controller('sntIDCollectionBaseCtrl', {
		$scope: $scope
	});

	$scope.$on('FR_FAILED', function() {
		$scope.screenData.scanMode = 'FACIAL_RECOGNTION_FAILED';
	});

	$scope.$on('FR_SUCCESS', function() {
		$scope.confirmImages();
	});

	var config = {
		useExtCamera: false,
		useExtCamera: false
	};

	$scope.setConfigurations(config);

	if($scope.screenData.useExtCamera) {
		$scope.screenData.scanMode = 'UPLOAD_FRONT_IMAGE';
		$scope.startExtCameraCapture('front-image');
	} else {
		$scope.screenData.scanMode = 'UPLOAD_FRONT_IMAGE';
	}
});