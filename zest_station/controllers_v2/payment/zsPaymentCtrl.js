angular.module('sntZestStation').controller('zsPaymentCtrl', ['$scope', '$log', 'sntActivity', 'sntPaymentSrv', 'zsPaymentSrv', '$stateParams', 'zsStateHelperSrv', '$state', '$filter', 'zsGeneralSrv', '$timeout', '$controller', '$rootScope',
    function($scope, $log, sntActivity, sntPaymentSrv, zsPaymentSrv, $stateParams, zsStateHelperSrv, $state, $filter, zsGeneralSrv, $timeout, $controller, $rootScope) {

        $scope.$on('CLICKED_ON_CANCEL_BUTTON', function () {
            $scope.$emit('CANCEL_EMV_ACTIONS');
        });
        $scope.hotelConfig = {
            'emvTimeout': $rootScope.emvTimeout
        };
        $scope.screenMode = {
            'value': 'PROCESS_INITIAL',
            'errorMessage': '',
            'paymentInProgress': false,
            'isUsingExistingCardPayment': false,
            'paymentAction': '', // can be add card (ADD_CARD) or pay (PAY_AMOUNT),
            'paymentSuccess': false,
            'paymentFailure': false,
            'paymentTypeFetchCompleted': false,
            'totalAmountPlusFees': 0,
            'showFees': false,
            'amountDue': 0,
            'totalFees': 0
        };

        $scope.$on("FETCH_PAYMENT_TYPES", function(event, data) {
            $scope.callAPI(zsPaymentSrv.fetchAvailablePaymentTyes, {
                params: {},
                'successCallBack': function(paymentTypes) {
                    var selectedPaymentType = _.find(paymentTypes, {
                        name: data.paymentTypeName
                    });
                    var feeInfo = (selectedPaymentType &&
                        selectedPaymentType.charge_code &&
                        selectedPaymentType.charge_code.fees_information) || {};
                    var amountDetails = sntPaymentSrv.calculateFee(data.amountToPay, feeInfo);
                    var paymentParams = zsPaymentSrv.getPaymentData();

                    if (amountDetails.showFees) {
                        // for resetting service data
                        paymentParams.total_value_plus_fees = amountDetails.totalOfValueAndFee;
                        paymentParams.fees_amount = amountDetails.calculatedFee;
                        paymentParams.fees_charge_code_id = amountDetails.feeChargeCode;

                        // for diplaying
                        $scope.screenMode.showFees = true;
                        $scope.screenMode.totalAmountPlusFees = amountDetails.totalOfValueAndFee;
                        $scope.screenMode.amountDue = amountDetails.defaultAmount;
                        $scope.screenMode.totalFees = amountDetails.calculatedFee;
                    } else {
                        $scope.screenMode.totalAmountPlusFees = amountDetails.defaultAmount;
                    }

                    zsPaymentSrv.setPaymentData(paymentParams);
                    $scope.screenMode.paymentTypeFetchCompleted = true;

                    $scope.$emit('FETCH_PAYMENT_TYPES_COMPLETED');
                }
            });
        });

        var runDigestCycle = function() {
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        };

        var paymentFailureActions = function () {
            $scope.$emit('hideLoader');
            $scope.resetTime();
            $scope.screenMode.paymentInProgress = false;
            $scope.screenMode.paymentFailure = true;
            $scope.screenMode.value = 'PAYMENT_FAILED';
            $scope.$emit('PAYMENT_FAILED');
            $scope.$emit('CANCEL_EMV_ACTIONS');
            runDigestCycle();
        };

        /**  ***************************** CBA **************************************/

        if ($scope.zestStationData.paymentGateway === 'CBA' || ($scope.zestStationData.paymentGateway === 'MLI' && $scope.zestStationData.hotelSettings.mli_cba_enabled)) {
            $controller('payCBACtrl', {
                $scope: $scope
            });
        }
        var makeCBAPayment = function() {
            $scope.$emit('showLoader');
            $scope.screenMode.errorMessage = '';
            $scope.screenMode.paymentInProgress = true;

            var paymentParams = zsPaymentSrv.getSubmitPaymentParams();

            $scope.$broadcast('INITIATE_CBA_PAYMENT', paymentParams);
        };

        var setErrorMessageBasedOnResponse = function(errorMessage) {
            var message = '';

            if (errorMessage.includes('OPERATOR TIMEOUT')) {
                // 143 TRANSACTION FAILED.:OPERATOR TIMEOUT
                message = 'OPERATION TIMED OUT';
            } else if (errorMessage.includes('104 Connection with an external device not established')) {
                // 104 CONNECTION WITH AN EXTERNAL DEVICE NOT ESTABLISHED.
                message = 'PLEASE RECHECK THE CONNECTION WITH THE EXTERNAL DEVICE';
            } else {
                // 143 TRANSACTION FAILED.:OPERATOR CANCELLED
                // 143 TRANSACTION FAILED.:SYSTEM ERROR XI
                message = 'TRANSACTION FAILED';
            }
            return message;
        };

        var showErrorMessage = function(errorMessage) {
            if (Array.isArray(errorMessage) && errorMessage.length > 0) {
                $scope.screenMode.errorMessage = setErrorMessageBasedOnResponse(errorMessage[0]);
            } else {
                $scope.screenMode.errorMessage = setErrorMessageBasedOnResponse(errorMessage);
            }
        };

        var cbaResponse,
            cbaPaymentAttempt = 0;

        /**
         * Method to initate listeners that handle CBA payment scenarios
         * @returns {undefined} undefined
         */
        $scope.initiateCBAlisteners = function () {
            cbaPaymentAttempt = 0;
            
            var listenerCBAPaymentFailure = $scope.$on('CBA_PAYMENT_FAILED', function(event, errorMessage) {
                $log.warn(errorMessage);
                showErrorMessage(errorMessage);
                paymentFailureActions();
                // TODO : Handle Error here!
            });

            var listenerCBAPaymentSuccess = $scope.$on('CBA_PAYMENT_SUCCESS', function(event, response) {
                cbaResponse = response;
                cbaPaymentAttempt++;

                var params = zsPaymentSrv.getSubmitPaymentParams();


                // we need to notify the parent controllers to show loader
                // as this is an external directive
                $scope.$emit('showLoader');
                params.postData.payment_type_id = response.payment_method_id;
                params.postData.credit_card_transaction_id = response.id;
                if ($scope.zestStationData.paymentGateway === 'MLI' && $scope.zestStationData.hotelSettings.mli_cba_enabled) {
                    params.postData.payment_type = 'CBA';
                }
                sntPaymentSrv.submitPayment(params).then(
                    function() {
                        $scope.screenMode.value = 'PAYMENT_SUCCESS';
                        $scope.screenMode.paymentInProgress = false;
                        $scope.screenMode.paymentSuccess = true;
                        $scope.$emit('hideLoader');
                        $scope.$emit('CBA_PAYMENT_COMPLETED');
                    },
                    function(errorMessage) {
                        if (cbaPaymentAttempt === 1) {
                            $scope.screenMode.value = 'RETRY_CBA_PAYMENT';
                            $scope.$emit('hideLoader');
                            $scope.screenMode.paymentInProgress = false;
                            $scope.screenMode.paymentSuccess = false;

                            $scope.screenMode.counter = 0;
                           
                            $scope.onTimeout = function() {
                                $scope.screenMode.counter++;
                                mytimeout = $timeout($scope.onTimeout, 1000);
                                if ($scope.screenMode.counter === 15) {
                                    $timeout.cancel(mytimeout);
                                    $scope.$emit('CBA_PAYMENT_SUCCESS', cbaResponse);
                                }
                            };
                            var mytimeout = $timeout($scope.onTimeout, 1000);
                            
                        } else {
                            $log.warn(errorMessage);
                            showErrorMessage(errorMessage);
                            paymentFailureActions();
                            cbaPaymentAttempt = 0;
                        }
                    }
                );
            });

            var listenerUpdateErrorMessage = $scope.$on('UPDATE_NOTIFICATION', function(event, response) {
                $log.warn(response);
                showErrorMessage(response);
                $scope.$emit('hideLoader');
                $scope.screenMode.paymentInProgress = false;
                $scope.screenMode.paymentFailure = true;
                $scope.screenMode.value = 'PAYMENT_FAILED';
                $scope.$emit('PAYMENT_FAILED');
            });

            $scope.$on('$destroy', listenerCBAPaymentFailure);
            $scope.$on('$destroy', listenerCBAPaymentSuccess);
            $scope.$on('$destroy', listenerUpdateErrorMessage);
        };
        /**  ***************************** CBA code ends here **************************************/
        var stopObeserveForSwipe = function() {
            if ($scope.zestStationData.paymentGateway === 'MLI' && $scope.zestStationData.ccReader === 'local') {
                $scope.$emit('STOP_OBSERVE_FOR_SWIPE');
            }
        };
        var callSubmitPaymentApi = function(params, loader) {
            $scope.screenMode.paymentInProgress = true;
            $scope.callAPI(zsPaymentSrv.submitDeposit, {
                params: params,
                'successCallBack': function() {
                    $scope.$emit('hideLoader');
                    $scope.screenMode.value = 'PAYMENT_SUCCESS';
                    $scope.screenMode.paymentSuccess = true;
                    $scope.screenMode.paymentInProgress = false;
                    // stop observe for swipe once payment is success
                    stopObeserveForSwipe();
                    runDigestCycle();
                },
                'failureCallBack': function() {
                    paymentFailureActions();
                }
            });
        };

       $scope.startCBAPayment = function() {
            if ($scope.isIpad) {
                $scope.screenMode.value = 'PAYMENT_IN_PROGRESS';
                $timeout(function() {
                    makeCBAPayment();
                }, 3000);
            } else {
                $scope.$emit('showLoader');
                $timeout(function() {
                    paymentFailureActions();
                    $scope.screenMode.errorMessage = 'Use Zest station from an iPad';
                }, 2000);
            }
        };

        $scope.payUsingNewCard = function() {
            $scope.resetTime();
            $scope.screenMode.value = 'PAYMENT_IN_PROGRESS';
            $scope.screenMode.isUsingExistingCardPayment = false;
            $scope.screenMode.paymentFailure = false;
            $scope.screenMode.errorMessage = '';
            var isCBA = ($scope.zestStationData.paymentGateway === 'CBA' || ($scope.zestStationData.paymentGateway === 'MLI' && $scope.zestStationData.hotelSettings.mli_cba_enabled)) && $scope.isIpad;
            var isEMVPayment = ($scope.zestStationData.paymentGateway === 'MLI' && $scope.zestStationData.mliEmvEnabled) ||
                $scope.zestStationData.paymentGateway === 'sixpayments';
            var isDesktopMLIPayment = $scope.zestStationData.paymentGateway === 'MLI' && $scope.zestStationData.ccReader === 'websocket';
            var isIpadDevicePayment = $scope.zestStationData.paymentGateway === 'MLI' && $scope.zestStationData.ccReader === 'local';

            if (isCBA) {
                $scope.startCBAPayment();
            } else if (isEMVPayment) { // for EMV start sending request to terminal
                // add 4 seconds delay for the screen to show the activity indicator
                proceedWithEMVPayment();
            } else if (isDesktopMLIPayment) {
                // Check if socket is ready
                if ($scope.inDemoMode()) {
                    processSwipeCardData(zsPaymentSrv.sampleMLISwipedCardResponse);
                } else if ($scope.socketOperator.returnWebSocketObject().readyState === 1) {
                    $scope.$emit('showLoader');
                    observeForDesktopSwipe();
                } else {
                    $scope.$emit('showLoader');
                    $scope.$emit('CONNECT_WEBSOCKET');
                }
            } else if (isIpadDevicePayment) {
                proceedWithiPadPayments();
            } else {
                $scope.$emit('showLoader');
                $timeout(function() {
                    $scope.$emit('hideLoader');
                    $scope.screenMode.value = 'PAYMENT_FAILED';
                    $scope.screenMode.paymentFailure = true;
                    $scope.screenMode.errorMessage = 'Please check your settings and device connections';
                }, 2000);
            }
        };
        /**  *************************** EMV **********************************/

        var saveCardByEmv = function (params) {
            $scope.callAPI(zsPaymentSrv.chipAndPinGetToken, {
                params: params,
                'successCallBack': function() {
                    $scope.$emit('hideLoader');
                    $scope.$emit('SAVE_CC_SUCCESS');
                    runDigestCycle();
                },
                'failureCallBack': function() {
                    paymentFailureActions();
                }
            });
        };

        var proceedWithEMVPayment = function() {
            var params = {
                    'is_emv_request': true,
                    'reservation_id': $scope.reservation_id.toString(),
                    'add_to_guest_card': false,
                    'amount': $scope.screenMode.totalAmountPlusFees,
                    'bill_number': 1,
                    'payment_type': 'CC'
                };

            if ($scope.screenMode.paymentAction === 'PAY_AMOUNT') {
                callSubmitPaymentApi(params);
            } else {
                saveCardByEmv(params);
            }
        };

        $scope.payUsingExistingCard = function() {
            var params = {
                    'is_emv_request': false,
                    'reservation_id': $scope.reservation_id,
                    'add_to_guest_card': false,
                    'amount': $scope.screenMode.totalAmountPlusFees,
                    'bill_number': 1,
                    'payment_type': 'CC',
                    'payment_type_id': $scope.cardDetails.id
                };
                
           $scope.screenMode.isUsingExistingCardPayment = true;

            callSubmitPaymentApi(params);
        };

        /**  *********************** DESKTOP SWIPE ********************************/

        var observeForDesktopSwipe = function () {
            $scope.screenMode.paymentInProgress = true;
            $scope.socketOperator.observe();
        };

  
        $scope.$on('USER_ACTIVITY_TIMEOUT', function() {
            // check if payment is in progress or payment was success. 
            // For Desktop swupe we will not use paymentInProgress to consider 
            // CBA, sixpay and MLI EMV handles timeout on their own
            
            if ((!$scope.screenMode.paymentInProgress || 
                ($scope.zestStationData.paymentGateway === 'MLI' && !$scope.zestStationData.mliEmvEnabled))
                && !$scope.screenMode.paymentSuccess
                && $scope.screenMode.value !== 'SELECT_PAYMENT_METHOD'
                && $scope.zestStationData.paymentGateway !== 'CBA'
                && $scope.zestStationData.paymentGateway !== 'sixpayments') {
                    $scope.$emit('hideLoader');
                    $scope.screenMode.errorMessage = $filter('translate')('CC_SWIPE_TIMEOUT_SUB');
                    $scope.screenMode.value = 'PAYMENT_FAILED';
                    $scope.screenMode.paymentFailure = true;
                    $scope.$emit('PAYMENT_FAILED');
                    $scope.resetTime();
                    stopObeserveForSwipe();

            } else {
                // TO DO later
                // $scope.screenMode.value = 'CARD_ADD_FAILURE';
            }
        });

        var saveSwipedCardMLI = function(data) {
            var successSavePayment = function() {
                // stop observe for swipe once CC is saved
                stopObeserveForSwipe();
                $scope.$broadcast('SAVE_CC_SUCCESS');
            };

            $scope.callAPI(zsPaymentSrv.savePayment, {
                params: data,
                successCallBack: successSavePayment,
                failureCallBack: paymentFailureActions
            });
        };

        var processSwipeCardData = function(swipedCardData) {
            var swipeOperationObj = new SwipeOperation();
            var params = swipeOperationObj.createDataToTokenize(swipedCardData);

            $log.info('fetching token...from tokenize...');
            $scope.callAPI(zsGeneralSrv.tokenize, {
                params: params,
                'successCallBack': function(response) {
                    $scope.$emit('showLoader');
                    var cardExpiry = "20" + swipedCardData.RVCardReadExpDate.substring(0, 2) + "-" + swipedCardData.RVCardReadExpDate.slice(-2) + "-01";
                    var data = {
                        "reservation_id": $scope.reservation_id,
                        "payment_type": "CC",
                        "mli_token": response,
                        "et2": swipedCardData.RVCardReadTrack2,
                        "etb": swipedCardData.RVCardReadETB,
                        "ksn": swipedCardData.RVCardReadTrack2KSN,
                        "pan": swipedCardData.RVCardReadMaskedPAN,
                        "card_name": swipedCardData.RVCardReadCardName,
                        "name_on_card": swipedCardData.RVCardReadCardName,
                        "card_expiry": cardExpiry,
                        "credit_card": swipedCardData.RVCardReadCardType,
                        "is_emv_request": false,
                        "amount": $scope.screenMode.totalAmountPlusFees,
                        "bill_number": 1
                    };

                    if ($scope.screenMode.paymentAction === 'PAY_AMOUNT') {
                        callSubmitPaymentApi(data);
                    } else {
                        saveSwipedCardMLI(data);
                    }
                },
                'failureCallBack': function() {
                    paymentFailureActions();
                }
            });
        };

        $scope.$on('SWIPE_ACTION', function (evt, response) {
            if (!$scope.screenMode.paymentFailure && !$scope.screenMode.paymentSuccess && !$scope.screenMode.isCBADespositMode) {
                processSwipeCardData(response);
            } else {
                $scope.$emit('hideLoader');
            }
            
            runDigestCycle();
        });
        $scope.$on('SOCKET_CONNECTED', function() {
            observeForDesktopSwipe();
            runDigestCycle();
        });
        $scope.$on('SOCKET_FAILED', function() {
            $scope.$emit('hideLoader');
            $scope.screenMode.errorMessage = $filter('translate')('CHECK_HANDLER_IS_RUNNING_MSG');
            $scope.screenMode.value = 'PAYMENT_FAILED';
            $scope.screenMode.paymentFailure = true;
            runDigestCycle();
        });

        /**  *********************** Ipad device actions ********************************/

        var proceedWithiPadPayments = function(hideLoader) {

            if ($scope.inDemoMode()) {
                processSwipeCardData(zsPaymentSrv.sampleMLISwipedCardResponse);
            }
            // show error if the device is not iPad
            else if ($scope.isIpad) {
                if (!hideLoader) {
                    $scope.$emit('showLoader');
                }
                $scope.screenMode.paymentInProgress = true;
                $scope.cardReader.startReader({
                    'successCallBack': function(response) {
                        if ((!$scope.screenMode.paymentFailure && !$scope.screenMode.paymentSuccess) || $scope.screenMode.paymentAction === 'ADD_CARD') {
                            processSwipeCardData(response);
                        }
                        $scope.resetTime();
                        runDigestCycle();
                    },
                    'failureCallBack': function() {
                        // hide loader a 1s delay
                        $timeout(function() {
                            paymentFailureActions();
                        }, 1000);
                    }
                });
            } else {
                $scope.$emit('showLoader');
                $timeout(function() {
                    $scope.$emit('hideLoader');
                    $scope.screenMode.value = 'PAYMENT_FAILED';
                    $scope.screenMode.errorMessage = 'Use Zest station from an iPad';
                }, 2000);
            }

        };

        $scope.$on('START_MLI_CARD_COLLECTION', function() {
            var hideLoader = true;

            // hide loader till the tokenization API is called for letting user read the
            // texts on the screen.
            if ($scope.isIpad) {
                proceedWithiPadPayments(hideLoader);
            } else {
                paymentFailureActions();
            }
            runDigestCycle();
        });

        $scope.$on('ON_MOCK_CC_SWIPE', function () {
            $timeout(function() {
                $scope.$emit('hideLoader');
                processSwipeCardData(zsPaymentSrv.sampleMLISwipedCardResponse);
            }, 1000);
        });
    }
]);