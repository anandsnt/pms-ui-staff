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

		var emptySessionDetails = function(){
				$scope.cardData.cardNumber = "";
				$scope.cardData.CCV = "";
				$scope.cardData.expiryMonth = "";
				$scope.cardData.expiryYear = "";
		};

		var notifyParent = function(tokenDetails){

			var payementData = {};
			payementData.cardDetails = angular.copy($scope.cardData);
			payementData.tokenDetails = tokenDetails;
			console.log(payementData);
			$scope.$emit("TOKEN_CREATED", payementData);
			emptySessionDetails();
		};

		var notifyParentError = function(errorMessage){
			$scope.$emit("MLI_ERROR", errorMessage);
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
				response.isSixPayment = false;
				notifyParent(response);
			};
			var failureCallback = function(errorMessage){
				notifyParentError(errorMessage);
			};
			$scope.fetchMLI (sessionDetails,successCallBack,failureCallback);	//Base Ctrl function		
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

	    $scope.cancelCardSelection = function(){
	    	$scope.$emit('cancelCardSelection');
	    };
		
}]);