sntPay.controller('sntPaymentController', ["$scope", "sntPaymentSrv", "$location", "PAYMENT_CONFIG",
	function($scope, sntPaymentSrv, $location, PAYMENT_CONFIG) {

	$scope.payment = {
		referenceText: "",
		amount: 0,
		isRateSuppressed: false,
		isEditable: false,
		addToGuestCard: false,
		billNumber: 1,
		linkedCreditCards: [],
		isManualCcEntryEnabled: true,
		MLImerchantId: '',
		creditCardTypes: [],
		showAddToGuestCard: false,
		addToGuestCardSelected: false,
		guestFirstName: '',
		guestLastName: '',
		isManualEntryInsideIFrame: false,
		workstationId: '',
		emvTimeout: 120
	};


	//hide payment method if there is no permission or no payment type
	$scope.shouldHidePaymentButton = function() {
		return !$scope.selectedPaymentType || !$scope.hasPermission;
	};

	//show the selected card
	$scope.showSelectedCard = function() {
		var isCCPresent = ($scope.selectedPaymentType === "CC" &&
			(!!$scope.selectedCC.ending_with && $scope.selectedCC.ending_with.length > 0));
		var isManualEntry = !!PAYMENT_CONFIG[$scope.paymentGateway].iFrameUrl &&
			$scope.payment.isManualEntryInsideIFrame;

		return (isCCPresent && $scope.payment.screenMode === "PAYMENT_MODE" &&
			(isManualEntry || $scope.paymentGateway !== 'sixpayments'));
	};

	//show add to guest card checkbox to add the card to the guestcard
	var showAddtoGuestCardBox = function() {
		//this need to be set to true only if new card is added
		$scope.payment.showAddToGuestCard = true;
	};

	//change screen mode to collect CC info
	var changeToCardAddMode = function() {
		$scope.payment.screenMode = "CARD_ADD_MODE";
		$scope.payment.addCCMode = existingCardsPresent() ? "EXISTING_CARDS" : "ADD_CARD";
		//TODO:handle Scroll
		//$scope.refreshScroller('cardsList');
	};

	//we need to refresh iframe each time,
	// as we don't have direct control over the fields on it
	var	refreshIFrame = function() {
		//in case of hotel with MLI iframe will not be present
		if ($scope.paymentGateway === 'sixpayments' && !!$("#sixIframe").length) {
			var iFrame = document.getElementById('sixIframe');
			iFrame.src = iFrame.src;
		}
	};

	//toggle between manual card entry and six payment swipe (C&P option in UI) for sixpayments
	$scope.sixPayEntryOptionChanged = function() {
		if ($scope.payment.isManualEntryInsideIFrame) {
			$scope.payment.isManualEntryInsideIFrame = false;
			$scope.selectedCC = {};
		} else {
			$scope.payment.isManualEntryInsideIFrame = true;
			changeToCardAddMode();
		}
	};

	//toggle between CC entry and existing card selection
	$scope.toggleCCMOde = function(mode) {
		$scope.payment.addCCMode = mode;
		mode === 'ADD_CARD' ? refreshIFrame() : '';
	};

	/********************* Payment Actions *****************************/

	$scope.closeThePopup = function() {
		$scope.$emit('CLOSE_DIALOG');
	};

	$scope.payLater = function() {
		$scope.$emit('PAY_LATER');
	};

	$scope.submitPayment = function() {
		if ($scope.payment.amount === '' || $scope.payment.amount === null) {
			var errorMessage = ["Please enter amount"];
			$scope.$emit('ERROR_OCCURED', errorMessage);
		} else {
			//set up params for API
			var params = {
				"postData": {
					"bill_number": $scope.payment.billNumber,
					"payment_type": $scope.selectedPaymentType,
					"amount": $scope.payment.amount
				},
				"reservation_id": $scope.reservationId
			};
			if ($scope.payment.showAddToGuestCard) {
				//check if add to guest card was selected
				params.postData.add_to_guest_card = $scope.payment.addToGuestCardSelected;
			};

			if ($scope.feeData.showFee) {
				//if fee was calculated wrt to payment type
				params.postData.fees_amount = $scope.feeData.calculatedFee;
				params.postData.fees_charge_code_id = $scope.feeData.feeChargeCode;
			}

			if ($scope.isDisplayRef) {
				//if reference text is presernt for the payment type
				params.postData.reference_text = $scope.payment.referenceText;
			}


			//check if chip and pin is selected in case of six payments
			//the rest of actions will in paySixPayController
			if ($scope.paymentGateway === 'sixpayments' && !$scope.payment.isManualEntryInsideIFrame) {
				$scope.$broadcast('INITIATE_CHIP_AND_PIN_PAYMENT', params);
			} else {

				//for CC payments, we need payment type id
				var paymentTypeId = null;

				if ($scope.selectedPaymentType === 'CC' && $scope.selectedCard !== -1) {
					paymentTypeId = $scope.selectedCC.value;
				} else {
					paymentTypeId = null;
				}

				params.postData.payment_type_id = paymentTypeId;

				//we need to notify the parent controllers to show loader
				//as this is an external directive
				$scope.$emit('showLoader');

				sntPaymentSrv.submitPayment(params).then(function(response) {
						console.log("payment success" + $scope.payment.amount);
						response.amountPaid = $scope.payment.amount;
						response.authorizationCode = response.authorization_code;
						// NOTE: The feePaid key and value would be sent IFF a fee was applied along with the payment
						if ($scope.feeData) {
							response.feePaid = $scope.feeData.calculatedFee;
						}

						if($scope.selectedPaymentType === "CC"){
							response.cc_details = angular.copy($scope.selectedCC);
						}

						$scope.$emit('PAYMENT_SUCCESS', response);
						$scope.$emit('hideLoader');
					},
					function(errorMessage) {
						console.log("payment failed" + errorMessage);
						$scope.$emit('PAYMENT_FAILED', errorMessage);
						$scope.$emit('hideLoader');
					});
			}

		}
	};

	//check if there are existing cards to be shown in list
	var existingCardsPresent = function() {
		return $scope.payment.linkedCreditCards.length > 0;
	};

	// Payment type change action
	$scope.onPaymentInfoChange = function() {
		//NOTE: Fees information is to be calculated only for standalone systems
		//TODO: GC Seperately Here
		//TODO: See how to handle fee in case of C&P

		var selectedPaymentType = _.find($scope.paymentTypes, {
				name: $scope.selectedPaymentType
			}),
			feeInfo = selectedPaymentType && selectedPaymentType.charge_code && selectedPaymentType.charge_code.fees_information || {};

		// In case a credit card is selected; the fee information is to be that of the card
		if(selectedPaymentType.name === "CC" && $scope.selectedCC && $scope.selectedCC.card_code){
			feeInfo = $scope.selectedCC.fees_information;
		}

		var currFee = sntPaymentSrv.calculateFee($scope.payment.amount, feeInfo);

		$scope.isDisplayRef = selectedPaymentType && selectedPaymentType.is_display_reference;

		//If the changed payment type is CC and payment gateway is MLI show CC addition options
		//If there are attached cards, show them first
		if (selectedPaymentType.name === "CC") {
			if (!!PAYMENT_CONFIG[$scope.paymentGateway].iFrameUrl) {
				refreshIFrame();
			} else {
				changeToCardAddMode();
			}
		} else {
			$scope.payment.showAddToGuestCard = false;
		}

		$scope.feeData = {
			calculatedFee: currFee.calculatedFee,
			totalOfValueAndFee: currFee.totalOfValueAndFee,
			showFee: currFee.showFees,
			feeChargeCode: currFee.feeChargeCode
		};
	};

	$scope.onFeeOverride = function() {
		var totalAmount = parseFloat($scope.feeData.calculatedFee) + parseFloat($scope.payment.amount);
		$scope.feeData.totalOfValueAndFee = totalAmount.toFixed(2);
	};

	/**************** CC handling ********************/
	//if the selected card is clicked, go to card entry page
	$scope.onCardClick = function() {
		changeToCardAddMode();
		refreshIFrame();
	};
	//cancel CC entry and go to initial page
	$scope.cancelCardSelection = function() {
		$scope.payment.screenMode = "PAYMENT_MODE";
	};
	//choose among the existing cards
	$scope.setCreditCardFromList = function(selectedCardValue) {
		var selectedCard = _.find($scope.payment.linkedCreditCards, {
			value: selectedCardValue
		});
		$scope.selectedCC = selectedCard;
		//this need to be set to true only if new card is added
		$scope.payment.showAddToGuestCard = false;
		$scope.payment.screenMode = "PAYMENT_MODE";
	};
	//hide existing cards in some places like in guestcard add CC
	$scope.hideCardToggles = function() {
		return false; //need to handle later
	};
	//list the existing cards for the reservation
	var onFetchLinkedCreditCardListSuccess = function(data) {
		$scope.$emit('hideLoader');
		$scope.payment.linkedCreditCards = _.where(data.existing_payments, {
			is_credit_card: true
		});

		if ($scope.payment.linkedCreditCards.length > 0) {
			//TODO:handle Scroll
			//$scope.refreshScroller('cardsList');
		}
	};

	//if there is reservationID fetch the linked credit card items
	var fetchAttachedCreditCards = function() {
		if (!!$scope.reservationId) {
			$scope.$emit('showLoader');

			sntPaymentSrv.getLinkedCardList($scope.reservationId).then(function(response) {
					onFetchLinkedCreditCardListSuccess(response);
					$scope.$emit('hideLoader');
				},
				function(errorMessage) {
					$scope.$emit('PAYMENT_FAILED', errorMessage);
					$scope.$emit('hideLoader');
				});
		} else {
			$scope.payment.linkedCreditCards = [];
		}
	};
	//Extract the credit card types
	var getCrediCardTypesList = function() {
		//filter CC types from payment types
		var creditCardTypes = _.find($scope.paymentTypes, {
			name: 'CC'
		});
		return creditCardTypes.values;
	};

	//save CC
	var saveCCPayment = function(cardDetails) {
		var onSaveSuccess = function(response) {

			$scope.selectedCC.value = response.data.id;
			$scope.selectedCC.card_code = cardDetails.cardDisplayData.card_code;
			$scope.selectedCC.ending_with = cardDetails.cardDisplayData.ending_with;
			$scope.selectedCC.expiry_date = cardDetails.cardDisplayData.expiry_date;

			if ($scope.isStandAlone) {
				//TODO:calculate fee
				// $scope.feeData.feesInfo = data.fees_information;
				// $scope.setupFeeData();
			}

			$scope.payment.screenMode = "PAYMENT_MODE";
			showAddtoGuestCardBox();
		};

		var onSaveFailure = function(errorMessage) {
			$scope.errorMessage = errorMessage;
		};


		$scope.$emit('showLoader');
		sntPaymentSrv.savePaymentDetails(cardDetails.apiParams).then(function(response) {
				if (response.status == "success") {
					onSaveSuccess(response);
				} else {
					onSaveFailure(response.errors);
				}
				$scope.$emit('hideLoader');
			},
			function(errorMessage) {
				onSaveFailure(errorMessage);
				$scope.$emit('hideLoader');
			});
	};

	$scope.$on('CC_TOKEN_GENERATED', function(event, data) {
		saveCCPayment(data);
	});

	/****************** init ***********************************************/

	(function() {
		$scope.actionType = !!$scope.actionType ? $scope.actionType : 'DEFAULT';

		$scope.payment.amount = $scope.amount || 0;
		$scope.payment.isRateSuppressed = $scope.isRateSuppressed || false;
		$scope.payment.isEditable = $scope.isEditable || false;
		$scope.payment.billNumber = $scope.payment.billNumber || 1;
		$scope.payment.linkedCreditCards = $scope.linkedCreditCards || [];

		$scope.onPaymentInfoChange();

		$scope.payment.screenMode = "PAYMENT_MODE";
		$scope.payment.addCCMode = "ADD_CARD";
		$scope.payment.isManualCcEntryEnabled = $scope.isManualCcEntryEnabled || true;
		$scope.payment.MLImerchantId = $scope.mliMerchantId || "";
		$scope.payment.creditCardTypes = getCrediCardTypesList();
		$scope.payment.guestFirstName = $scope.firstName || '';
		$scope.payment.guestLastName = $scope.lastName || '';
		$scope.payment.workstationId = $scope.workstationId || '';
		$scope.payment.emvTimeout = $scope.emvTimeout || 120;

		fetchAttachedCreditCards();

		$scope.$emit('SET_SCROLL_FOR_EXISTING_CARDS');

		//check if card is present, if yes turn on flag
		if($scope.paymentGateway === 'sixpayments'){
			var isCCPresent = ($scope.selectedPaymentType === "CC" &&
			(!!$scope.selectedCC.ending_with && $scope.selectedCC.ending_with.length > 0));
			$scope.payment.isManualEntryInsideIFrame = true;
		}

		var paths = sntPaymentSrv.resolvePaths($scope.paymentGateway, {
			card_holder_first_name:$scope.payment.guestFirstName,
			card_holder_last_name: $scope.payment.guestLastName
		});

		$scope.payment.iFrameUrl = paths.iFrameUrl;
		$scope.paymentGatewayUIInterfaceUrl = paths.paymentGatewayUIInterfaceUrl;

	})();

}]);