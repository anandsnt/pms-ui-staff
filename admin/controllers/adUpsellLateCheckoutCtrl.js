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
			// $scope.onStatus = ($scope.upsellData.is_late_checkout_set === "true") ? "on" : "";
			// $scope.checkedStatus = ($scope.upsellData.is_exclude_guests === "true")? "checked" : "";
		};
		$scope.invokeApi(adUpsellLatecheckoutService.fetch, {},fetchUpsellDetailsSuccessCallback);
	};

	$scope.fetchUpsellDetails();

	$scope.hours = ["01","02","03","04","05","06","07","08","09","10","11","12"];
	$scope.minutes = ["00","15","30","45"];




	$scope.switchClicked = function(){

		if($scope.upsellData.is_late_checkout_set === 'true')
			$scope.upsellData.is_late_checkout_set = 'false';
		else
			$scope.upsellData.is_late_checkout_set = 'true';
		
	}
	$scope.checkBoxClicked = function(){
		//$scope.checkedStatus = ($scope.checkedStatus != "checked") ? "checked" : "";

		if($scope.upsellData.is_exclude_guests === 'true')
			$scope.upsellData.is_exclude_guests = 'false';
		else
			$scope.upsellData.is_exclude_guests = 'true';
	}

}]);