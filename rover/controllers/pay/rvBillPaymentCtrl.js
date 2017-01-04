sntRover.controller('RVBillPayCtrl', ['$scope', 'RVBillPaymentSrv', 'RVPaymentSrv', 'RVGuestCardSrv', 'RVReservationCardSrv', 'ngDialog', '$rootScope', '$timeout', '$filter', function($scope, RVBillPaymentSrv, RVPaymentSrv, RVGuestCardSrv, RVReservationCardSrv, ngDialog, $rootScope, $timeout, $filter) {
	BaseCtrl.call(this, $scope);

	var setupbasicBillData = function() {
		$scope.renderData = {};
		$scope.saveData = {};
		$scope.errorMessage = '';
		$scope.saveData.payment_type_id = '';
		$scope.cardsList = [];
		$scope.newPaymentInfo = {};
		$scope.newPaymentInfo.addToGuestCard = false;
		$scope.renderData.billNumberSelected = '';
		$scope.renderData.defaultPaymentAmount = '';
		$scope.copyOfdefaultPaymentAmount = '';
		$scope.defaultRefundAmount = 0;
		// We are passing $scope from bill to this modal
		$scope.currentActiveBillNumber = parseInt($scope.currentActiveBill) + parseInt(1);
		$scope.renderData.billNumberSelected = $scope.currentActiveBillNumber;
		$scope.billsArray = $scope.reservationBillData.bills;
		// common payment model items
		$scope.passData = {};
		$scope.passData.details = {};
		$scope.passData.details.firstName = $scope.guestCardData.contactInfo.first_name;
		$scope.passData.details.lastName = $scope.guestCardData.contactInfo.last_name;
		$scope.setScroller('cardsList', {'click': true, 'tap': true});
		$scope.showCancelCardSelection = true;
		$scope.renderData.referanceText = "";
		$scope.swipedCardDataToSave  = {};
		$scope.cardData = {};
		$scope.newCardAdded = false;
		$scope.shouldShowWaiting = false;
		$scope.depositPaidSuccesFully = false;
		$scope.saveData.paymentType = '';
		$scope.defaultPaymentTypeOfBill = '';
		$scope.shouldShowMakePaymentButton = true;
		$scope.splitSelected = false;
		$scope.disableMakePaymentButton = false;
		$scope.splitBillEnabled = false;
	};

	var startingAmount = 0;

	var refreshCardsList = function() {
		$timeout(function() {
			$scope.refreshScroller('cardsList');
		}, 2000);
	};

	$scope.feeData = {};
	var zeroAmount = parseFloat("0.00");

	// CICO-11591 : To show or hide fees calculation details.
	$scope.isShowFees = function() {
		var isShowFees = false;
		var feesData = $scope.feeData;

		if (typeof feesData === 'undefined' || typeof feesData.feesInfo === 'undefined' || feesData.feesInfo === null) {
			isShowFees = false;
		}
		else if ((feesData.defaultAmount  >= feesData.minFees) && $scope.isStandAlone && feesData.feesInfo.amount) {
			if ($scope.renderData.defaultPaymentAmount >= 0) {
				isShowFees = (($rootScope.paymentGateway !== 'sixpayments' || $scope.isManual || $scope.saveData.paymentType !== 'CC') && $scope.saveData.paymentType !== "") ? true : false;
			}

		}
		return isShowFees;
	};

	$scope.handleCloseDialog = function() {
		$scope.reservationBillData.isCheckout = false;
		$scope.paymentModalOpened = false;
		$scope.$emit('HANDLE_MODAL_OPENED');
		$scope.closeDialog();
	};

	/**
	 * Listen to cancel event
     */
	$scope.$on("CLOSE_DIALOG", $scope.handleCloseDialog);

	/*
	* Show guest credit card list
	*/
	$scope.showGuestCreditCardList = function() {
		$scope.showCCPage = true;
		$scope.swippedCard = true;
		refreshCardsList();
	};

	$scope.changeOnsiteCallIn = function() {
		 $scope.isManual ? $scope.showGuestCreditCardList() : "";
		 refreshCardsList();
	};

	$scope.$on('changeOnsiteCallIn', function(event) {
		$scope.isManual =  !$scope.isManual;
		$scope.changeOnsiteCallIn();
	});

	/*
	* Success call back - for initial screen
	*/
	$scope.getPaymentListSuccess = function(data) {
		$scope.$emit('hideLoader');
		$scope.renderData.paymentTypes = data;
		$scope.renderData.billNumberSelected = $scope.currentActiveBillNumber;
		$scope.renderDefaultValues();
		$scope.creditCardTypes = [];

		angular.forEach($scope.renderData.paymentTypes, function(item, key) {
			if (item.name === 'CC') {
				$scope.creditCardTypes = item.values;
			}
		});
	};

	/*
	* Success call back for guest payment list screen
	*/
	$scope.cardsListSuccess = function(data) {
		$scope.$emit('hideLoader');
		if (data.length === 0) {
			$scope.cardsList = [];
		} else {
			$scope.cardsList = [];
			angular.forEach(data.existing_payments, function(obj, index) {
				if (obj.is_credit_card) {
		 		 	$scope.cardsList.push(obj);
				}
			});
			angular.forEach($scope.cardsList, function(value, key) {
				value.mli_token = value.ending_with; // For common payment HTML to work - Payment modifications story
				value.card_expiry = value.expiry_date;// Same comment above
				delete value.ending_with;
				delete value.expiry_date;
		    });

		    $scope.addmode = $scope.cardsList.length > 0 ? false : true;
			angular.forEach($scope.cardsList, function(value, key) {
				value.isSelected = false;
				if (!isEmptyObject($scope.billsArray[$scope.currentActiveBill].credit_card_details)) {
					if ($scope.billsArray[$scope.currentActiveBill].credit_card_details.payment_type && $scope.billsArray[$scope.currentActiveBill].credit_card_details.payment_type.toUpperCase() === "CC") {
						if (($scope.billsArray[$scope.currentActiveBill].credit_card_details.card_number === value.mli_token) &&
                                                        ($scope.billsArray[$scope.currentActiveBill].credit_card_details.card_code.toLowerCase() ===
                                                        value.card_code.toLowerCase() )) {
							value.isSelected = true;
						}
					}
				}

			});
			refreshCardsList();
		}
	};
        $scope.resetSplitPaymentDetailForGiftCard = function() {// split bill payments hidden for gift cards for now (cico-19009) per priya
		$scope.splitBillEnabled = false;
		$scope.splitePaymentDetail = {
			totalNoOfsplits: 1,
			completedSplitPayments: 0,
			totalAmount: 0,
			splitAmount: 0,
			carryAmount: 0
		};
		$scope.messageOfSuccessSplitPayment = '';
		$scope.paymentErrorMessage = '';
		// reset value
		if (!$scope.splitBillEnabled) {
			$scope.renderData.defaultPaymentAmount = angular.copy(startingAmount );
			$scope.splitSelected = false;
		}
	};
	$scope.resetSplitPaymentDetail = function() {
		$scope.splitBillEnabled = (typeof($scope.splitBillEnabled) === "undefined") ? false : !$scope.splitBillEnabled;
		$scope.splitePaymentDetail = {
			totalNoOfsplits: 1,
			completedSplitPayments: 0,
			totalAmount: 0,
			splitAmount: 0,
			carryAmount: 0
		};
		$scope.messageOfSuccessSplitPayment = '';
		$scope.paymentErrorMessage = '';
		// reset value
		if (!$scope.splitBillEnabled) {
			$scope.renderData.defaultPaymentAmount = angular.copy( $scope.copyOfdefaultPaymentAmount );
			$scope.splitSelected = false;
		}
	};
	/*
	* Initial function - To render screen with data
	* Initial screen - filled with deafult amount on bill
	* If any payment type attached to that bill then that credit card can be viewed in initial screen
	* Default payment method attached to that bill can be viewed in initial screen
	*/
	$scope.init = function() {

		$scope.resetSplitPaymentDetail();
		// CICO-12067 Handle the case when reservationId field is undefined.
		if (typeof $scope.reservationData.reservationId === 'undefined') {
			$scope.reservationData.reservationId = $scope.reservationData.reservation_id;
		}

		setupbasicBillData();

		$scope.referenceTextAvailable = false;
		$scope.showInitalPaymentScreen = true;
		// changes for CICO-13763
		var reservationData = { "reservation_id": $scope.reservationData.reservationId, "is_checkout": $scope.reservationBillData.isCheckout};
		var paymentParams = $scope.reservationBillData.isCheckout ? reservationData : {};
		
		/*
		 *	CICO-6089 => Enable Direct Bill payment option for OPEN BILLS.
		*/
		if ($scope.billsArray[$scope.currentActiveBill].credit_card_details.payment_type === "DB" && $scope.reservationBillData.reservation_status === "CHECKEDOUT") {
			paymentParams.direct_bill = true;
		}
		$scope.invokeApi(RVPaymentSrv.renderPaymentScreen, paymentParams, $scope.getPaymentListSuccess);

		$scope.invokeApi(RVPaymentSrv.getPaymentList, $scope.reservationData.reservationId, $scope.cardsListSuccess);
	};

	$scope.init();

	/*
	* Initial screen - filled with deafult amount on bill
	* If any payment type attached to that bill then that credit card can be viewed in initial screen
	* Default payment method attached to that bill can be viewed in initial screen
	*/
	$scope.renderDefaultValues = function() {
		var ccExist = false;

		if ($scope.renderData.paymentTypes.length > 0) {
			if (!isEmptyObject($scope.billsArray[$scope.currentActiveBill].credit_card_details)) {
				$scope.defaultPaymentTypeOfBill = $scope.billsArray[$scope.currentActiveBill].credit_card_details.payment_type.toUpperCase();
				$scope.saveData.payment_type_id = $scope.billsArray[$scope.currentActiveBill].credit_card_details.payment_id;
				angular.forEach($scope.renderData.paymentTypes, function(value, key) {
					if (value.name === "CC") {
						ccExist = true;
					}
				});
				$scope.saveData.paymentType = $scope.defaultPaymentTypeOfBill;
				if ($scope.defaultPaymentTypeOfBill === 'CC') {
					if (!ccExist) {
						$scope.saveData.paymentType = '';
					}
					$scope.isExistPaymentType = true;
					$scope.showCreditCardInfo = true;
					$scope.isfromBill = true;
					$scope.defaultPaymentTypeCard = $scope.billsArray[$scope.currentActiveBill].credit_card_details.card_code.toLowerCase();
					$scope.defaultPaymentTypeCardNumberEndingWith = $scope.billsArray[$scope.currentActiveBill].credit_card_details.card_number;
					$scope.defaultPaymentTypeCardExpiry = $scope.billsArray[$scope.currentActiveBill].credit_card_details.card_expiry;
					if ($rootScope.paymentGateway === "sixpayments") {
						$scope.isManual = true;
					}
				}
			}
		}

		var currentBillTotalFees = $scope.billsArray[$scope.currentActiveBill].total_fees;
		var defaultAmount = zeroAmount;

		if (currentBillTotalFees.length <= 0 ) {
			defaultAmount = zeroAmount;
		}
		else if (currentBillTotalFees[0].balance_amount === "SR") {
			defaultAmount = currentBillTotalFees[0].masked_balance_amount;
		}
		else {
			defaultAmount =  currentBillTotalFees[0].balance_amount;
		}

		$scope.renderData.defaultPaymentAmount = parseFloat(defaultAmount).toFixed(2);
		$scope.copyOfdefaultPaymentAmount      = parseFloat(defaultAmount).toFixed(2);
		$scope.splitePaymentDetail["totalAmount"] = parseFloat(defaultAmount).toFixed(2);
		$scope.defaultRefundAmount = (-1) * parseFloat($scope.renderData.defaultPaymentAmount);


		if ($scope.renderData.defaultPaymentAmount < 0 ) {
			$scope.shouldShowMakePaymentButton = false;
		}

		if ($scope.isStandAlone) {
			$scope.feeData.feesInfo = $scope.billsArray[$scope.currentActiveBill].credit_card_details.fees_information;
		}
	};

	/*
	* Action - On bill selection
	*/
	$scope.billNumberChanged = function() {
		$scope.currentActiveBill = parseInt($scope.renderData.billNumberSelected) - parseInt(1);
		$scope.renderDefaultValues();
	};

	/*
	* Params - Index of clicked button starting from 1.
	* Return - null - Updates totalNoOfsplits.
	*/
	$scope.spliteButtonClicked = function(index) {
		$scope.splitePaymentDetail["totalNoOfsplits"] = index;
		if (!$scope.splitSelected) {
			$scope.splitSelected = true;
			startingAmount = angular.copy($scope.renderData.defaultPaymentAmount);
		}
		calulateSplitAmount();
	};
	/*
	* Calculates split amount.
	*/
	var calulateSplitAmount = function() {
		// Amount spliting logic goes here, say total amount is 100 and no of split is 3,
		// So split = 33.33 ie totalAmount = 33.33*3 = 99.99 so carry = 100-99.99 = 0.01
		// this carry is added with first split amount
		$scope.splitePaymentDetail["splitAmount"] = parseFloat($filter("number")((startingAmount / $scope.splitePaymentDetail["totalNoOfsplits"]), 2).replace(/,/g, ''));
		$scope.splitePaymentDetail["carryAmount"] = parseFloat($filter("number")((startingAmount - ($scope.splitePaymentDetail["splitAmount"] * $scope.splitePaymentDetail["totalNoOfsplits"])), 2));
		// For first payment , carry amount is added with split amount.
        // Fixed the defect - CICO-23642
		$scope.renderData.defaultPaymentAmount = (parseFloat($scope.splitePaymentDetail["splitAmount"]) + parseFloat($scope.splitePaymentDetail["carryAmount"])).toFixed(2);
	};
	/*
	* Updates SplitPaymentDetail.
	*/
	var updateSplitPaymentDetail = function() {
		$scope.splitePaymentDetail["completedSplitPayments"] += 1;
		if ($scope.splitePaymentDetail["completedSplitPayments"] === $scope.splitePaymentDetail["totalNoOfsplits"]) {
			$scope.depositPaidSuccesFully = true;
		}
	};
	/*
	* Param - index - index of button start from 1.
	* return - String classname.
	*/

	$scope.classForPaymentSplitButton = function(index) {
		if (index === 1 && $scope.splitePaymentDetail["completedSplitPayments"] === 0) {
			return "checked";
		} else if (index <= $scope.splitePaymentDetail["completedSplitPayments"]) {
			return "paid";
		} else if (index <= $scope.splitePaymentDetail["totalNoOfsplits"]) {
			return "checked";
		} else {
			return "disabled";
		}
	};
	/*
	* Updates success payment detail.
	*/
	var updateSuccessMessage = function() {
		$scope.messageOfSuccessSplitPayment = $scope.messageOfSuccessSplitPayment + "SPLIT # " + $scope.splitePaymentDetail["completedSplitPayments"] + " OF "
		+  $filter("number")($scope.renderData.defaultPaymentAmount.toString().replace(/,/g, ""), 2) + " PAID SUCCESSFULLY !" + "<br/>";
		// Clears older failure messages.
		$scope.clearPaymentErrorMessage();
		// TO CONFIRM AND REMOVE COMMENT OR TO DELETE

		// ($scope.reservationBillData.isCheckout || !$scope.splitBillEnabled) -> this was the condtition before
		// had to remove the isCheckout flag which was causing the popup to close even if split payment is
		// selected
		(!$scope.splitBillEnabled) ? $scope.closeDialog() : '';
	};
	/*
	* updates DefaultPaymentAmount
	*/
	var updateDefaultPaymentAmount = function() {
		$scope.renderData.defaultPaymentAmount = $filter("number")($scope.splitePaymentDetail["splitAmount"], 2);
	};

	var paymentFinalDetails = {};

	var processeRestOfPaymentOperations  = function() {
		$scope.$emit('BILL_PAYMENT_SUCCESS', paymentFinalDetails);
		$scope.$emit("hideLoader");
		updateSplitPaymentDetail();
		updateSuccessMessage();
		updateDefaultPaymentAmount();
		paymentFinalDetails.billNumber = $scope.renderData.billNumberSelected;
		if ($scope.newPaymentInfo.addToGuestCard) {
			var cardCode = $scope.defaultPaymentTypeCard;
			var cardNumber = $scope.defaultPaymentTypeCardNumberEndingWith;
			var dataToGuestList = {
				"card_code": cardCode,
				"mli_token": cardNumber,
				"card_expiry": $scope.defaultPaymentTypeCardExpiry,
				"card_name": $scope.newPaymentInfo.cardDetails.userName,
				"id": paymentFinalDetails.id,
				"isSelected": true,
				"is_primary": false,
				"payment_type": "CC",
				"payment_type_id": 1
			};

			$scope.cardsList.push(dataToGuestList);
			$rootScope.$broadcast('ADDEDNEWPAYMENTTOGUEST', dataToGuestList);
		}
	};
	/*
	* Success call back of success payment
	*/
	var successPayment = function(e, data) {
		$scope.errorMessage = "";
		$scope.authorizedCode = data.authorization_code;
		paymentFinalDetails =  data;
		processeRestOfPaymentOperations();
	};

	/*
	* Failure call back of submitpayment
	*/
	var failedPayment = function(e, data) {
		// CICO-23196 : Enable MAKE PAYMENT button on error.
		$scope.disableMakePaymentButton = false;
		$scope.$emit("hideLoader");
		if ($scope.splitBillEnabled) {
			$scope.paymentErrorMessage = "SPLIT # " + ($scope.splitePaymentDetail["completedSplitPayments"] + 1) + " PAYMENT OF " + $scope.renderData.defaultPaymentAmount + " FAILED !" + "<br/>";
		}
		else {
			$scope.errorMessage = data;
		}

	};
	/*
	* Clears paymentErrorMessage
	*/

	$scope.clearPaymentErrorMessage = function() {
		$scope.paymentErrorMessage = '';
	};

	$scope.$on("SWIPED_DATA_TO_SAVE", function(e, swipedCardDataToSave) {

		$scope.swipedCardDataToSave = swipedCardDataToSave;
		var data 			= swipedCardDataToSave;

		data.reservation_id =	$scope.reservationData.reservationId;

		data.payment_credit_type = swipedCardDataToSave.cardType;
		data.credit_card = swipedCardDataToSave.cardType;
		data.card_expiry = "20" + swipedCardDataToSave.cardExpiryYear + "-" + swipedCardDataToSave.cardExpiryMonth + "-01";
		$scope.invokeApi(RVPaymentSrv.savePaymentDetails, data, successNewPayment);
	});


	/*
		*  card selection action
		*/
	$scope.setCreditCardFromList = function(index) {
		$scope.isExistPaymentType = true;
		$scope.showCreditCardInfo = true;
		$scope.defaultPaymentTypeCard = $scope.cardsList[index].card_code.toLowerCase();
		$scope.defaultPaymentTypeCardNumberEndingWith = $scope.cardsList[index].mli_token;
		$scope.defaultPaymentTypeCardExpiry = $scope.cardsList[index].card_expiry;
		angular.forEach($scope.cardsList, function(value, key) {
			value.isSelected = false;
		});
		$scope.cardsList[index].isSelected = true;
		$scope.saveData.payment_type_id =  $scope.cardsList[index].value;
		$scope.swippedCard = false;
		$scope.showCCPage = false;
		if ($scope.isStandAlone)	{
			$scope.feeData.feesInfo = $scope.cardsList[index].fees_information;
			$scope.setupFeeData();
		}
		$scope.newCardAdded = false;
	};

	$scope.$on('cardSelected', function(e, data) {
		$scope.setCreditCardFromList(data.index);
	});

	$scope.$on("TOKEN_CREATED", function(e, data) {
            $scope.showGuestAddCard = true;
		$scope.newPaymentInfo = data;
		$scope.showCCPage = false;
		$scope.swippedCard = false;
		setTimeout(function() {
			savePayment(data);
		}, 200);
	});

	$scope.$on("MLI_ERROR", function(e, data) {
		$scope.errorMessage = data;
	});

	$scope.$on('cancelCardSelection', function(e, data) {
		$scope.showCCPage = false;
		$scope.swippedCard = false;
		$scope.isManual = false;
		$scope.saveData.paymentType = "";
	});

	$scope.$on("SHOW_SWIPED_DATA_ON_PAY_SCREEN", function(e, swipedCardDataToRender) {
		$scope.showCCPage 						 = true;
		$scope.swippedCard 						 = true;
		$scope.addmode                 			 = true;
		$scope.$broadcast("RENDER_SWIPED_DATA", swipedCardDataToRender);
	});

	var listenerPaymentSuccess = $scope.$on("PAYMENT_SUCCESS", successPayment);

	var listenerPaymentFailure = $scope.$on("PAYMENT_FAILED", failedPayment);

	// TODO: This section is to be considered after the APIs are changed to be consistent with the credit card information
	/**
	 * This method is used to map the cardDetails available in this controller
	 * to the schema that the payment App expects it to be in
     */
	var matchCardObjectSchema = function() {
		_.each($scope.reservationBillData.bills, function(billData) {
			var cardDetails = billData.credit_card_details;

			billData.selectedCC = {
				card_code: cardDetails.card_code,
				ending_with: cardDetails.card_number,
				expiry_date: cardDetails.card_expiry,
				fees_information: cardDetails.fees_information,
				holder_name: cardDetails.card_name,
				is_credit_card: cardDetails.payment_type === "CC",
				value: cardDetails.payment_id
			};
		});
	};

    var resetSplitPayment = function() {
        // split bill payments hidden for gift cards for now (cico-19009) per priya
        $scope.splitBillEnabled = false;
        $scope.splitePaymentDetail = {
            totalNoOfsplits: 1,
            completedSplitPayments: 0,
            totalAmount: 0,
            splitAmount: 0,
            carryAmount: 0
        };
        $scope.messageOfSuccessSplitPayment = '';
        $scope.paymentErrorMessage = '';
        $scope.renderData.defaultPaymentAmount = 0;
        $scope.splitSelected = false;
    };

    $scope.$on("PAYMENT_TYPE_CHANGED", function(event, paymentType) {
        $scope.showCCPage = paymentType === "CC";
        if (paymentType === "GIFT_CARD") {
            resetSplitPayment();
        }
    });

    $scope.$watch("reservationBillData.bills", matchCardObjectSchema);

	$scope.$on('$destroy', listenerPaymentFailure);
	$scope.$on('$destroy', listenerPaymentSuccess);

}]);