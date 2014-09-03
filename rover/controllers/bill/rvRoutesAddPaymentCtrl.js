sntRover.controller('rvRoutesAddPaymentCtrl',['$scope','$rootScope','$filter', 'ngDialog', 'RVPaymentSrv', function($scope, $rootScope,$filter, ngDialog, RVPaymentSrv){
	BaseCtrl.call(this, $scope);

	$scope.saveData = {};
	$scope.saveData.card_number  = "";
	$scope.saveData.cvv = "";
	$scope.saveData.credit_card  =  "";
	$scope.saveData.name_on_card =  "";
	$scope.saveData.payment_type =  "";
	$scope.saveData.card_expiry_month = "";
	$scope.saveData.card_expiry_year = "";

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

  	$scope.fetchAvailablePaymentTypes = function(){
        
            var successCallback = function(data) {
                
                $scope.availablePaymentTypes = data;
                $scope.$parent.$emit('hideLoader');
                $scope.refreshScroller('newpaymentview');
            };
            var errorCallback = function(errorMessage) {
                $scope.$parent.$emit('hideLoader');
                $scope.errorMessage = errorMessage;
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

		$scope.savePayment = function(){
			
			var successCallback = function(data) {
                
                $scope.attachedPaymentTypes.push(data);
                $scope.$parent.$emit('hideLoader');
            };
            var errorCallback = function(errorMessage) {
                $scope.$parent.$emit('hideLoader');
                $scope.errorMessage = errorMessage;
            };
			$scope.saveData.user_id = $scope.reservationData.user_id;
			$scope.saveData.session_id = MLISessionId;
			var expiry_year =  2000 + parseInt($scope.saveData.card_expiry_year) ;
			$scope.saveData.card_expiry = expiry_year + "-"+ $scope.saveData.card_expiry_month+"-01";
			$scope.invokeApi(RVPaymentSrv.savePaymentDetails, $scope.saveData, successCallback, errorCallback);
		};
	
}]);