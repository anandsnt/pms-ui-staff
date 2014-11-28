sntRover.controller('RVCancelReservation', ['$rootScope', '$scope', '$stateParams', 'RVPaymentSrv', '$timeout', 'RVReservationCardSrv', '$state', '$filter',
	function($rootScope, $scope, $stateParams, RVPaymentSrv, $timeout, RVReservationCardSrv, $state, $filter) {

		BaseCtrl.call(this, $scope);
		$scope.errorMessage = '';
		$scope.showCancelCardSelection =true;
		$scope.showAddtoGuestCard = true;
		$scope.addmode = false;
		$scope.showCC = false;
		$scope.referanceText = "";

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

		$scope.setScroller('cardsList');

		$scope.feeData = {};
		
		// CICO-9457 : Data for fees details.
		$scope.setupFeeData = function(){
			
			var feesInfo = $scope.feeData.feeInfo;
			var zeroAmount = parseFloat("0.00").toFixed(2);
			var defaultAmount = $scope.ngDialogData.penalty ?
			 	$scope.ngDialogData.penalty : zeroAmount;
			console.log("feesInfo :");console.log(feesInfo);
			if(typeof feesInfo != 'undefined' && feesInfo!= null){
				
				var amountSymbol = feesInfo.amount_symbol;
				var feesAmount = feesInfo.amount ? parseFloat(feesInfo.amount).toFixed(2) : zeroAmount;
				$scope.feeData.actualFees = feesAmount;
				
				if(amountSymbol == "%") $scope.calculateFee();
				else{
					$scope.feeData.calculatedFee = feesAmount;
					$scope.feeData.totalOfValueAndFee = parseFloat(parseFloat(feesAmount) + parseFloat(defaultAmount)).toFixed(2);
				}
			}
			else{
				$scope.feeData.actualFees = zeroAmount;
				$scope.feeData.calculatedFee = zeroAmount;
				$scope.feeData.totalOfValueAndFee = zeroAmount;
			}
		}
		

		var refreshCardsList = function() {
			$timeout(function() {
				$scope.refreshScroller('cardsList');
			}, 300)
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
				$scope.showCC = false;
			};
			var paymentData = {
				add_to_guest_card: $scope.newPaymentInfo.cardDetails.addToGuestCard,
				name_on_card: retrieveName(),
				payment_type: "CC",
				reservation_id: $scope.reservationData.reservation_card.reservation_id,
				token: cardToken,
				card_expiry: cardExpiry
			}
			if($scope.isStandAlone){
				if($scope.feeData.calculatedFee)
					paymentData.fees_amount = $scope.feeData.calculatedFee;
				if($scope.feeData.feesInfo)
					paymentData.fees_charge_code_id = $scope.feeData.feeInfo.charge_code_id;
			}
			console.log(paymentData);
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
				$scope.closeDialog();
				$scope.$emit('hideLoader');
			}
			var onCancelFailure = function(data) {
				$scope.$emit('hideLoader');
				$scope.errorMessage = data;
			}
			var cancellationParameters = {
				reason: $scope.cancellationData.reason,
				payment_method_id: parseInt($scope.cancellationData.selectedCard) == -1 ? null : parseInt($scope.cancellationData.selectedCard),
				id: $scope.reservationData.reservationId || $scope.reservationParentData.reservationId
			}
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
		$scope.showCC = false;
		console.log("card clicked from cancel reservation");
		
		// CICO-9457 : Data for fees details - standalone only.	
		if($scope.isStandAlone)	{
			$scope.feeData.feeInfo = $scope.cardsList[index].fees_information;
			$scope.setupFeeData();
		}
	};

	$scope.$on("TOKEN_CREATED", function(e,data){
		console.log(data);
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

	}

]);