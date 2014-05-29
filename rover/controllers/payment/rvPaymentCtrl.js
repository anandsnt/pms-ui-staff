sntRover.controller('RVPaymentMethodCtrl',['$rootScope', '$scope', '$state', 'RVPaymentSrv','ngDialog', function($rootScope, $scope, $state, RVPaymentSrv, ngDialog){
	BaseCtrl.call(this, $scope);
	
	// $scope.saveData.card_number = $scope.passData.card_number;
	// $scope.saveData.credit_card = $scope.passData.credit_card;
	// $scope.saveData.name_on_card = $scope.passData.name_on_card;
	$scope.saveData = {};
	

	
	
	// var passData = {
		  	 		// "reservationId": $scope.reservationData.reservation_card.reservation_id,
		  	 		// "fromView": "staycard",
		  	 		// "selected_payment_type": 0, //Default value of credit card - TODO:check in seed data
		  	 		// "credit_card": data.RVCardReadCardType,
		  	 		// "card_number": data.token,
		  	 		// "name_on_card": data.RVCardReadCardName
		  	 	// };
	
	
	
	
	$scope.isFromGuestCard = false;
	if($scope.passData.fromView == "guestcard"){
		$scope.isFromGuestCard = true;
	}
	/*
	 * Render success callback
	 * Populates API with dropdown values
	 */
	$scope.successRender = function(data){
		$scope.$emit("hideLoader");
		$scope.data = data;
		$scope.paymentTypeValues = [];
		
		
		
		
		console.log(JSON.stringify($scope.passData));
	$scope.saveData.selected_payment_type = 0;//Only for swipe
	$scope.paymentTypeValues = $scope.data[0].values;
	$scope.saveData.card_number  = $scope.passData.card_number;
	$scope.saveData.selected_credit_card  =  $scope.passData.credit_card;
	$scope.saveData.name_on_card =  $scope.passData.name_on_card;
	$scope.saveData.card_expiry_month = $scope.passData.card_expiry_month;
		
		
		
	};
	$scope.invokeApi(RVPaymentSrv.renderPaymentScreen, {}, $scope.successRender);
	$scope.renderPaymentValues = function(){
		$scope.paymentTypeValues = $scope.data[$scope.saveData.selected_payment_type].values;
	};
	/*
	 * Success callback of save payment in guest card
	 * updating the list payments with new data 
	 */
	$scope.saveSuccessGuest = function(){
		$scope.$emit("hideLoader");
		ngDialog.close();
		$scope.paymentData.data.push($scope.saveData);
	};
	/*
	 * Success callback of reservation payment
	 * updating staycard with new data
	 */
	$scope.saveSuccess = function(){
		$scope.$emit("hideLoader");
		ngDialog.close();
		var cardNumber = $scope.saveData.card_number;
		var expiryDate = $scope.saveData.card_expiry_month+"/"+$scope.saveData.card_expiry_year;
		var cardCode = $scope.saveData.credit_card;
		$scope.paymentData.payment_details.card_type_image = cardCode.toLowerCase()+".png";
		$scope.paymentData.payment_details.card_number = cardNumber.substr(cardNumber.length - 4);
		$scope.paymentData.payment_details.card_expiry = expiryDate;
	};
	$scope.failureCallBack = function(errorMessage){
		$scope.$emit("hideLoader");
		$scope.errorMessage = errorMessage;
	};
	/*
	 * Save new payment - GUestcard or staycard
	 */
	$scope.savePayment = function(){
	
		
		$scope.saveData.payment_type = $scope.data[$scope.saveData.selected_payment_type].name;
		$scope.saveData.card_expiry = $scope.saveData.card_expiry_month && $scope.saveData.card_expiry_year ? "20"+$scope.saveData.card_expiry_year+"-"+$scope.saveData.card_expiry_month+"-01" : "";
		//$scope.passData  => Gives information from which view popup opened 
		//get reservation id if it is from staycard
		if($scope.passData.fromView == "staycard"){
			$scope.saveData.reservation_id = $scope.passData.reservationId;
			
		} else {
			$scope.saveData.guest_id = $scope.passData.guest_id;
			$scope.saveData.user_id = $scope.passData.user_id;
		}
		var unwantedKeys = ["card_expiry_year","card_expiry_month", "selected_payment_type"];
		var data = dclone($scope.saveData, unwantedKeys);
		if($scope.passData.fromView == "staycard"){
			
			$scope.invokeApi(RVPaymentSrv.savePaymentDetails, data, $scope.saveSuccess, $scope.failureCallBack);
		} else {
			//Used to update the list with new value
			var cardNumber = $scope.saveData.card_number;
			var expiryDate = $scope.saveData.card_expiry_month+"/"+$scope.saveData.card_expiry_year;
			//Created info to update the payment list in guest tab with new data
			$scope.newPaymentInfo = {
				"card_code": $scope.saveData.credit_card,
				"mli_token_display":cardNumber.substr(cardNumber.length - 4),
				"card_expiry": $scope.saveData.card_expiry,
				"card_name": $scope.saveData.name_on_card,
				"is_primary":false
			};
			$scope.invokeApi(RVPaymentSrv.saveGuestPaymentDetails, data, $scope.saveSuccessGuest, $scope.failureCallBack);
		}
		
		
	};
	$scope.clickCancel = function(){
		ngDialog.close();
	};
	
	
}]);