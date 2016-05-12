sntRover.controller('reservationPaymentController',['$scope','$rootScope', function($scope,$rootScope){

	// To add class based on number of buttons present.
	$scope.getHasButtonClass = function(){

		var status = $scope.reservationData.reservation_card.reservation_status,
		    isCC = $scope.reservationData.reservation_card.has_any_credit_card_attached_bill,
		    hasButtonClass = "has-button";
		if(status === 'NOSHOW' || status === 'CHECKEDOUT' || status === 'CANCELED'){
			hasButtonClass = "";
		}
		else if(isCC && $scope.showCCAuthButton()){
			hasButtonClass = "has-buttons";
		}
		return hasButtonClass;
	};

	// To show button based on resrvation status
	$scope.displayButton = function(){
		var status = $scope.reservationData.reservation_card.reservation_status,
			display = true;
		if(status === 'NOSHOW' || status === 'CHECKEDOUT' || status === 'CANCELED'){
			display = false;
		}
		return display;

	};

	// To hide/show CCAuthButton
	$scope.showCCAuthButton = function(){
		if($scope.reservationData.reservation_card.has_any_credit_card_attached_bill && $scope.isStandAlone){
			return true;
		}
		else{
			return false;
		}
	};

	// Update while changing credit card from bill screen.
	$rootScope.$on('UPDATEDPAYMENTLIST', function(event, data) {
			$scope.reservationData.reservation_card.payment_details.card_type_image = data.card_code+".png";
			$scope.reservationData.reservation_card.payment_details.card_number = data.card_number;
			$scope.reservationData.reservation_card.payment_details.card_expiry = data.card_expiry;
			$scope.reservationData.reservation_card.payment_details.is_swiped = data.is_swiped;
	});

	//CICO-29224 - Listener to update the CC selection to show the CC Auth btn in staycard
	$rootScope.$on('REFRESHCCSELECTION', function(event, isCC) {
		$scope.reservationData.reservation_card.has_any_credit_card_attached_bill = typeof isCC === 'undefined' ? true : isCC;
	});
}]);