admin.controller('adsnapshotSetupCtrl', ['$scope',
	'$state',
	'snapshotSetupData',
	'adSnapShotSetupSrv',
	'$timeout',
	function($scope, $state, snapshotSetupData, adSnapShotSetupSrv, $timeout) {
		BaseCtrl.call(this, $scope);

		$scope.hours = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
    	$scope.minutes = ["00", "15", "30", "45"];
    	$scope.primeTimes = [ "AM", "PM"];
    	$scope.retry_count_options = ["1", "2", "3", "4", "5"];

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
					params: $scope.snapshotData,
					successCallBack: onSaveSettingsSucces
				};

			$scope.callAPI(adSnapShotSetupSrv.saveSettings, options);
		};

		$scope.fetchSettings = function() {
			var onFetchSettingsSucces = function(data) {
					$scope.snapshotData = data;
				},
				options = {					
					successCallBack: onFetchSettingsSucces
				};
			$scope.callAPI(adSnapShotSetupSrv.getSettings, options);
		};

		(function init() {
			$scope.errorMessage = '';
			$scope.successMessage = '';
			$scope.fetchSettings();
		}());

	}
]);