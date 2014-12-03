sntRover.controller('RVReservationDepositController', ['$rootScope', '$scope', '$stateParams', 'RVPaymentSrv', '$timeout', 'RVReservationCardSrv', '$state', '$filter',
	function($rootScope, $scope, $stateParams, RVPaymentSrv, $timeout, RVReservationCardSrv, $state, $filter) {

		BaseCtrl.call(this, $scope);
		$scope.errorMessage = '';
		$scope.showCancelCardSelection =true;
		$scope.addmode = false;
		$scope.referanceText = "";
		$scope.paymentMode = false;
		$scope.showAddtoGuestCard = true;
		$scope.cardSelected = false;
		$scope.isDisplayReference = false;
		$scope.depositInProcess = false;
		$scope.errorOccured = false;
		$scope.errorMessage = "";
		$scope.successOccured = false;
		$scope.successMessage = "";
		$scope.authorizedCode = "";
		
		$scope.$emit("UPDATE_STAY_CARD_DEPOSIT_FLAG", true);
		
		$scope.depositData = {
			selectedCard: -1,
			amount: "",
			viewCardsList: false,
			existingCard: false,
			cardId: "",
			cardNumber:"",
			expiry_date:"",
			card_type:"",
			isDisplayReference:false,
			referanceText:""
		};
		$scope.reservationData = {};
		$scope.reservationData.depositAmount = "";
		$scope.depositPolicyName = "";
		$scope.reservationData.referanceText = "";
		

		$scope.setScroller('cardsList');		
		var refreshCardsList = function() {
			$timeout(function() {
				$scope.refreshScroller('cardsList');
			}, 300);
		};

		/*
		 * card details based on six payment/MLI           
		 *													
		 */

		var retrieveCardtype = function(){
			var cardType = $scope.newPaymentInfo.tokenDetails.isSixPayment?
			getSixCreditCardType($scope.newPaymentInfo.tokenDetails.card_type).toLowerCase():
			getCreditCardType($scope.newPaymentInfo.tokenDetails.cardBrand).toLowerCase()
			;
			return cardType;
		};

		var retrieveCardNumber = function(){
			var cardNumber = $scope.newPaymentInfo.tokenDetails.isSixPayment?
			$scope.newPaymentInfo.tokenDetails.token_no.substr($scope.newPaymentInfo.tokenDetails.token_no.length - 4):
			$scope.newPaymentInfo.cardDetails.cardNumber.slice(-4);
			return cardNumber;
		};

		var retrieveExpiryDate = function(){
			var expiryMonth =  $scope.newPaymentInfo.tokenDetails.isSixPayment ? $scope.newPaymentInfo.tokenDetails.expiry.substring(2, 4) :$scope.newPaymentInfo.cardDetails.expiryMonth;
			var expiryYear  =  $scope.newPaymentInfo.tokenDetails.isSixPayment ? $scope.newPaymentInfo.tokenDetails.expiry.substring(0, 2) :$scope.newPaymentInfo.cardDetails.expiryYear;
			var expiryDate = expiryMonth+" / "+expiryYear;
			return expiryDate;
		};

		var retrieveName = function(){
			var cardName = $scope.newPaymentInfo.tokenDetails.isSixPayment?
						($scope.passData.details.firstName+" "+$scope.passData.details.lastName
						):$scope.newPaymentInfo.cardDetails.userName;
			return cardName;
		};

		$scope.feeData = {};
		var zeroAmount = parseFloat("0.00").toFixed(2);

		// CICO-6068 : To calculate fee
		$scope.calculateFee = function(){
			if($scope.isStandAlone){
				
				var feesInfo = $scope.feeData.feesInfo;
				var amountSymbol = "";
				if(typeof feesInfo != 'undefined' && feesInfo!= null) amountSymbol = feesInfo.amount_symbol;

				var totalAmount = ($scope.reservationData.depositAmount == "") ? zeroAmount :
								parseFloat($scope.reservationData.depositAmount);
				var feePercent  = parseFloat($scope.feeData.actualFees);

				if(amountSymbol == "percent"){
					var calculatedFee = parseFloat(totalAmount * (feePercent/100));
					$scope.feeData.calculatedFee = parseFloat(calculatedFee).toFixed(2);
					$scope.feeData.totalOfValueAndFee = parseFloat(calculatedFee + totalAmount).toFixed(2);
				}
				else{
					$scope.feeData.totalOfValueAndFee = parseFloat(totalAmount + feePercent).toFixed(2);
				}
			}
		};

		// CICO-6068 : Data for fees details.
		$scope.setupFeeData = function(){
			
			var feesInfo = $scope.feeData.feesInfo ? $scope.feeData.feesInfo : {};
			var defaultAmount = $scope.reservationData ?
			 	$scope.reservationData.depositAmount : zeroAmount;
			
			if(typeof feesInfo.amount != 'undefined' && feesInfo!= null){
				
				var amountSymbol = feesInfo.amount_symbol;
				var feesAmount = feesInfo.amount ? parseFloat(feesInfo.amount).toFixed(2) : zeroAmount;
				$scope.feeData.actualFees = feesAmount;
				
				if(amountSymbol == "percent") $scope.calculateFee();
				else{
					$scope.feeData.calculatedFee = feesAmount;
					$scope.feeData.totalOfValueAndFee = parseFloat(parseFloat(feesAmount) + parseFloat(defaultAmount)).toFixed(2);
				}
			}
		};
		
		if($scope.isStandAlone) {
			$scope.feeData.feesInfo = $scope.passData.fees_information;
			$scope.setupFeeData();
		}

		/*
		 * check if reference text is available for the selected card type           
		 *													
		 */
		$scope.checkReferencetextAvailable = function(){
			angular.forEach($scope.passData.details.creditCardTypes, function(value, key) {
				if($scope.depositData.card_type.toUpperCase() === value.cardcode){
					$scope.isDisplayReference = (value.is_display_reference)? true:false;
				};					
			});	
			return $scope.isDisplayReference;
		};

		/*
		 * set selected card if any card is selected          
		 *													
		 */
	    var setSelectedCreditCard = function(cardValue){

			var attached_card = $scope.depositDetails.attached_card;
			$scope.depositData.selectedCard = attached_card.value;
			$scope.depositData.cardNumber = attached_card.ending_with;
			$scope.depositData.expiry_date = attached_card.expiry_date;
			$scope.depositData.card_type = attached_card.card_code;
			$scope.cardSelected = true;

			if($scope.isStandAlone) {
				$scope.feeData.feesInfo = attached_card.fees_information;
				$scope.setupFeeData();
			}
		};

		$scope.depositPolicyName = $scope.depositDetails.deposit_policy.description;
		$scope.reservationData.depositAmount =  parseInt($scope.depositDetails.deposit_amount);
		
	
		var savePayment = function() {

			var expiryMonth = $scope.newPaymentInfo.tokenDetails.isSixPayment ? $scope.newPaymentInfo.tokenDetails.expiry.substring(2, 4) :$scope.newPaymentInfo.cardDetails.expiryMonth;
			var expiryYear  = $scope.newPaymentInfo.tokenDetails.isSixPayment ? $scope.newPaymentInfo.tokenDetails.expiry.substring(0, 2) :$scope.newPaymentInfo.cardDetails.expiryYear;
			var cardExpiry  = (expiryMonth && expiryYear )? ("20"+expiryYear+"-"+expiryMonth+"-01"):"";
			var cardToken = !$scope.newPaymentInfo.tokenDetails.isSixPayment ? $scope.newPaymentInfo.tokenDetails.session:$scope.newPaymentInfo.tokenDetails.token_no;	
			
			var onSaveSuccess = function(data) {
				$scope.$emit('hideLoader');
				$scope.depositData.selectedCard = data.id;
				$scope.depositData.cardNumber = retrieveCardNumber();
				$scope.depositData.expiry_date = retrieveExpiryDate();
				$scope.depositData.card_type = retrieveCardtype();
				$scope.paymentMode = false;
				$scope.cardSelected = true;

				if($scope.isStandAlone) {
					$scope.feeData.feesInfo = data.fees_information;
					$scope.setupFeeData();
				}
			};
			
			var paymentData = {
				add_to_guest_card: $scope.newPaymentInfo.cardDetails.addToGuestCard,
				name_on_card: retrieveName(),
				payment_type: "CC",
				reservation_id: $scope.passData.reservationId,
				token: cardToken,
				card_expiry: cardExpiry
			};
			if($scope.isStandAlone){
				if($scope.feeData.calculatedFee)
					paymentData.fees_amount = $scope.feeData.calculatedFee;
				if($scope.feeData.feesInfo)
					paymentData.fees_charge_code_id = $scope.feeData.feesInfo.charge_code_id;
			}
			if($scope.depositData.isDisplayReference){
				paymentData.referance_text = $scope.depositData.referanceText;
			};

			$scope.invokeApi(RVPaymentSrv.savePaymentDetails, paymentData, onSaveSuccess);
		};
		/*
		 * fetch reservation's cards list          
		 *													
		 */

		var onFetchPaymentsSuccess = function(data) {
			$scope.$emit('hideLoader');
			$scope.cardsList = _.where(data.existing_payments, {
				is_credit_card: true
			});
			$scope.cardsList.forEach(function(card) {
					   card.mli_token = card.ending_with;
					   delete card.ending_with;    
					   card.card_expiry = card.expiry_date;
					   delete card.expiry_date; 
			});
			if ($scope.cardsList.length > 0) {
				$scope.addmode = false;
				refreshCardsList();
			};
			if((typeof $scope.depositDetails.attached_card !== "undefined") && $scope.depositDetails.attached_card.value !=="" && $scope.depositDetails.attached_card.is_credit_card){
				setSelectedCreditCard($scope.depositDetails.attached_card.value);
			};
			
		};

	var reservationId = $stateParams.id;
	$scope.invokeApi(RVPaymentSrv.getPaymentList, reservationId, onFetchPaymentsSuccess);

	var successPayment = function(data){
		$scope.$emit('hideLoader');
		$scope.successMessage = "Deposit paid";	
		$scope.authorizedCode = data.authorization_code;
		$scope.errorOccured = false;
		$scope.successOccured = true;
		$scope.isLoading =  false;
	};

	var paymentFailed = function(data){
		$scope.$emit('hideLoader');
		$scope.errorMessage = data;
		$scope.errorOccured = true;
		$scope.successOccured = false;
		$scope.isLoading =  false; 

	};


	  /*
	* Action - On click submit payment button
	*/
	$scope.submitPayment = function(){

		if($scope.reservationData.depositAmount == '' || $scope.reservationData.depositAmount == null){
			$scope.errorMessage = ["Please enter amount"];
		} else {
			$scope.errorMessage = "";
			$scope.depositInProcess = true;	
			var dataToSrv = {
				"postData": {
					"bill_number": 1,
					"payment_type": "CC",
					"amount": $scope.reservationData.depositAmount,
					"payment_type_id":$scope.depositData.selectedCard
				},
				"reservation_id": $stateParams.id
			};

			if($scope.isDisplayReference){
				dataToSrv.postData.reference_text = $scope.reservationData.referanceText;
			};
			$scope.isLoading =  true;
			$scope.invokeApi(RVPaymentSrv.submitPaymentOnBill, dataToSrv,successPayment,paymentFailed);
		};
	};

	
	$scope.payDeposit = function() {

		if($scope.depositData.selectedCard !== -1){
			$scope.submitPayment();
		}
		else{
			$scope.paymentMode = true;
			refreshCardsList();
		};
	};	

	$scope.onCardClick = function(){
		$scope.paymentMode = true;
		$scope.addmode = false;
		refreshCardsList();
	};

	var setCreditCardFromList = function(index){
		$scope.depositData.selectedCard = $scope.cardsList[index].value;
		$scope.depositData.cardNumber = $scope.cardsList[index].mli_token;
		$scope.depositData.expiry_date = $scope.cardsList[index].card_expiry;
		$scope.depositData.card_type = $scope.cardsList[index].card_code;
		$scope.paymentMode = false;
		$scope.cardSelected = true;
	};

	$scope.$on("TOKEN_CREATED", function(e,data){
		$scope.newPaymentInfo = data;
		savePayment();
	});

	$scope.$on("MLI_ERROR", function(e,data){
		$scope.errorMessage = data;
		setTimeout(function(){ 
			$scope.errorMessage ="";
			 $scope.$digest();
		}, 4000);
	});

	$scope.$on('cancelCardSelection',function(e,data){
		$scope.paymentMode = false;
	});
	$scope.$on('cardSelected',function(e,data){
		setCreditCardFromList(data.index);
	});
	
	$scope.$on("SHOW_SWIPED_DATA_ON_STAY_CARD_DEPOSIT_SCREEN", function(e, swipedCardDataToRender){
		$scope.paymentMode = true;
		$scope.addmode = true;
		$scope.$broadcast("RENDER_SWIPED_DATA", swipedCardDataToRender);
	});
	$scope.$on("SWIPED_DATA_TO_SAVE", function(e, swipedCardDataToSave){
		var data 				 = swipedCardDataToSave;
		data.reservation_id 	 = $scope.passData.reservationId;
		data.payment_credit_type = swipedCardDataToSave.cardType;
		data.credit_card 		 = swipedCardDataToSave.cardType;
		data.card_expiry 		 = "20"+swipedCardDataToSave.cardExpiryYear+"-"+swipedCardDataToSave.cardExpiryMonth+"-01";
		data.add_to_guest_card   = swipedCardDataToSave.addToGuestCard;
		
		
		var options = {
	    		params: 			data,
	    		successCallBack: 	successSwipePayment,	 
	    		successCallBackParameters:  swipedCardDataToSave 	
	    };
	    $scope.callAPI(RVPaymentSrv.savePaymentDetails, options);
	 });
	 var successSwipePayment = function(data, successParams){
				$scope.$emit('hideLoader');
				$scope.depositData.selectedCard = data.id;
				$scope.depositData.cardNumber = successParams.cardNumber.slice(-4);;
				$scope.depositData.expiry_date = successParams.cardExpiryMonth+"/"+successParams.cardExpiryYear;
				$scope.depositData.card_type = successParams.cardType.toLowerCase();
				$scope.paymentMode = false;
				$scope.cardSelected = true;
	};

}]);