admin.controller('adMonsciergeSetupCtrl', ['$scope', 'adMonsciergeSetupSrv', '$rootScope',
	function($scope, adMonsciergeSetupSrv, $rootScope) {
		BaseCtrl.call(this, $scope);

		$scope.isPmsProductionEnv = $rootScope.isPmsProductionEnv;
		$scope.saveSettings = function() {
			var onSaveSettingsSucces = function() {
					$scope.successMessage = 'Success, Your settings has been saved.';
				},
				options = {
					params: { 'monscierge': $scope.data },
					successCallBack: onSaveSettingsSucces
				};

			$scope.callAPI(adMonsciergeSetupSrv.saveSettings, options);
		};

		$scope.fetchSettings = function() {
			var onFetchSettingsSucces = function(data) {
					$scope.data = data.monscierge;
					$scope.hotel_code = data.hotel_code;
				},
				options = {
					successCallBack: onFetchSettingsSucces
				};

			$scope.callAPI(adMonsciergeSetupSrv.getSettings, options);
		};

		(function init() {
			$scope.errorMessage = '';
			$scope.successMessage = '';
			$scope.fetchSettings();
		}());

	}
]);
