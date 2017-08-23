admin.controller('ADZestEmailPrecheckinSettingsCtrl', ['$scope', '$state', 'data', 'ngDialog', '$translate', '$filter', '$controller', 'adZestEmailTemplateSrv',
	function($scope, $state, data, ngDialog, $translate, $filter, $controller, adZestEmailTemplateSrv) {
		$controller('ADZestBaseEmailSettingsCtrl', {
			$scope: $scope
		});
		$scope.generalSettings = data.general_email_template_settings;
		$scope.data = data.precheckin_email_template_settings;
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