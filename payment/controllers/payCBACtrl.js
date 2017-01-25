angular.module('sntPay').controller('payCBACtrl',
    ['$scope', 'sntPaymentSrv', 'paymentAppEventConstants', 'paymentUtilSrv', 'sntCBAGatewaySrv', '$log',
        function($scope, sntPaymentSrv, payEvntConst, util, sntCBAGatewaySrv, $log) {

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
                    $log.warn('doPayment Failure response', err);
                    sntCBAGatewaySrv.updateTransactionFailure(
                        transaction.id,
                        err
                    ).then(() => {
                        var errorMessage = [err.RVErrorCode + ' ' + err.RVErrorDesc];

                        $log.warn('doPayment Failure response', errorMessage);
                        sntCBAGatewaySrv.finishTransaction(transaction.id);
                        $scope.$emit('CBA_PAYMENT_FAILED', errorMessage);
                        $scope.$emit('hideLoader');
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
                    $scope.$emit('showLoader');
                    sntCBAGatewaySrv.initiateTransaction(
                        params.postData.amount,
                        params.bill_id
                    ).then(response => {
                        $scope.$emit('hideLoader');
                        transaction.id = response.data.id;
                        Number(params.postData.amount) > 0 ? doPayment() : doRefund();
                    }, errorMessage => {
                        $scope.$emit('hideLoader');
                        $scope.$emit('CBA_PAYMENT_FAILED', errorMessage.data);
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
