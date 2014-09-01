sntRover.controller('rvRoutesAddPaymentCtrl',['$scope','$rootScope','$filter', 'ngDialog', function($scope, $rootScope,$filter, ngDialog){
	BaseCtrl.call(this, $scope);

	$scope.saveData = {};
	$scope.saveData.card_number  = "";
	$scope.saveData.credit_card  =  "";
	$scope.saveData.name_on_card =  "";
	$scope.saveData.card_expiry_month = "";
	$scope.saveData.card_expiry_year = "";

	var MLISessionId = "";
	
		$scope.cancelClicked = function(){
			$scope.showPaymentList();
		};
		/**
	* setting the scroll options for the add payment view
	*/
	var scrollerOptions = { preventDefault: false};
  	$scope.setScroller('newpaymentview', scrollerOptions);	

  	setTimeout(function(){
				$scope.refreshScroller('newpaymentview');					
				}, 
			3000);

  	/* MLI integration starts here */

     $scope.savePaymentDetails = function(){  	

    	$scope.fetchMLISessionId = function(){
			 var sessionDetails = {};
			 sessionDetails.cardNumber = $scope.saveData.card_number;
			 sessionDetails.cardSecurityCode = $scope.saveData.cvv;
			 sessionDetails.cardExpiryMonth = $scope.saveData.card_expiry_month;
			 sessionDetails.cardExpiryYear = $scope.saveData.card_expiry_year;
			
			 var callback = function(response){
			 	$scope.$emit("hideLoader");
			 	
			 	if(response.status ==="ok"){

			 		MLISessionId = response.session;
			 		$scope.savePayment();// call save payment details WS		 		
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
	
}]);