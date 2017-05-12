admin.controller('adUpsellAddonSettingsCtrl', function($scope, ADUpsellAddonSrv, upsellData, availableLanguages) {

	BaseCtrl.call(this, $scope);
	var addonDefaultImage,
		blankAmountTypes = [],
		blankPostTypes = [],
		selectedLanguageTranslationLanguageId = '';

	$scope.onLanguageChange = function() {
		if ($scope.selectedLanguage.code === 'en') {
			$scope.data = angular.copy(upsellData);
		} else {
			// if language is not english
			var selectedLanguage = _.find($scope.availableLanguagesSet.locales, function(language) {
				return language.value === $scope.selectedLanguage.code;
			});
			$scope.selectedLanguageTranslations = _.find($scope.data.translations, function(translation) {
				return translation.language_id === selectedLanguage.id;
			});
			selectedLanguageTranslationLanguageId = selectedLanguage.id;
			// check if translations were already added.
			if (!_.isUndefined($scope.selectedLanguageTranslations)) {
				$scope.selectedLanguageTranslationId = $scope.selectedLanguageTranslations.id;
				$scope.translated_amount_types = $scope.selectedLanguageTranslations.amount_types;
				$scope.translated_post_types = $scope.selectedLanguageTranslations.post_types;
			} else {
				// if no previously added translations, set as blank data initialy
				$scope.translated_amount_types = angular.copy(blankAmountTypes);
				$scope.translated_post_types = angular.copy(blankPostTypes);
			}
		}
	};


	var returnDataForSaving = function() {
		var data;
		if ($scope.selectedLanguage.code === 'en') {
			data = angular.copy($scope.data);
			delete data.translations;
		} else {
			data = angular.copy($scope.data);
			delete data.translations;
			data.translation = [{
				language_id: selectedLanguageTranslationLanguageId,
				amount_types: $scope.translated_amount_types,
				post_types: $scope.translated_post_types
			}];
			// if previous translations for the language are present, add translation id
			if (!_.isUndefined($scope.selectedLanguageTranslations)) {
				data.translation[0].id = $scope.selectedLanguageTranslationId;
			}
		}
		return data;
	};

	/**
	 * function to save the details
	 */
	$scope.saveDetails = function() {
		var options = {
			params: returnDataForSaving(),
			successCallBack: function() {
				$scope.successMessage = 'Settings saved!';
			}
		};

		if (addonDefaultImage === $scope.data.addon_default_image) {
			// delete image, if image is not changed
			delete options.params.addon_default_image;
		}

		$scope.callAPI(ADUpsellAddonSrv.saveDetails, options);
	};

	(function() {
		$scope.data = angular.copy(upsellData);
		$scope.successMessage = '';

		// set up blank labels for future usage in case of newly added language
		_.each(angular.copy(upsellData.amount_types), function(amountType) {
			blankAmountTypes.push({
				'description': amountType.description,
				'id': amountType.id,
				'label': ''
			});
		});
		_.each(angular.copy(upsellData.post_types), function(postType) {
			blankPostTypes.push({
				'description': postType.description,
				'id': postType.id,
				'label': ''
			});
		});
		// variable is different
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
		// set default language as english
		$scope.selectedLanguage = {
			'code': 'en'
		};
		// store refernce of the image
		addonDefaultImage = angular.copy(upsellData.addon_default_image);
	})();
});