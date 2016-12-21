admin.controller('adsnapshotSetupCtrl', ['$scope',
	'$state',
	'snapshotSetupData',
	'adSnapShotSetupSrv',
	function($scope, $state, snapshotSetupData, adSnapShotSetupSrv) {
		BaseCtrl.call(this, $scope);

		$scope.publishFullExport = function() {
			var onpublishFullExportSucces = function() {
					$scope.successMessage = 'Publishing was Success';
				},
				options = {
					params: {},
					successCallBack: onpublishFullExportSucces
				};
				
			$scope.callAPI(adSnapShotSetupSrv.publishFullExport, options);
		};

		$scope.saveSettings = function() {
			var onSaveSettingsSucces = function() {
					$scope.successMessage = 'Success, Your settings has been saved.';
				},
				options = {
					params: $scope.snapChatData,
					successCallBack: onSaveSettingsSucces
				};

			$scope.callAPI(adSnapShotSetupSrv.saveSettings, options);
		};

		(function init() {
			$scope.errorMessage = '';
			$scope.successMessage = '';
			$scope.snapChatData = snapshotSetupData;
		}());

	}
]);