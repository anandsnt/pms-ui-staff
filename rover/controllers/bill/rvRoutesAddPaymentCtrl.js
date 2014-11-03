sntRover.controller('rvRoutesAddPaymentCtrl',['$scope','$rootScope','$filter', 'ngDialog', 'RVPaymentSrv', function($scope, $rootScope,$filter, ngDialog, RVPaymentSrv){
	BaseCtrl.call(this, $scope);

	$scope.saveData = {};
	$scope.saveData.card_number  = "";
	$scope.saveData.cvv = "";
	$scope.saveData.credit_card  =  "";
	$scope.saveData.name_on_card =  "";
	$scope.saveData.payment_type =  "";
	$scope.saveData.payment_type_description =  "";
	$scope.saveData.card_expiry_month = "";
	$scope.saveData.card_expiry_year = "";
	/**
    * MLI session set up
    */
	var MLISessionId = "";
	try {
			HostedForm.setMerchant($rootScope.MLImerchantId);
		}
		catch(err) {};

	
		$scope.cancelClicked = function(){
			$scope.showPaymentList();
		};
		/**
	* setting the scroll options for the add payment view
	*/
	var scrollerOptions = { preventDefault: false};
  	$scope.setScroller('newpaymentview', scrollerOptions);	

  	$scope.$on('showaddpayment', function(event){
  		$scope.refreshScroller('newpaymentview');						
	});
  	/**
    * function to show available payment types from server
    */
  	$scope.fetchAvailablePaymentTypes = function(){
        
            var successCallback = function(data) {
                
                $scope.availablePaymentTypes = data;
                $scope.$parent.$emit('hideLoader');
                $scope.refreshScroller('newpaymentview');
            };
            var errorCallback = function(errorMessage) {
                $scope.$parent.$emit('hideLoader');
                $scope.$emit('displayErrorMessage',errorMessage);
            };
           
            $scope.invokeApi(RVPaymentSrv.renderPaymentScreen, "", successCallback, errorCallback);
    };
    $scope.fetchAvailablePaymentTypes();

  // 	/* MLI integration starts here */

     $scope.savePaymentDetails = function(){

     		if($scope.saveData.payment_type != "CC"){
     			$scope.savePayment();
     			return;
     		}
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
			 		$scope.$emit('displayErrorMessage',["There is a problem with your credit card"]); 
			 	}			
			 	$scope.$apply(); 	
			 };

			try {
			    HostedForm.updateSession(sessionDetails, callback);	
			    $scope.$emit("showLoader");
			}
			catch(err) {
			   $scope.$emit('displayErrorMessage',["There was a problem connecting to the payment gateway."]);
			};
			 		
		};
		/**
	    * function to save a new payment type 
	    */
		$scope.savePayment = function(){
			
			
			$scope.saveData.reservation_id = $scope.reservationData.reservation_id;
			$scope.saveData.session_id = MLISessionId;
			$scope.saveData.mli_token = $scope.saveData.card_number.substr($scope.saveData.card_number.length - 4);
			$scope.saveData.card_expiry = $scope.saveData.card_expiry_month && $scope.saveData.card_expiry_year ? "20"+$scope.saveData.card_expiry_year+"-"+$scope.saveData.card_expiry_month+"-01" : "";
			var unwantedKeys = ["card_expiry_year","card_expiry_month", "selected_payment_type", "selected_credit_card","card_number","cvv"];
			var data = dclone($scope.saveData, unwantedKeys);
			$scope.paymentAdded(data);

		};
		/**
	    * function to set the selected payment type
	    */
		$scope.selectPaymentType = function(){
			for(var i = 0; i < $scope.availablePaymentTypes.length; i++){
				if($scope.availablePaymentTypes[i].name == $scope.saveData.payment_type){
					$scope.saveData.payment_type_description = $scope.availablePaymentTypes[i].description;
				}
			}

		}
	
}]);