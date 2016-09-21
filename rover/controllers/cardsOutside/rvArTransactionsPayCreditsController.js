sntRover.controller('RVArTransactionsPayCreditsController', ['$scope', 'RVPaymentSrv', 'ngDialog', '$rootScope', '$timeout', '$filter', 'rvAccountTransactionsSrv', 'rvPermissionSrv', function($scope, RVPaymentSrv, ngDialog, $rootScope, $timeout, $filter, rvAccountTransactionsSrv, rvPermissionSrv) {
    BaseCtrl.call(this, $scope);

    $scope.feeData = {};
    var zeroAmount = parseFloat("0.00");
    $scope.saveData = {'paymentType': ''};
    $scope.billNumber = 1;
    $scope.renderData = {};
    $scope.renderData.defaultPaymentAmount = $scope.arTransactionDetails.amount_owing;
    var bill_id = $scope.arTransactionDetails.company_or_ta_bill_id;
    //Added for CICO-26730
    $scope.cardsList = [];
    var isSixPayment = false;
    var tokenDetails = {};
    var cardDetails = {};
    $scope.addmode = ($scope.cardsList.length > 0) ? false : true;
    /*
     * if no payment type is selected disable payment button
     */
    $scope.disableMakePayment = function() {
        if ($scope.saveData.paymentType.length > 0) {
            return false;
        }
        else {
            return true;
        }
        ;
    };
    $scope.handleCloseDialog = function() {
        $scope.$emit('HANDLE_MODAL_OPENED');
        $scope.closeDialog();
    };

    $scope.$on("CLOSE_DIALOG", $scope.handleCloseDialog);

    /*
     * Success call back - for initial screen
     */
    $scope.getPaymentListSuccess = function(data) {
        $scope.$emit('hideLoader');
        $scope.renderData.paymentTypes = _.filter(data, function(paymentType) {
            return paymentType.name !== "GIFT_CARD"
        });
        renderDefaultValues();
    };

    var init = function() {
        $scope.referenceTextAvailable = false;
        $scope.showInitalPaymentScreen = true;
        $scope.depositPaidSuccesFully = false;
        $scope.invokeApi(RVPaymentSrv.renderPaymentScreen, {}, $scope.getPaymentListSuccess);
    };

    init();


    /*
     * Success call back of success payment
     */
    var successPayment = function(data) {
        $scope.$emit("hideLoader");
        $scope.depositPaidSuccesFully = true;
        $scope.arTransactionDetails.amount_owing = parseFloat(data.amount_owing).toFixed(2);
        $scope.arTransactionDetails.available_credit = parseFloat(data.available_credit).toFixed(2);
        $scope.depositPaidSuccesFully = true;
        $scope.authorizedCode = data.authorization_code;
        //Reload the ar transaction listing after payment
        $scope.reloadARTransactionListing();
    };

    /*
     * Failure call back of submitpayment
     */
    var failedPayment = function(data) {
        $scope.$emit("hideLoader");
        $scope.errorMessage = data;
    };

    $scope.$on("PAYMENT_SUCCESS", function(e, response) {
        successPayment(response);
    });

    $scope.$on("PAYMENT_FAILED", function(e, response) {
        failedPayment(response);
    });

    /*
     * Clears paymentErrorMessage
     */
    $scope.clearPaymentErrorMessage = function() {
        $scope.paymentErrorMessage = '';
    };

    /*
     * Action - On click submit payment button
     */


    /**
     * function to check whether the user has permission
     * to make payment
     * @return {Boolean}
     */
    $scope.hasPermissionToMakePayment = function() {
        return rvPermissionSrv.getPermissionValue('MAKE_PAYMENT');
    };

    /**
     * retrieve token from paymnet gateway - from cards ctrl
     */
    $scope.$on("TOKEN_CREATED", function(e, data) {
        $scope.newPaymentInfo = data;
        $scope.showCCPage = false;
        $scope.swippedCard = false;
        setTimeout(function() {
            savePayment(data);
        }, 200);
        runDigestCycle();
    });

    /*
     * To save new card
     */
    var savePayment = function(data) {

        isSixPayment = angular.copy($scope.newPaymentInfo.tokenDetails.isSixPayment);
        tokenDetails = angular.copy($scope.newPaymentInfo.tokenDetails);
        cardDetails = angular.copy($scope.newPaymentInfo.cardDetails);

        var cardToken = !isSixPayment ? tokenDetails.session : data.tokenDetails.token_no;
        var expiryMonth = isSixPayment ? tokenDetails.expiry.substring(2, 4) : cardDetails.expiryMonth;
        var expiryYear = isSixPayment ? tokenDetails.expiry.substring(0, 2) : cardDetails.expiryYear;
        var expiryDate = (expiryMonth && expiryYear ) ? ("20" + expiryYear + "-" + expiryMonth + "-01") : "";
        var cardCode = isSixPayment ?
            getSixCreditCardType(tokenDetails.card_type).toLowerCase() :
            cardDetails.cardType;


        $scope.callAPI(rvAccountTransactionsSrv.savePaymentDetails, {
            successCallBack: successNewPayment,
            params: {
                "bill_id": bill_id,
                "data_to_pass": {
                    "card_expiry": expiryDate,
                    "name_on_card": $scope.newPaymentInfo.cardDetails.userName,
                    "payment_type": "CC",
                    "token": cardToken,
                    "card_code": cardCode
                }
            }
        });
    };


    /*
     * Success call back of save new card
     */
    var successNewPayment = function(data) {

        $scope.$emit("hideLoader");
        var cardType = "";
        var cardNumberEndingWith = "";
        var cardExpiry = "";
        var swipedData = angular.copy($scope.swipedCardDataToSave);
        if (!isEmptyObject(swipedData)) {
            cardType = swipedData.cardType.toLowerCase();
            cardNumberEndingWith = swipedData.cardNumber.slice(-4);
            cardExpiry = swipedData.cardExpiryMonth + "/" + swipedData.cardExpiryYear;
            $scope.saveData.paymentType = "CC";
        }
        else {
            cardType = retrieveCardtype(isSixPayment, tokenDetails, cardDetails);
            cardNumberEndingWith = retrieveCardNumber(isSixPayment, tokenDetails, cardDetails);
            cardExpiry = retrieveCardExpiryDate(isSixPayment, tokenDetails, cardDetails);

        }

        $scope.defaultPaymentTypeCard = cardType;
        $scope.defaultPaymentTypeCardNumberEndingWith = cardNumberEndingWith;
        $scope.defaultPaymentTypeCardExpiry = cardExpiry;

        //check if the selected card has reference
        checkReferencetextAvailableForCC();

        //check if the selected card has fees
        _.each($scope.renderData.paymentTypes, function(paymentType) {
            if (paymentType.name === "CC") {
                _.each(paymentType.values, function(paymentType) {
                    if (cardType.toUpperCase() === paymentType.cardcode) {
                        $scope.feeData.feesInfo = paymentType.charge_code.fees_information;
                        $scope.setupFeeData();
                    }

                });
            }
            ;
        });


        $scope.saveData.payment_type_id = data.id;
        $scope.showCCPage = false;
        $scope.swippedCard = false;
        $scope.showCreditCardInfo = true;
        $scope.newCardAdded = true;
        $scope.swipedCardDataToSave = {};

    };

    /*
     * Checks whether the selected credit card btn needs to show or not
     */
    $scope.showSelectedCreditCardButton = function() {
        if ($scope.showCreditCardInfo && !$scope.showCCPage && ($scope.paymentGateway !== 'sixpayments' || $scope.isManual) && $scope.saveData.paymentType === 'CC' && !$scope.depositPaidSuccesFully) {
            return true;
        } else {
            return false;
        }
    };

    /*
     * Checks whether reference text is available for CC
     */
    var checkReferencetextAvailableForCC = function() {
        //call utils fn
        $scope.referenceTextAvailable = checkIfReferencetextAvailableForCC($scope.renderData.paymentTypes, $scope.defaultPaymentTypeCard);
    };

    //Added for CICO-26730
    $scope.changeOnsiteCallIn = function() {
        $scope.showCCPage = ($scope.isManual) ? true : false;
    };

    //Added for CICO-26730
    $scope.$on('changeOnsiteCallIn', function(event) {
        $scope.isManual = !$scope.isManual;
        $scope.changeOnsiteCallIn();
    });

    /**
     * to run angular digest loop,
     * will check if it is not running
     * return - None
     */
    var runDigestCycle = function() {
        if (!$scope.$$phase) {
            $scope.$digest();
        }
    };

    /*
     * Success call back of MLI swipe - from cards ctrl
     */
    $scope.$on("SHOW_SWIPED_DATA_ON_PAY_SCREEN", function(e, swipedCardDataToRender) {
        //set variables to display the add mode
        $scope.showCCPage = true;
        $scope.swippedCard = true;
        $scope.addmode = true;
        $scope.$broadcast("RENDER_SWIPED_DATA", swipedCardDataToRender);
    });

    $scope.$on("PAYMENT_TYPE_CHANGED", function(event, paymentType) {
        $scope.showCCPage = paymentType === "CC";
    });

    $scope.$on("SWIPED_DATA_TO_SAVE", function(e, swipedCardDataToSave) {

        $scope.swipedCardDataToSave = swipedCardDataToSave;
        var data = swipedCardDataToSave;
        data.payment_credit_type = swipedCardDataToSave.cardType;
        data.credit_card = swipedCardDataToSave.cardType;
        data.card_expiry = "20" + swipedCardDataToSave.cardExpiryYear + "-" + swipedCardDataToSave.cardExpiryMonth + "-01";
        $scope.callAPI(rvAccountTransactionsSrv.savePaymentDetails, {
            successCallBack: successNewPayment,
            params: {
                "bill_id": bill_id,
                "data_to_pass": data
            }
        });

    });

    /**
     * MLI error - from cards ctrl
     */
    $scope.$on("MLI_ERROR", function(e, data) {
        $scope.errorMessage = data;
    });

    /*
     * Invoke this method to show the refund amount on the button in the payment screen
     */
    var renderDefaultValues = function() {
        $scope.defaultRefundAmount = (-1) * parseFloat($scope.renderData.defaultPaymentAmount);
        if ($scope.renderData.defaultPaymentAmount < 0) {
            $scope.defaultRefundAmount = (-1) * parseFloat($scope.renderData.defaultPaymentAmount);
            $scope.shouldShowMakePaymentButton = false;
        } else {
            $scope.shouldShowMakePaymentButton = true;
        }
        ;
    };

}]);