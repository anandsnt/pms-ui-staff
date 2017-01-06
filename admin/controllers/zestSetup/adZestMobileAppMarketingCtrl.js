admin.controller('ADZestMobileAppMarketingCtrl', [
	'$scope',
	'adZestMobileAppMarketingSrv',
	'data',
	function($scope,
			adZestMobileAppMarketingSrv,data){

	BaseCtrl.call(this, $scope);

	var successCallbackOfZestMobileAppMarketing = function(response) {
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

	(function(){
		$scope.data = data;
	})();
}]);