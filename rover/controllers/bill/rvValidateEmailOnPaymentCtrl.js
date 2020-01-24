sntRover.controller('RVValidateEmailOnPaymentCtrll', ['$scope', '$state', 'ngDialog', 'RVContactInfoSrv',  function( $scope, $state, ngDialog, RVContactInfoSrv) {
	BaseCtrl.call(this, $scope);

	$scope.saveData = {};
	$scope.saveData.email = "";
	// To handle ignore & goto checkout click
	$scope.ignoreAndGoToCheckout = function() {
		// Callback method
		if ($scope.callBackMethodCheckout) {
			$scope.callBackMethodCheckout();
		}
		ngDialog.close();
	};
	// To handle submit & goto checkout click
	$scope.submitAndTriggerEmail = function() {
		if ($scope.saveData.email === "") {
			return false;
		}

		$scope.$emit("AUTO_TRIGGER_EMAIL_AFTER_PAYMENT");
	};
	// Success callback for submit & goto checkout
	$scope.submitAndGoToCheckoutSuccessCallback = function() {
		$scope.guestCardData.contactInfo.email = $scope.saveData.email;
		$scope.saveData.isEmailPopupFlag = true ;
		$scope.$emit('hideLoader');
		ngDialog.close();
		// Callback method
		if ($scope.callBackMethodCheckout) {
			$scope.callBackMethodCheckout();
		}
	};
	// Failure callback for submit & goto checkout
	$scope.saveUserInfoFailureCallback = function(data) {
        $scope.$emit('hideLoader');
        $scope.errorMessage = data;
    };

}]);