admin.controller('ADZestMobileAppMarketingCtrl', function($scope, adZestMobileAppMarketingSrv,data) {

	BaseCtrl.call(this, $scope);

	var successCallbackOfZestMobileAppMarketing = function() {
		$scope.goBackToPreviousState();
	};

	/**
	 * function to save the details
	 */
	$scope.saveZestMobileAppMarketingDetails = function() {
		var options = {
            params: $scope.data,
            successCallBack: successCallbackOfZestMobileAppMarketing
        };

        $scope.callAPI(adZestMobileAppMarketingSrv.saveZestMobileAppMarketing, options);
	};

	(function() {
		$scope.data = data;
	})();
});