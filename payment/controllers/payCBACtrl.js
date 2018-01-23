angular.module('sntPay').controller('payCBACtrl',
    ['$scope', 'sntPaymentSrv', 'paymentAppEventConstants', 'paymentUtilSrv',
        'sntCBAGatewaySrv', '$log', 'sntActivity',
        function($scope, sntPaymentSrv, payEvntConst, util,
                 sntCBAGatewaySrv, $log, sntActivity) {

            /**   IMPORTANT: Plese Read the below note before you change the code in this controller 
            
             This Controller is used in Zest station also by instantiating this controller ($controller)
             
             The payment module is designed to avoid unsafe method calls from child -> parent by 
             using emitting events. So if you are using this Ctrl for communicating with your controller (parent controller),
             always use $emit events. If you have any further queries, please contact Resheil or Dilip
             
             **/
             
            
            var transaction = {
                    id: null,
                    status: null
                },
                onAddCardSuccess = function(cardDetails) {
                    var paymentData = sntCBAGatewaySrv.generateApiParams(cardDetails);

                    $scope.$emit(payEvntConst.CC_TOKEN_GENERATED, {
                        paymentData,
                        forceSaveRoutine: true
                    });
                },
                onAddCardFailure = function(err) {
                    var errorMessage = [err.RVErrorCode + " " + err.RVErrorDesc];

                    $log.error(errorMessage);
                },
                onSubmitSuccess = function(response) {
                    $log.info('doPayment Success response', response);
                    sntCBAGatewaySrv.updateTransactionSuccess(
                        transaction.id,
                        response
                    ).then(response => {
                        sntCBAGatewaySrv.finishTransaction(transaction.id);
                        $scope.$emit('hideLoader');
                        $scope.$emit('CBA_PAYMENT_SUCCESS', response.data);
                    }, errorMessage => {
                        $log.error('update to server failed...');
                        $scope.$emit('hideLoader');
                        $scope.$emit('CBA_PAYMENT_FAILED', errorMessage.data);
                    });
                },
                onSubmitFailure = function(err) {
                    /**
                     * -- err codes --
                     * 143 - The transaction failed
                     * 144 - Terminal disconnected during transaction
                     * 145 - A transaction is pending with the terminal
                     */
                    $log.warn('doPayment Failure response', err);
                    sntCBAGatewaySrv.updateTransactionFailure(
                        transaction.id,
                        err
                    ).then(() => {
                        var errorCode = parseInt(err.RVErrorCode, 10),
                            errorMessage = [err.RVErrorCode + ' ' + err.RVErrorDesc];

                        $log.warn('doPayment Failure response', errorMessage);

                        // Cannot finish the transaction if there is another pending transaction (145) or
                        // the device got disconnected (144)
                        if (errorCode !== 144 && errorCode !== 145) {
                            sntCBAGatewaySrv.finishTransaction(transaction.id);
                        }

                        $scope.$emit('CBA_PAYMENT_FAILED', errorMessage);

                        if (errorCode === 145) {
                            // NOTE: Keep the user blocked while making a call to getLastTransaction
                            var showNotifications = true;

                            sntCBAGatewaySrv.checkLastTransactionStatus(showNotifications);
                        } else {
                            $scope.$emit('hideLoader');
                        }
                    }, errorMessage => {
                        $scope.$emit('hideLoader');
                        $scope.$emit('CBA_PAYMENT_FAILED', errorMessage.data);
                    });
                },
                doPayment = function() {
                    sntCBAGatewaySrv.doPayment({
                        transaction_id: transaction.id,
                        amount: $scope.payment.amount
                    }, onSubmitSuccess, onSubmitFailure);
                },
                doRefund = function() {
                    sntCBAGatewaySrv.doRefund({
                        transaction_id: transaction.id,
                        amount: Math.abs($scope.payment.amount)
                    }, onSubmitSuccess, onSubmitFailure);
                },
                initiatePaymentProcess = function(event, params) {
                    sntActivity.start('INIT_CBA_PAYMENT');
                    if (!$scope.payment || !$scope.payment.amount) {
                        $scope.payment = $scope.payment || {};
                        $scope.payment.amount = params.postData.amount;
                    }
                    sntCBAGatewaySrv.initiateTransaction(
                        params.postData.amount,
                        params.bill_id
                    ).then(response => {
                        transaction.id = response.data.id;
                        Number(params.postData.amount) > 0 ? doPayment() : doRefund();
                        sntActivity.stop('INIT_CBA_PAYMENT');
                    }, errorMessage => {
                        $scope.$emit('hideLoader');
                        $scope.$emit('CBA_PAYMENT_FAILED', errorMessage.data);
                        sntActivity.stop('INIT_CBA_PAYMENT');
                    });
                };

            // ----------- init -------------
            (() => {
                $log.info('CBA controller init');

                // Initiate Listeners
                var listenerPayment = $scope.$on('INITIATE_CBA_PAYMENT', initiatePaymentProcess);

                var listenerAddCard = $scope.$on('INITIATE_CBA_TOKENIZATION', () => {
                    sntCBAGatewaySrv.addCard(onAddCardSuccess, onAddCardFailure);
                });

                // Cleaning listeners
                $scope.$on('$destroy', listenerPayment);
                $scope.$on('$destroy', listenerAddCard);
            })();

        }
    ]);
