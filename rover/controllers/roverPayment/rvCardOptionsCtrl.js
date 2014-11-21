sntRover.controller('RVCardOptionsCtrl',
	['$rootScope', 
	 '$scope', 
	 '$state', 
	 'ngDialog',
	 '$location',
	 'RVPaymentSrv', 
	function($rootScope, $scope, $state, ngDialog, $location, RVPaymentSrv){
		BaseCtrl.call(this, $scope);
		
		var absoluteUrl = $location.$$absUrl;
		domainUrl = absoluteUrl.split("/staff#/")[0];
		$scope.cardData = {};
		$scope.cardData.cardNumber = "";
		$scope.cardData.CCV = "";
		$scope.cardData.expiryMonth ="";
		$scope.cardData.expiryYear = "";
	
		$scope.iFrameUrl = domainUrl + "/api/ipage/index.html?card_holder_first_name=" + $scope.passData.details.firstName + "&card_holder_last_name=" + $scope.passData.details.lastName + "&service_action=createtoken";
		$scope.shouldShowIframe = false;	
		
		/*
		 * Handle toggle action onsite/callin
		 */
		$scope.clickedOnSiteCallIn = function(){
			
			$scope.shouldShowIframe = !$scope.shouldShowIframe;
		
		};

		var notifyParent = function(tokenDetails){

			var payementData = {};
			payementData.cardDetails = $scope.cardData;
			payementData.tokenDetails = tokenDetails;
			console.log(payementData);
			$scope.$emit("TOKEN_CREATED", payementData);
		};

		var setUpSessionDetails = function(){
			
			 var sessionDetails = {};
			 sessionDetails.cardNumber = $scope.cardData.cardNumber;
			 sessionDetails.cardSecurityCode = $scope.cardData.CCV;
			 sessionDetails.cardExpiryMonth = $scope.cardData.expiryMonth;
			 sessionDetails.cardExpiryYear = $scope.cardData.expiryYear;
			 return sessionDetails;
		};
		/*
		 * Function to get MLI token on click 'Add' button in form
		 */
		$scope.getToken = function(){

			var sessionDetails = setUpSessionDetails();
			var successCallBack = function(response){
				$scope.$emit("hideLoader");
				
				response.isSixPayment = false;
				console.log("===========")
				console.log(response)
				notifyParent(response);
				$scope.$apply(); 
			};
			var failureCallBack = function(data){
				$scope.$emit("hideLoader");
				// $scope.errorMessage = ["There is a problem with your credit card"];
				$scope.$emit('MLIfailureCallBack');
				$scope.$apply(); 
			};

			if(sessionDetails.cardNumber.length > 0 ){
				try {
					sntapp.MLIOperator.fetchMLISessionDetails(sessionDetails,successCallBack,failureCallBack);
					$scope.$emit("showLoader");
				}
				catch(err) {
					$scope.$emit('MLIGatewayFailure');
				};
			}
			else{
				$scope.$emit('MLIfailureCallBack');
			};
			
		};

		/*
		 * Function to recieve six payment token on click 'Add' button in form
		 */

		$rootScope.$on('six_token_recived',function(e,data){
			data.isSixPayment = true;
			notifyParent(data.six_payment_data);
		});


		$scope.setCreditCardFromList = function(index){
			$scope.$emit('cardSelected',{'index':index});
		};
		
}]);