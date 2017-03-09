admin.controller('adUpsellAddonSettingsCtrl', function($scope, ADUpsellAddonSrv, data) {

	BaseCtrl.call(this, $scope);
	/**
	 * function to save the details
	 */
	$scope.saveDetails = function() {
		var options = {
			params: $scope.data,
			successCallBack: $scope.goBackToPreviousState
		};

		$scope.callAPI(ADUpsellAddonSrv.saveDetails, options);
	};

	(function() {
		$scope.data = data;
	})();
});