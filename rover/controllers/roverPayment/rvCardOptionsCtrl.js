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
		/*
		 * Function to get MLI token on click 'Add' button in form
		 */
		$scope.getToken = function(){
			console.log("----------+++-----------");
			 var sessionDetails = {};
			 
			 console.log($scope.cardData.cardNumber);
			 
			 sessionDetails.cardNumber = $scope.cardData.cardNumber;
			 sessionDetails.cardSecurityCode = $scope.cardData.CCV;
			 sessionDetails.cardExpiryMonth = $scope.cardData.expiryMonth;
			 sessionDetails.cardExpiryYear = $scope.cardData.expiryYear;
			var successCallBack = function(response){
				console.log("successCallBack");
				console.log("success"+response.session);
				$scope.$emit("hideLoader");
				
				MLISessionId = response.session;
				console.log("sess==="+MLISessionId);
				$scope.$emit("MLI_TOKEN_CREATED", mliData);
			};
			var failureCallBack = function(data){
					console.log("failureCallBack");
				$scope.$emit("hideLoader");
				$scope.errorMessage = ["There is a problem with your credit card"];
				$scope.$apply(); 
			};
			try {
				console.log("try");
				sntapp.MLIOperator.fetchMLISessionDetails(sessionDetails,successCallBack,failureCallBack);
				$scope.$emit("showLoader");
			}
			catch(err) {
				console.log("ctach");
				$scope.errorMessage = ["There was a problem connecting to the payment gateway."];
			};
		};
			

	
}]);