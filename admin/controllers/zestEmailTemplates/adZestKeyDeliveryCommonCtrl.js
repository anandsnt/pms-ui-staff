admin.controller('ADZestKeyDeliveryCommonCtrl', ['$scope', 'data', '$filter', '$controller', 'adZestEmailTemplateSrv',
	function($scope, data, $filter, $controller, adZestEmailTemplateSrv) {
		$controller('ADZestBaseEmailSettingsCtrl', {
			$scope: $scope
		});
		$scope.keyDeliveryCommonSettings = data.key_delivery_common_settings;

		$scope.saveSettings = function(type) {
			var params = {
				'key_delivery_common_settings': $scope.keyDeliveryCommonSettings
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