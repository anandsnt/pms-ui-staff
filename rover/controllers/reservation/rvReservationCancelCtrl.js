sntRover.controller('RVCancelReservation', ['$rootScope', '$scope', '$stateParams', 'RVPaymentSrv', '$timeout', 'RVReservationCardSrv', '$state', '$filter',
	function($rootScope, $scope, $stateParams, RVPaymentSrv, $timeout, RVReservationCardSrv, $state, $filter) {

		BaseCtrl.call(this, $scope);
		$scope.errorMessage = '';
		$scope.showCancelCardSelection =true;
		$scope.showAddtoGuestCard = true;
		$scope.addmode = false;
		$scope.showCC = false;
		$scope.referanceText = "";
		$scope.isDisplayReference = false;

		$scope.cancellationData = {
			selectedCard: -1,
			reason: "",
			viewCardsList: false,
			existingCard: false,
			cardId: "",
			cardNumber:"",
			expiry_date:"",
			card_type:""
		};
		
		if($scope.ngDialogData.penalty > 0){
			$scope.$emit("UPDATE_CANCEL_RESERVATION_PENALTY_FLAG", true);
		}

		$scope.setScroller('cardsList');

		var checkReferencetextAvailableForCC = function(){
			angular.forEach($scope.passData.details.creditCardTypes, function(value, key) {
				if($scope.cancellationData.card_type.toUpperCase() === value.cardcode){
					$scope.isDisplayReference = (value.is_display_reference)? true:false;
				};					
			});				
		};

		$scope.feeData = {};
		var zeroAmount = parseFloat("0.00");

		// CICO-9457 : To calculate fee - for standalone only
		$scope.calculateFee = function() {

			if ($scope.isStandAlone) {
				var feesInfo = $scope.feeData.feesInfo;
				var amountSymbol = "";
				if (typeof feesInfo != 'undefined' && feesInfo != null) amountSymbol = feesInfo.amount_symbol;
				var totalAmount = ($scope.ngDialogData.penalty == "") ? zeroAmount :
					parseFloat($scope.ngDialogData.penalty);
				var feePercent = parseFloat($scope.feeData.actualFees);

				if (amountSymbol == "percent") {
					var calculatedFee = parseFloat(totalAmount * (feePercent / 100));
					$scope.feeData.calculatedFee = parseFloat(calculatedFee).toFixed(2);
					$scope.feeData.totalOfValueAndFee = parseFloat(calculatedFee + totalAmount).toFixed(2);
				} else {
					$scope.feeData.totalOfValueAndFee = parseFloat(totalAmount + feePercent).toFixed(2);
				}
			}
		};

		// CICO-9457 : Data for fees details.
		$scope.setupFeeData = function(){
			
			var feesInfo = $scope.feeData.feesInfo ? $scope.feeData.feesInfo : {};
			var defaultAmount = $scope.ngDialogData ?
			 	parseFloat($scope.ngDialogData.penalty) : zeroAmount;
			
			if(typeof feesInfo.amount != 'undefined' && feesInfo!= null){
				
				var amountSymbol = feesInfo.amount_symbol;
				var feesAmount = feesInfo.amount ? parseFloat(feesInfo.amount) : zeroAmount;
				$scope.feeData.actualFees = feesAmount;
				
				if(amountSymbol == "percent") $scope.calculateFee();
				else{
					$scope.feeData.calculatedFee = parseFloat(feesAmount).toFixed(2);
					$scope.feeData.totalOfValueAndFee = parseFloat(feesAmount + defaultAmount).toFixed(2);
				}
			}
		};

		var refreshCardsList = function() {
			$timeout(function() {
				$scope.refreshScroller('cardsList');
			}, 300);
		};

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
						'':$scope.newPaymentInfo.cardDetails.userName;
			return cardName;
		};


		var savePayment = function() {

			var expiryMonth = $scope.newPaymentInfo.tokenDetails.isSixPayment ? $scope.newPaymentInfo.tokenDetails.expiry.substring(2, 4) :$scope.newPaymentInfo.cardDetails.expiryMonth;
			var expiryYear  = $scope.newPaymentInfo.tokenDetails.isSixPayment ? $scope.newPaymentInfo.tokenDetails.expiry.substring(0, 2) :$scope.newPaymentInfo.cardDetails.expiryYear;
			var cardExpiry  = (expiryMonth && expiryYear )? ("20"+expiryYear+"-"+expiryMonth+"-01"):"";

			var cardToken = !$scope.newPaymentInfo.tokenDetails.isSixPayment ? $scope.newPaymentInfo.tokenDetails.session:$scope.newPaymentInfo.tokenDetails.token_no;	
			var onSaveSuccess = function(data) {
				$scope.$emit('hideLoader');
				$scope.cancellationData.selectedCard = data.id;
				$scope.cancellationData.cardNumber = retrieveCardNumber();
				$scope.cancellationData.expiry_date = retrieveExpiryDate();
				$scope.cancellationData.card_type = retrieveCardtype();
				checkReferencetextAvailableForCC();
				$scope.showCC = false;
			};
			var paymentData = {
				add_to_guest_card: $scope.newPaymentInfo.cardDetails.addToGuestCard,
				name_on_card: retrieveName(),
				payment_type: "CC",
				reservation_id: $scope.reservationData.reservation_card.reservation_id,
				token: cardToken,
				card_expiry: cardExpiry
			};
			if($scope.isStandAlone){
				if($scope.feeData.calculatedFee)
					paymentData.fees_amount = $scope.feeData.calculatedFee;
				if($scope.feeData.feesInfo)
					paymentData.fees_charge_code_id = $scope.feeData.feesInfo.charge_code_id;
			}
			$scope.invokeApi(RVPaymentSrv.savePaymentDetails, paymentData, onSaveSuccess);
		};

		var onFetchPaymentsSuccess = function(data) {
			$scope.$emit('hideLoader');
			$scope.cardsInPaymentMethods = _.where(data.existing_payments, {
				is_credit_card: true
			});
			$scope.cardsInPaymentMethods.forEach(function(card) {
					   card.mli_token = card.ending_with;
					   delete card.ending_with;    
					   card.card_expiry = card.expiry_date;
					   delete card.expiry_date; 
			});
			if ($scope.cardsInPaymentMethods.length > 0) {
				$scope.ngDialogData.cards = true;
				//$scope.cancellationData.viewCardsList = true;
				$scope.cardsList = $scope.cardsInPaymentMethods;
				refreshCardsList();
			}
			$scope.ngDialogData.state = 'PENALTY';
		};

		$scope.applyPenalty = function() {
			var reservationId = $stateParams.id;
			$scope.ngDialogData.applyPenalty = true;
			$scope.showCC = true;
			$scope.invokeApi(RVPaymentSrv.getPaymentList, reservationId, onFetchPaymentsSuccess);
		};

		$scope.cancelReservation = function() {
			var onCancelSuccess = function(data) {
				$state.go('rover.reservation.staycard.reservationcard.reservationdetails', {
					"id": $scope.reservationData.reservationId || $scope.reservationParentData.reservationId,
					"confirmationId": $scope.reservationData.confirmNum ||  $scope.reservationParentData.confirmNum,
					"isrefresh": false
				});
				$scope.closeReservationCancelModal();
				$scope.$emit('hideLoader');
			};
			var onCancelFailure = function(data) {
				$scope.$emit('hideLoader');
				$scope.errorMessage = data;
			};
			var cancellationParameters = {
				reason: $scope.cancellationData.reason,
				payment_method_id: parseInt($scope.cancellationData.selectedCard) == -1 ? null : parseInt($scope.cancellationData.selectedCard),
				id: $scope.reservationData.reservationId || $scope.reservationParentData.reservationId
			};
			if($scope.ngDialogData.isDisplayReference){
				cancellationParameters.reference_text = $scope.referanceText;
			};
			$scope.invokeApi(RVReservationCardSrv.cancelReservation, cancellationParameters, onCancelSuccess, onCancelFailure);
		};

	$scope.onCardClick = function(){
		$scope.showCC = true;
		$scope.addmode = false;
	};
	var setCreditCardFromList = function(index){
		$scope.cancellationData.selectedCard = $scope.cardsList[index].value;
		$scope.cancellationData.cardNumber = $scope.cardsList[index].mli_token;
		$scope.cancellationData.expiry_date = $scope.cardsList[index].card_expiry;
		$scope.cancellationData.card_type = $scope.cardsList[index].card_code;
		checkReferencetextAvailableForCC();
		$scope.showCC = false;
		// CICO-9457 : Data for fees details - standalone only.	
		if($scope.isStandAlone)	{
			console.log("clicked cc");
			console.log($scope.cardsList[index]);
			$scope.feeData.feesInfo = $scope.cardsList[index].fees_information;
			$scope.setupFeeData();
		}
	};

	$scope.$on("TOKEN_CREATED", function(e,data){
		$scope.newPaymentInfo = data;
		savePayment();
	});

	$scope.$on("MLI_ERROR", function(e,data){
		$scope.errorMessage = data;
	});

	$scope.$on('cancelCardSelection',function(e,data){
		$scope.ngDialogData.state = 'CONFIRM';
	});
	$scope.$on('cardSelected',function(e,data){
		setCreditCardFromList(data.index);
	});
	
	$scope.$on("SHOW_SWIPED_DATA_ON_CANCEL_RESERVATION_PENALTY_SCREEN", function(e, swipedCardDataToRender){

		$scope.$broadcast("RENDER_SWIPED_DATA", swipedCardDataToRender);
		$scope.ngDialogData.state = 'PENALTY';
		$scope.showCC = true;
		$scope.addmode = true;

	});
	
	var successSwipePayment = function(data, successParams){
				$scope.$emit('hideLoader');
				$scope.cancellationData.selectedCard = data.id;
				$scope.cancellationData.cardNumber = successParams.cardNumber.slice(-4);;
				$scope.cancellationData.expiry_date = successParams.cardExpiryMonth+"/"+successParams.cardExpiryYear;
				$scope.cancellationData.card_type = successParams.cardType.toLowerCase();
				$scope.showCC = false;
	};
	$scope.$on("SWIPED_DATA_TO_SAVE", function(e, swipedCardDataToSave){
		var data 				 = swipedCardDataToSave;
		data.reservation_id 	 = $scope.reservationData.reservation_card.reservation_id;
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
	$scope.closeReservationCancelModal = function(){
		$scope.$emit("UPDATE_CANCEL_RESERVATION_PENALTY_FLAG", false);
		$scope.closeDialog();
	};

}]);
