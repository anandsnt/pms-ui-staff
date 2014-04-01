admin.controller('ADUpsellLateCheckoutCtrl',['$scope','adUpsellLatecheckoutService',  function($scope,adUpsellLatecheckoutService){
	BaseCtrl.call(this, $scope);
	$scope.upsellData = {};
	//$scope.hotelId = $stateParams.id;
   /**
    * To Activate/Inactivate user
    * @param {string} user id 
    * @param {string} current status of the user
    * @param {num} current index of user
    */ 

    $scope.fetchUpsellDetails = function(){
		var fetchUpsellDetailsSuccessCallback = function(data) {
			$scope.$emit('hideLoader');
			$scope.upsellData = data;
		};
		$scope.invokeApi(adUpsellLatecheckoutService.fetch, {},fetchUpsellDetailsSuccessCallback);
	};

	$scope.fetchUpsellDetails();


}]);