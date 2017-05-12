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
		$scope.data = data;

	};

	// fetching the settings details
//	$scope.invokeApi(ADGuestIDSetupSrv.fetchGuestIDSetupDetails, {}, fetchCompletedOfSettingsDetails);

	/*
	* success call back of details web service call
	*/
	var successCallbackOfSaveDetails = function(data) {
		$scope.$emit('hideLoader');
		$scope.errorMessage = '';
	};

	$scope.save = function() {
		var postingData = {};

		postingData.scan_guest_id_active = $scope.data.scan_guest_id_active;

		// calling the save api
		$scope.invokeApi(ADGuestIDSetupSrv.saveGuestIDSetup, postingData, successCallbackOfSaveDetails);
	};

}]);