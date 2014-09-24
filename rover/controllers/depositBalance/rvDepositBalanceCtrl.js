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
console.log($scope);
	//$scope.depositBalanceData = $scope.
	var MLISessionId = "";
	
	try {
			HostedForm.setMerchant($rootScope.MLImerchantId);
		}
	catch(err) {};
	$scope.depositBalanceNewCardData = {};
	$scope.makePaymentData = {};
	$scope.clickedMakePayment = function(){
		console.log($scope.depositBalanceNewCardData);
		var swiped = false;
		if(swiped){
			
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
			console.log("save payhhhhhhhhhhhhhhhhhhhhhhhhhhhhment");
              var dataToApiToAddNewCard = {
              	"session_id" : MLISessionId,
              	"user_id" :$scope.guestCardData.userId
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
	
}]);