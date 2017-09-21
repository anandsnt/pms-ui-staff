admin.controller('adMonsciergeSetupCtrl', ['$scope', 'adMonsciergeSetupSrv',
	function($scope, adMonsciergeSetupSrv) {
		BaseCtrl.call(this, $scope);

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
