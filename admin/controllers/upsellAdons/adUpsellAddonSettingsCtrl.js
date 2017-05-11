admin.controller('adUpsellAddonSettingsCtrl', function($scope, ADUpsellAddonSrv, data, availableLanguages) {

	BaseCtrl.call(this, $scope);
	var addonDefaultImage;

	 /** Addon translation **/
    $scope.translations = {};
    // set the data for the language deropdown
    availableLanguages.locales = availableLanguages.languages;
    delete availableLanguages.languages;
    // variable is different
    _.each(availableLanguages.locales, function(locale) {
        locale.value = locale.code;
        delete locale.code;
    });
    // filter out disabled languages
    availableLanguages.locales = _.reject(availableLanguages.locales, function(locale) {
        return !locale.is_show_on_guest_card;
    });
	$scope.availableLanguagesSet = availableLanguages;
	$scope.selectedLanguageId = 1;

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
