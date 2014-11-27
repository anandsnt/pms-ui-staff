sntRover.controller('RVCardOptionsCtrl',
	['$rootScope', 
	 '$scope', 
	 '$state', 
	 'ngDialog',
	 '$location',
	 '$document',
	 'RVPaymentSrv', 
	function($rootScope, $scope, $state, ngDialog, $location, $document, RVPaymentSrv){
		BaseCtrl.call(this, $scope);

		console.log("innnnnnnnnnnnnnnnnnnnn")
		
		var absoluteUrl = $location.$$absUrl;
		domainUrl = absoluteUrl.split("/staff#/")[0];
		$scope.cardData = {};
		$scope.cardData.addToGuestCard = false;
		$scope.cardData.cardNumber = "";
		$scope.cardData.CCV = "";
		$scope.cardData.expiryMonth ="";
		$scope.cardData.expiryYear = "";
		var time = new Date().getTime();
		$scope.shouldShowAddNewCard = true;
		$scope.iFrameUrl = domainUrl + "/api/ipage/index.html?card_holder_first_name=" + $scope.passData.details.firstName + "&card_holder_last_name=" + $scope.passData.details.lastName + "&service_action=createtoken&time="+time;
		if($rootScope.paymentGateway == "sixpayments"){
			$scope.shouldShowAddNewCard = false;
			var iFrame = $document.find("sixIframe");
			iFrame.attr("src", $scope.iFrameUrl);
		}
		$scope.shouldShowIframe = false;	

		console.log("outytttttttttttttttttttt")


		var emptySessionDetails = function(){
				$scope.cardData.cardNumber = "";
				$scope.cardData.CCV = "";
				$scope.cardData.expiryMonth = "";
				$scope.cardData.expiryYear = "";
		};

		$scope.$on("clearCardDetails",function(){
				emptySessionDetails();
		});

		var notifyParent = function(tokenDetails){

			var payementData = {};
			payementData.cardDetails = angular.copy($scope.cardData);
			payementData.tokenDetails = tokenDetails;
			console.log(payementData);
			$scope.$emit("TOKEN_CREATED", payementData);
			$scope.$digest();
			
		};
		// $scope.$watch('shouldShowIframe', function(o,n){
			// console.log(o+"========*********======="+n);
		// });

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
			data.six_payment_data.isSixPayment = true;
			$scope.shouldShowAddNewCard = false;
			notifyParent(data.six_payment_data);
		});


		$scope.setCreditCardFromList = function(index){
			$scope.$emit('cardSelected',{'index':index});
		};

	    $scope.cancelCardSelection = function(){
	    	console.log("cancel");
	    	$scope.$emit('cancelCardSelection');
	    };
		
}]);