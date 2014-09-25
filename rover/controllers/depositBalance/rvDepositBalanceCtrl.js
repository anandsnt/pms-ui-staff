sntRover.controller('RVDepositBalanceCtrl',[
					'$scope',
					'ngDialog', 
					'$rootScope', 
					'RVDepositBalanceSrv',
					'RVPaymentSrv',
					'$stateParams', 
		function($scope, 
				ngDialog, 
				$rootScope,
				RVDepositBalanceSrv, 
				RVPaymentSrv,
				$stateParams){
	BaseCtrl.call(this, $scope);
	
	$scope.$emit("UPDATE_DEPOSIT_BALANCE_FLAG");
console.log($scope);
	//$scope.depositBalanceData = $scope.
	var MLISessionId = "";
	var swipedData = {};
	
	try {
			HostedForm.setMerchant($rootScope.MLImerchantId);
		}
	catch(err) {};
	$scope.depositBalanceNewCardData = {};
	$scope.isSwiped = false;
	$scope.makePaymentData = {};
	$scope.clickedMakePayment = function(){
		console.log($scope.depositBalanceNewCardData);
		
		if($scope.isSwiped){
			$scope.handleSwipedData();
		} else {
			$scope.handleMLISessionId();
		}
		
	};
	$scope.handleMLISessionId = function(){
		if($scope.depositBalanceNewCardData.cardNumber.length>0){
			$scope.fetchMLISessionId();
		}
		else{
			// Client side validation added to eliminate a false session being retrieved in case of empty card number
			$scope.errorMessage = ["There is a problem with your credit card"];
		}
	};
	
	$scope.fetchMLISessionId = function(){
		 var sessionDetails = {};
		 sessionDetails.cardNumber = $scope.depositBalanceNewCardData.cardNumber;
		 sessionDetails.cardSecurityCode = $scope.depositBalanceNewCardData.ccv;
		 sessionDetails.cardExpiryMonth = $scope.depositBalanceNewCardData.expiryMonth;
		 sessionDetails.cardExpiryYear = $scope.depositBalanceNewCardData.expiryYear;
		
		 var callback = function(response){
		 	$scope.$emit("hideLoader");
		 	
		 	if(response.status ==="ok"){

		 		MLISessionId = response.session;
		 		$scope.savePayment('manual');// call save payment details WS		 		
		 	}
		 	else{
		 		$scope.errorMessage = ["There is a problem with your credit card"];
		 	}			
		 	$scope.$apply(); 	
		 };

		try {
		    HostedForm.updateSession(sessionDetails, callback);	
		    $scope.$emit("showLoader");
		}
		catch(err) {
		   $scope.errorMessage = ["There was a problem connecting to the payment gateway."];
		};
		 		
	};
	
	$scope.savePayment = function(type){
		if(type === "manual"){
			  var cardExpiry = ($scope.depositBalanceNewCardData.expiryMonth!=='' && $scope.depositBalanceNewCardData.expiryYear!=='') ? "20"+$scope.depositBalanceNewCardData.expiryYear+"-"+$scope.depositBalanceNewCardData.expiryMonth+"-01" : "";
              var dataToApiToAddNewCard = {
	              	"session_id" : MLISessionId,
	              	"user_id" :$scope.guestCardData.userId,
	              	"card_expiry": cardExpiry,
	              	"is_deposit": true
              };
              $scope.invokeApi(RVPaymentSrv.saveGuestPaymentDetails, dataToApiToAddNewCard, $scope.successSavePayment);
		}
	};
	$scope.successSavePayment = function(data){
		var dataToMakePaymentApi = {
			"payment_id": data.data.id,
			"reservation_id": $scope.reservationData.reservation_card.reservation_id,
			"amount": $scope.makePaymentData.amount
		};
		 $scope.invokeApi(RVPaymentSrv.makePaymentOnDepositBalance, dataToApiToDoPayment);
	};
	$scope.$on("SHOW_SWIPED_DATA_ON_DEPOSIT_BALANCE_SCREEN", function(event, data){
		console.log(JSON.stringify(data));
		swipedData = data;
		$scope.isSwiped = true;
		$scope.depositBalanceNewCardData.cardNumber  = data.card_number;
		$scope.depositBalanceNewCardData.expiryMonth = data.card_expiry.slice(-2);;
		$scope.depositBalanceNewCardData.expiryYear  = data.card_expiry.substring(0, 2);;
		$scope.depositBalanceNewCardData.cardHolderName  = data.name_on_card;
		
		$scope.$emit("hideLoader");
		
	});
	
	$scope.handleSwipedData = function(){
		var cardExpiry = ($scope.depositBalanceNewCardData.expiryMonth!=='' && $scope.depositBalanceNewCardData.expiryYear!=='') ? "20"+$scope.depositBalanceNewCardData.expiryYear+"-"+$scope.depositBalanceNewCardData.expiryMonth+"-01" : "";
		var data = {
			    card_expiry: cardExpiry,
			    name_on_card: $scope.depositBalanceNewCardData.cardHolderName,
			    payment_type: "CC",
			    payment_credit_type: swipedData.cardType,
			    credit_card: swipedData.cardType,
				mli_token: swipedData.token,
			    et2: swipedData.getTokenFrom.et2,
				ksn: swipedData.getTokenFrom.ksn,
				pan: swipedData.getTokenFrom.pan,
				etb: swipedData.getTokenFrom.etb,
				user_id :$scope.guestCardData.userId,
				is_deposit: true
		    };
		    alert(data);
	};
	
}]);