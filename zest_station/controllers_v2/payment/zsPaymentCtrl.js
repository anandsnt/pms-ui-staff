angular.module('sntZestStation').controller('zsPaymentCtrl', ['$scope', '$log', 'sntActivity', 'sntPaymentSrv', 'zsPaymentSrv', '$stateParams', 'zsStateHelperSrv', '$state', '$filter', 'zsGeneralSrv', '$timeout', '$controller',
    function($scope, $log, sntActivity, sntPaymentSrv, zsPaymentSrv, $stateParams, zsStateHelperSrv, $state, $filter, zsGeneralSrv, $timeout, $controller) {

        $scope.screenMode = {
            'value': 'PROCESS_INITIAL',
            'errorMessage': '',
            'paymentInProgress': false,
            'isUsingExistingCardPayment': false
        };

        var runDigestCycle = function() {
            if (!$scope.$$phase) {
                $scope.$digest();
            }
        };

        /**  ***************************** CBA **************************************/

        if ($scope.zestStationData.paymentGateway === 'CBA') {
            $controller('payCBACtrl', {
                $scope: $scope
            });
        }
        var makeCBAPayment = function() {
            $scope.$emit('showLoader');
            $scope.screenMode.errorMessage = '';
            $scope.screenMode.paymentInProgress = true;
            $scope.$broadcast('INITIATE_CBA_PAYMENT', zsPaymentSrv.getSubmitPaymentParams());
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

        /**
         * Method to initate listeners that handle CBA payment scenarios
         * @returns {undefined} undefined
         */
        $scope.initiateCBAlisteners = function () {
            var listenerCBAPaymentFailure = $scope.$on('CBA_PAYMENT_FAILED', function(event, errorMessage) {
                $log.warn(errorMessage);
                showErrorMessage(errorMessage);
                $scope.$emit('hideLoader');
                $scope.screenMode.paymentInProgress = false;
                $scope.screenMode.value = 'PAYMENT_FAILED';
                // TODO : Handle Error here!
            });

            var listenerCBAPaymentSuccess = $scope.$on('CBA_PAYMENT_SUCCESS', function(event, response) {
                var params = zsPaymentSrv.getSubmitPaymentParams();


                // we need to notify the parent controllers to show loader
                // as this is an external directive
                $scope.$emit('showLoader');
                params.postData.payment_type_id = response.payment_method_id;
                params.postData.credit_card_transaction_id = response.id;
                sntPaymentSrv.submitPayment(params).then(
                    function() {
                        $scope.$broadcast('PAYMENT_SUCCESS');
                        $scope.$emit('hideLoader');
                    },
                    function(errorMessage) {
                        $log.warn(errorMessage);
                        showErrorMessage(errorMessage);
                        $scope.$emit('hideLoader');
                        $scope.screenMode.paymentInProgress = false;
                        $scope.screenMode.value = 'PAYMENT_FAILED';
                    }
                );
            });

            var listenerUpdateErrorMessage = $scope.$on('UPDATE_NOTIFICATION', function(event, response) {
                $log.warn(response);
                showErrorMessage(response);
                $scope.$emit('hideLoader');
                $scope.screenMode.paymentInProgress = false;
                $scope.screenMode.value = 'PAYMENT_FAILED';
                // TODO : Handle Error here!
            });

            $scope.$on('$destroy', listenerCBAPaymentFailure);
            $scope.$on('$destroy', listenerCBAPaymentSuccess);
            $scope.$on('$destroy', listenerUpdateErrorMessage);
        };


        var callSubmitPaymentApi = function(params, loader) {
            $scope.screenMode.paymentInProgress = true;
            $scope.callAPI(zsPaymentSrv.submitDeposit, {
                params: params,
                'successCallBack': function() {
                    $scope.$emit('hideLoader');
                    $scope.screenMode.value = 'PAYMENT_SUCCESS';
                    $scope.screenMode.paymentInProgress = false;
                    runDigestCycle();
                },
                'failureCallBack': function() {
                    $scope.$emit('hideLoader');
                    $scope.screenMode.paymentInProgress = false;
                    $scope.screenMode.value = 'PAYMENT_FAILED';
                    runDigestCycle();
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
                    $scope.$emit('hideLoader');
                    $scope.screenMode.value = 'PAYMENT_FAILED';
                    $scope.screenMode.errorMessage = 'Use Zest station from an iPad';
                }, 2000);
            }
        };

        $scope.payUsingNewCard = function() {
            $scope.screenMode.value = 'PAYMENT_IN_PROGRESS';
            $scope.screenMode.isUsingExistingCardPayment = false;
            if ($scope.zestStationData.paymentGateway === 'CBA' && $scope.isIpad) {
                $scope.startCBAPayment();
            } else if (($scope.zestStationData.paymentGateway === 'MLI' && $scope.zestStationData.mliEmvEnabled) || 
            $scope.zestStationData.paymentGateway === 'sixpayments') {            // for EMV start sending request to terminal
                        // add 4 seconds delay for the screen to show the activity indicator
                        proceedWithEMVPayment();
            } else if ($scope.zestStationData.paymentGateway === 'MLI' && $scope.zestStationData.ccReader === 'websocket') {
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
            } else if ($scope.zestStationData.paymentGateway === 'MLI' && $scope.zestStationData.ccReader === 'local') {
                proceedWithiPadPayments();
            } else {
                $scope.$emit('showLoader');
                $timeout(function() {
                    $scope.$emit('hideLoader');
                    $scope.screenMode.value = 'PAYMENT_FAILED';
                    $scope.screenMode.errorMessage = 'Please check your settings and device connections';
                }, 2000);
            }
        };
        /**  *************************** EMV **********************************/

        var proceedWithEMVPayment = function() {
            var params = {
                    'is_emv_request': true,
                    'reservation_id': $scope.reservation_id,
                    'add_to_guest_card': false,
                    'amount': $scope.balanceDue,
                    'bill_number': 1,
                    'payment_type': 'CC'
                };

            callSubmitPaymentApi(params);
        };

        $scope.payUsingExistingCard = function() {
            var params = {
                    'is_emv_request': false,
                    'reservation_id': $scope.reservation_id,
                    'add_to_guest_card': false,
                    'amount': $scope.balanceDue,
                    'bill_number': 1,
                    'payment_type': 'CC',
                    'payment_type_id': $scope.cardDetails.id
                };
                
           $scope.screenMode.isUsingExistingCardPayment = true;

            callSubmitPaymentApi(params);
        };

        /**  *********************** DESKTOP SWIPE ********************************/

        var observeForDesktopSwipe = function () {
            $scope.socketOperator.observe();
        };

        $scope.listenUserActivity = function () {
            $scope.$on('USER_ACTIVITY_TIMEOUT', function() {
                $scope.$emit('hideLoader');
                $scope.screenMode.errorMessage = $filter('translate')('CC_SWIPE_TIMEOUT_SUB');
                $scope.screenMode.value = 'PAYMENT_FAILED';
            });
        };

        var processSwipeCardData = function(swipedCardData) {
            var swipeOperationObj = new SwipeOperation();
            var params = swipeOperationObj.createDataToTokenize(swipedCardData);

            $log.info('fetching token...from tokenize...');
            $scope.callAPI(zsGeneralSrv.tokenize, {
                params: params,
                'successCallBack': function(response) {
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
                        "amount": $scope.balanceDue,
                        "bill_number": 1
                    };

                    callSubmitPaymentApi(data);
                },
                'failureCallBack': function() {
                    $scope.screenMode.value = 'PAYMENT_FAILED';
                }
            });
        };

        $scope.$on('SWIPE_ACTION', function (evt, response) {
            processSwipeCardData(response);
            $scope.$emit('hideLoader');
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
            runDigestCycle();
        });

        /**  *********************** Ipad device actions ********************************/

        var proceedWithiPadPayments = function() {
            if ($scope.inDemoMode()) {
                processSwipeCardData(zsPaymentSrv.sampleMLISwipedCardResponse);
            }
            // show error if the device is not iPad
            else if ($scope.isIpad) {
                $scope.$emit('showLoader');
                $scope.cardReader.startReader({
                    'successCallBack': function(response) {
                        processSwipeCardData(response);
                        runDigestCycle();
                    },
                    'failureCallBack': function(err) {
                        // hide loader a 1s delay
                        $timeout(function() {
                            $scope.screenMode.value = 'PAYMENT_FAILED';
                            $scope.screenMode.errorMessage = 'Oh no';
                            $scope.$emit('hideLoader');
                            runDigestCycle();
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
    }
]);