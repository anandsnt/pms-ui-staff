sntPay.controller('paySixPayController', ['$scope', 'paymentAppEventConstants', 'sntPaymentSrv', '$timeout',
    function($scope, payEvntConst, sntPaymentSrv, $timeout) {

        var retrieveCardDetails = function(tokenDetails) {
            var cardDetails = {};
            cardDetails.cardType = tokenDetails.token_no.substr(tokenDetails.token_no.length - 4);
            cardDetails.expiryMonth = tokenDetails.expiry.substring(2, 4);
            cardDetails.expiryYear = tokenDetails.expiry.substring(0, 2);
            //for displaying
            cardDetails.expiryDate = cardDetails.expiryMonth + " / " + cardDetails.expiryYear;
            //for API params
            cardDetails.cardExpiry = (cardDetails.expiryMonth && cardDetails.expiryYear) ? ("20" + cardDetails.expiryYear + "-" + cardDetails.expiryMonth + "-01") : "";
            cardDetails.cardCode = sntPaymentSrv.getSixPayCreditCardType(tokenDetails.card_type).toLowerCase();
            //last 4 number of card
            cardDetails.endingWith = tokenDetails.token_no.substr(tokenDetails.token_no.length - 4);
            cardDetails.token = tokenDetails.token_no;
            cardDetails.nameOnCard = $scope.payment.guestFirstName + ' ' + $scope.payment.guestLastName;
            return cardDetails;
        };

        var notifyParent = function(tokenDetails) {
            var cardDetails = retrieveCardDetails(tokenDetails);
            var paymentData = {
                apiParams: {
                    name_on_card: cardDetails.nameOnCard,
                    payment_type: "CC",
                    token: cardDetails.token,
                    card_expiry: cardDetails.cardExpiry
                },
                cardDisplayData: {
                    card_code: cardDetails.cardCode,
                    ending_with: cardDetails.endingWith,
                    expiry_date: cardDetails.expiryDate
                }
            };
            $scope.$emit(payEvntConst.CC_TOKEN_GENERATED, {
                paymentData,
                tokenDetails,
                cardData: cardDetails
            });
        };


        var notifyParentError = function(errorMessage) {
            console.error(errorMessage);
        };

        var proceedChipAndPinPayment = function(params) {
            //we need to notify the parent controllers to show loader
            //as this is an external directive

            $scope.$emit("SHOW_SIX_PAY_LOADER");
            sntPaymentSrv.submitPaymentForChipAndPin(params).then(function(response) {
                    console.log("payment success" + $scope.payment.amount);
                    response.amountPaid = $scope.payment.amount;
                    response.authorizationCode = response.authorization_code;
                    // NOTE: The feePaid key and value would be sent IFF a fee was applied along with the payment
                    if ($scope.feeData) {
                        response.feePaid = $scope.feeData.calculatedFee;
                    }

                    $scope.selectedCC.value = response.payment_method.id;
                    $scope.selectedCC.card_code = response.payment_method.card_type;
                    $scope.selectedCC.ending_with = response.payment_method.ending_with;
                    $scope.selectedCC.expiry_date = response.payment_method.expiry_date;
                    response.cc_details = angular.copy($scope.selectedCC);

                    if ($scope.payment.showAddToGuestCard) {
                        //check if add to guest card was selected
                        response.add_to_guest_card = $scope.payment.addToGuestCardSelected;
                    }
                    $scope.$emit("HIDE_SIX_PAY_LOADER");
                    $timeout(()=> {
                        $scope.$emit('PAYMENT_SUCCESS', response);
                    }, 700);

                },
                function(errorMessage) {
                    console.log("payment failed" + errorMessage);
                    $scope.$emit('PAYMENT_FAILED', errorMessage);
                    $scope.$emit("HIDE_SIX_PAY_LOADER");
                });
        };

        var tokenize = function(params) {
            $scope.$emit("SHOW_SIX_PAY_LOADER");
            sntPaymentSrv.getSixPaymentToken(params).then(
                response => {
                    /**
                     * The response here is expected to be of the following format
                     * {
                     *  card_type: "VX",
                     *  ending_with: "0088",
                     *  expiry_date: "1217"
                     *  payment_method_id: 35102,
                     *  token: "123465498745316854"
                     * }
                     *
                     * NOTE: In case the request params sends add_to_guest_card: true AND guest_id w/o reservation_id
                     * The API response has guest_payment_method_id instead of payment_method_id
                     */
                    $scope.$emit('SUCCESS_LINK_PAYMENT', {
                        response: {
                            id: response.payment_method_id || response.guest_payment_method_id,
                            payment_name: "CC"
                        },
                        selectedPaymentType: $scope.selectedPaymentType || "CC",
                        cardDetails: {
                            "card_code": response.card_type,
                            "ending_with": response.ending_with,
                            "expiry_date": response.expiry_date,
                            "card_name": ""
                        }
                    });

                    $scope.$emit("HIDE_SIX_PAY_LOADER");
                },
                errorMessage => {
                    console.log("Tokenization Failed");
                    $scope.$emit('PAYMENT_FAILED', errorMessage);
                    $scope.$emit("HIDE_SIX_PAY_LOADER");
                }
            );
        };

        $scope.$on('INITIATE_CHIP_AND_PIN_PAYMENT', function(event, data) {
            var paymentParams = data;
            paymentParams.postData.is_emv_request = true;
            paymentParams.postData.workstation_id = $scope.hotelConfig.workstationId;
            paymentParams.emvTimeout = parseInt($scope.hotelConfig.emvTimeout);
            proceedChipAndPinPayment(data);
        });

        $scope.$on('INITIATE_CHIP_AND_PIN_TOKENIZATION', function(event, data) {
            var paymentParams = data;
            paymentParams.is_emv_request = true;
            paymentParams.emvTimeout = parseInt($scope.hotelConfig.emvTimeout);
            tokenize(data);
        });

        /****************** init ***********************************************/

        (function() {
            //Initially set Manaul card Entry if card is attached already
            var isCCPresent = angular.copy($scope.showSelectedCard());
            $scope.payment.isManualEntryInsideIFrame = isCCPresent && $scope.hotelConfig.paymentGateway === 'sixpayments' ? true : false;

            //handle six payment iFrame communication
            var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
            var eventer = window[eventMethod];
            var messageEvent = eventMethod === "attachEvent" ? "onmessage" : "message";

            eventer(messageEvent, function(e) {
                var responseData = e.data;
                if (responseData.response_message === "token_created") {
                    notifyParent(responseData);
                }
            }, false);
        })();

    }]);