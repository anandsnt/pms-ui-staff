admin.controller('adSnapshotChargeGroupMappingCtrl', ['$scope',
	'adSnapShotSetupSrv',
	'ADChargeGroupsSrv',
	function($scope, adSnapShotSetupSrv, ADChargeGroupsSrv) {
		BaseCtrl.call(this, $scope);	
		
		$scope.saveSettings = function() {
			var onSaveSettingsSucces = function() {
					$scope.successMessage = 'Success, Your settings has been saved.';
				},
				options = {
					params: $scope.snapshotData,
					successCallBack: onSaveSettingsSucces
				};

			$scope.callAPI(adSnapShotSetupSrv.saveChargeGroupMapping, options);
		};

		$scope.fetchSettings = function() {
			var onFetchSettingsSucces = function(data) {
					$scope.snapshotData = data;
				},
				options = {					
					successCallBack: onFetchSettingsSucces
				};

			$scope.callAPI(adSnapShotSetupSrv.fetchChargeGroupMapping, options);
		};

		/*
	    * To fetch charge groups list
	    */
		var fetchChargeGroupsSuccessCallback = function(data) {
			$scope.chargeGroups = data.charge_groups;
			$scope.fetchSettings();
		};	

		(function init() {
			$scope.errorMessage = '';
			$scope.successMessage = '';			
			$scope.invokeApi(ADChargeGroupsSrv.fetch, {}, fetchChargeGroupsSuccessCallback);
		}());

	}
]);