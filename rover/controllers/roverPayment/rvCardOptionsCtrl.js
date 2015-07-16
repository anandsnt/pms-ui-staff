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
		 $scope.renderDataFromSwipe = function(swipedDataToRenderInScreen){
	    	$scope.cardData.cardNumber = swipedDataToRenderInScreen.cardNumber;
			$scope.cardData.userName   = swipedDataToRenderInScreen.nameOnCard;
			$scope.cardData.expiryMonth = swipedDataToRenderInScreen.cardExpiryMonth;
			$scope.cardData.expiryYear = swipedDataToRenderInScreen.cardExpiryYear;
			$scope.cardData.cardType = swipedDataToRenderInScreen.cardType;
			if(swipedDataToRenderInScreen.swipeFrom === "guestCard"){
				$scope.showAddtoGuestCard = false;
			} else {
				$scope.showAddtoGuestCard = true;
			}
	    };

		$scope.refreshIframe = function(){
			//in case of hotel with MLI iframe will not be present
			if(!!$("#sixIframe").length){
				$("#sixIframe").src = $("#sixIframe").src;
			}
		};

		$scope.$on('REFRESH_IFRAME', function(e){
			 $scope.refreshIframe();
		});
		//Not a good method
		//To fix the issue CICO-11440
		//From diary screen create reservation guest data is available only after reaching the summary ctrl
		//At that time iframe fname and lname is set as null or undefined since data not available
		//here refreshing the iframe with name of guest
		$scope.refreshIframeWithGuestData = function(guestData){
			var time = new Date().getTime();
			var firstName = guestData.fname;
			var lastName = guestData.lname;
			iFrameUrl = domainUrl + "/api/ipage/index.html?card_holder_first_name=" +firstName + "&card_holder_last_name=" + lastName + "&service_action=createtoken&time="+time;
			var iFrame = document.getElementById('sixIframe');
			iFrame.src = iFrameUrl;
		};
		$scope.$on("refreshIframe", function(e, guestData){
			$scope.refreshIframeWithGuestData(guestData);
		});
		var absoluteUrl = $location.$$absUrl;
		domainUrl = absoluteUrl.split("/staff#/")[0];
		$scope.cardData = {};
		$scope.cardData.addToGuestCard = false;
		$scope.cardData.cardNumber = "";
		$scope.cardData.CCV = "";
		$scope.cardData.expiryMonth ="";
		$scope.cardData.expiryYear = "";
		$scope.cardData.userName   = "";

		var time = new Date().getTime();
		$scope.shouldShowAddNewCard = true;
		if(typeof $scope.passData !==" undefined"){
			var firstName = (typeof $scope.passData.details.firstName ==="undefined")?"":$scope.passData.details.firstName;
			var lastName = (typeof $scope.passData.details.lastName ==="undefined")?"":$scope.passData.details.lastName;
		};

		$scope.iFrameUrl = domainUrl + "/api/ipage/index.html?card_holder_first_name=" +firstName + "&card_holder_last_name=" + lastName + "&service_action=createtoken&time="+time;
		if($rootScope.paymentGateway === "sixpayments"){
			$scope.shouldShowAddNewCard = false;
			var iFrame = $document.find("sixIframe");
			iFrame.attr("src", $scope.iFrameUrl);
			$scope.showAddtoGuestCard = false;
		} else {
			if(!$scope.isFromGuestCard){
				$scope.showAddtoGuestCard = true;
			}
		}
		if(!isEmptyObject($scope.passData.details.swipedDataToRenderInScreen)){
			$scope.renderDataFromSwipe($scope.passData.details.swipedDataToRenderInScreen);
		}
		$scope.shouldShowIframe = false;


		$scope.changeOnsiteCallIn = function(){
			$scope.shouldShowIframe = !$scope.shouldShowIframe;
			if(!$scope.isFromGuestCard){
				if($scope.shouldShowIframe){
					$scope.showAddtoGuestCard = true;
					$scope.refreshIframe();
				} else {
					$scope.showAddtoGuestCard = false;
				}
			}

		};
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
			$scope.$emit("TOKEN_CREATED", payementData);
			$scope.$digest();
			$scope.refreshIframe();
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
		$scope.getToken = function($event){
			$event.preventDefault();
			if(!isEmptyObject($scope.passData.details.swipedDataToRenderInScreen)){
				var swipeOperationObj = new SwipeOperation();
				var swipedCardDataToSave = swipeOperationObj.createSWipedDataToSave($scope.passData.details.swipedDataToRenderInScreen);
				swipedCardDataToSave.addToGuestCard = $scope.cardData.addToGuestCard;
				$scope.$emit('SWIPED_DATA_TO_SAVE', swipedCardDataToSave);
			} else {
				var sessionDetails = setUpSessionDetails();
				var successCallBack = function(response){
					response.isSixPayment = false;
					notifyParent(response);
				};
				var failureCallback = function(errorMessage){
					notifyParentError(errorMessage);
				};
				$scope.fetchMLI (sessionDetails,successCallBack,failureCallback);
			}
			//Base Ctrl function
		};

		/*
		 * Function to recieve six payment token on click 'Add' button in form
		 */

		$scope.$on('six_token_recived',function(e,data){
			data.six_payment_data.isSixPayment = true;
			$scope.shouldShowAddNewCard = false;
			notifyParent(data.six_payment_data);
		});



		$scope.setCreditCardFromList = function(index){
			$scope.$emit('cardSelected',{'index':index});
			$scope.cardselectedIndex = index;
		};

	    $scope.cancelCardSelection = function(){
	    	if(!$rootScope.isStandAlone){
	    		ngDialog.close();
	    	}
	    	else{
	    		$scope.$emit('cancelCardSelection');
	    		$scope.cardselectedIndex = -1;
	    		$scope.refreshIframe();
	    	};
	    };

	    $scope.$on("RENDER_SWIPED_DATA", function(e, swipedCardDataToRender){

			$scope.renderDataFromSwipe(swipedCardDataToRender);
			$scope.passData.details.swipedDataToRenderInScreen = swipedCardDataToRender;
		});



}]);