admin.controller('ADZestEmailPrecheckinSettingsCtrl', ['$scope', '$state', 'generalSettings', 'data', 'ngDialog', '$translate', '$filter', '$controller', 'adZestEmailTemplateSrv',
	function($scope, $state, generalSettings, data, ngDialog, $translate, $filter, $controller, adZestEmailTemplateSrv) {
		$controller('ADZestBaseEmailSettingsCtrl', {
			$scope: $scope
		});
		$scope.generalSettings = generalSettings;
		$scope.data = data;
		$scope.mainHeading = $filter('translate')('PRECHECKIN_TEXT_SETTINGS');

		$scope.saveSettings = function() {
			var params = {
				precheckin_email_template_settings: {
					"email_text_1": $scope.data.email_text_1,
					"email_text_2": $scope.data.email_text_2,
					"button_text": $scope.data.button_text,
					"subject_text": $scope.data.subject_text
				}
			};
			var options = {
				params: params,
				successCallBack: function() {
					$scope.successMessage = 'Sucess!';
				}
			};

			$scope.callAPI(adZestEmailTemplateSrv.saveSettings, options);
		};

	}
]);