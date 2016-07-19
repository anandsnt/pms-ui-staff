sntPay.controller('sntPaymentController', function($scope) {

	var zeroAmount = parseFloat("0.00");

	$scope.showSelectedCard = function() {
		//below condition may be modified wrt payment gateway and all
		var isCCPresent = ($scope.selectedPaymentType === "CC" && $scope.attachedCc.ending_with.length > 0);
		return isCCPresent;
	};

	var initiate = function(){
		
		$scope.actionType = !!$scope.actionType ? $scope.actionType : 'DEFAULT';
	}();
	

});