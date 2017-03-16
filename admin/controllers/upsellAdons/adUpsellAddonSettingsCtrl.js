admin.controller('adUpsellAddonSettingsCtrl', function($scope, ADUpsellAddonSrv, data) {

	BaseCtrl.call(this, $scope);
	var addonDefaultImage;

	/**
	 * function to save the details
	 */
	$scope.saveDetails = function() {
		var options = {
			params: angular.copy($scope.data),
			successCallBack: $scope.goBackToPreviousState
		};

		if (addonDefaultImage === $scope.data.addon_default_image) {
			// delete image, if image is not changed
            delete options.params.addon_default_image;
		}

		$scope.callAPI(ADUpsellAddonSrv.saveDetails, options);
	};

	(function() {
		$scope.data = data;
		// store refernce of the image
		addonDefaultImage = angular.copy(data.addon_default_image);
	})();
});
