sntRover.controller('RVValidateEmailCtrl',['$scope', '$state', 'ngDialog', 'RVContactInfoSrv',  function( $scope, $state, ngDialog, RVContactInfoSrv){
	BaseCtrl.call(this, $scope);
	
	$scope.saveData = {};
	$scope.saveData.email = "";
	// To cancel popup
	$scope.clickCancel = function(){
		ngDialog.close();
	};
	// To handle submit & goto checkout click
	$scope.submitAndGoToCheckout = function(){
		if($scope.saveData.email == ""){
			alert("Please enter email");
			return false;
		}
		
		$scope.saveData.guest_id = $scope.guestCardData.guestId;
        $scope.saveData.user_id = $scope.guestCardData.userId;
        
        var data = { 'data': $scope.saveData, 'userId':$scope.guestCardData.userId };
		$scope.invokeApi(RVContactInfoSrv.saveContactInfo, data, $scope.submitAndGoToCheckoutSuccessCallback);
	};
	// Success callback for submit & goto checkout
	$scope.submitAndGoToCheckoutSuccessCallback = function(){
		$scope.guestCardData.contactInfo.email = $scope.saveData.email;
		$scope.$emit('hideLoader');
		ngDialog.close();
	};
	// Failure callback for submit & goto checkout
	$scope.saveUserInfoFailureCallback = function(data){
        $scope.$emit('hideLoader');
        $scope.errorMessage = data;
    };
	
}]);