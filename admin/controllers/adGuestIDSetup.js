admin.controller('ADGuestIDSetup', ['$scope', '$state', 'ADGuestIDSetupSrv', '$rootScope', function($scope, $state, ADGuestIDSetupSrv, $rootScope) {

	/*
	* controller class for guest review setup
	*/

	BaseCtrl.call(this, $scope);
	$scope.errorMessage = '';

	/*
	* success call back of details web service call
	*/
	var fetchCompletedOfSettingsDetails = function(data) {
		$scope.$emit('hideLoader');
		$scope.data = data.guest_id_scan;
	};

	// fetching the settings details
	$scope.invokeApi(ADGuestIDSetupSrv.fetchGuestIDSetupDetails, {}, fetchCompletedOfSettingsDetails);

	/*
	* success call back of details web service call
	*/
	var successCallbackOfSaveDetails = function(data) {
		$scope.$emit('hideLoader');
		$scope.errorMessage = '';
	};

	$scope.save = function() {
		var postingData = {
			'guest_id_scan':{
				'scan_guest_id_active':$scope.data.scan_guest_id_active
			}
		};
		postingData.guest_id_scan.scan_guest_id_active = $scope.data.scan_guest_id_active;

		// calling the save api
		$scope.invokeApi(ADGuestIDSetupSrv.saveGuestIDSetup, postingData, successCallbackOfSaveDetails);
	};

}]);