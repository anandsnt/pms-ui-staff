admin.controller('ADZestKeyDeliveryCommonCtrl', ['$scope', 'data', '$filter', '$controller', 'adZestEmailTemplateSrv', 'ngDialog',
	function($scope, data, $filter, $controller, adZestEmailTemplateSrv, ngDialog) {
		$controller('ADZestBaseEmailSettingsCtrl', {
			$scope: $scope
		});
		$scope.generalSettings = data.general_email_template_settings;
        $scope.hotelDetails = data.hotel_details;
		$scope.keyDeliveryCommonSettings = data.key_delivery_common_settings;
		// The below variables are not camel case as these are used in the shared HTML and are set from API in
        // other screens
		$scope.data.email_text_1 = "This is a sample text for testing. You can enter the required texts in the individual settings for each process.";
        $scope.data.email_text_2 = "This is a sample text for testing. You can enter the required texts in the individual settings for each process.";
        $scope.roomNumber = '101';

		$scope.previewClicked = function() {
            if ($scope.generalSettings.use_main_bg_image && $scope.generalSettings.main_bg_image.length > 0) {
                $scope.data.main_bg_style = "background-image:url(" + $scope.generalSettings.main_bg_image + ");";
            } else {
                $scope.data.main_bg_style = 'background:' + $scope.generalSettings.main_bg + ';';
            }
            ngDialog.open({
                closeByDocument: true,
                template: '/assets/partials/zestEmailTemplates/adZestKeyDeliveryEmailPreview.html',
                className: 'ngdialog-theme-default email-template-preview',
                scope: $scope
            });

        };

		$scope.saveSettings = function() {
			var params = {
				'key_delivery_common_settings': $scope.keyDeliveryCommonSettings
			};
			var options = {
				params: params,
				successCallBack: function() {
					$scope.successMessage = 'Success!';
				}
			};

			$scope.callAPI(adZestEmailTemplateSrv.saveSettings, options);
		};
	}
]);
