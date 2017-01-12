admin.controller('ADZestWebRoomReadyEmailSetupCtrl', function($scope, ADZestWebRoomReadyEmailSetupSrv,data) {

	BaseCtrl.call(this, $scope);

	var saveRoomReayEmailSettingsSuccessCallback = function() {
		$scope.goBackToPreviousState();
	};

	/**
	 * function to save the details
	 */
	$scope.saveZestMobileAppMarketingDetails = function() {
		var options = {
            params: $scope.data,
            successCallBack: saveRoomReayEmailSettingsSuccessCallback
        };

        $scope.callAPI(ADZestWebRoomReadyEmailSetupSrv.saveRoomReayEmailSettings, options);
	};

	(function() {
		$scope.data = data;
	})();
});