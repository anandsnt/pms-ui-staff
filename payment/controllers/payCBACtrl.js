angular.module('sntPay').controller('payCBACtrl',
    ['$scope', 'sntPaymentSrv', 'paymentAppEventConstants', 'paymentUtilSrv', 'sntCBAGatewaySrv',
        function($scope, sntPaymentSrv, payEvntConst, util, sntCBAGatewaySrv) {

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
                    console.log(errorMessage);
                },
                onSubmitSuccess = function(response) {
                    sntCBAGatewaySrv.updateTransactionSuccess(
                        transaction.id,
                        response
                    ).then(response => {
                        $scope.$emit("hideLoader");
                        $scope.$emit("CBA_PAYMENT_SUCCESS", response.data);
                    }, errorMessage => {
                        $scope.$emit("hideLoader");
                        $scope.$emit("CBA_PAYMENT_FAILED", errorMessage.data);
                    })
                },
                onSubmitFailure = function(err) {
                    sntCBAGatewaySrv.updateTransactionFailure(
                        transaction.id,
                        err
                    ).then(() => {
                        $scope.$emit("hideLoader");
                        var errorMessage = [err.RVErrorCode + " " + err.RVErrorDesc];
                        $scope.$emit("CBA_PAYMENT_FAILED", errorMessage);
                    }, errorMessage => {
                        $scope.$emit("hideLoader");
                        $scope.$emit("CBA_PAYMENT_FAILED", errorMessage.data);
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
                    $scope.$emit("showLoader");
                    sntCBAGatewaySrv.initiateTransaction(
                        params.postData.amount,
                        params.bill_id
                    ).then(response => {
                        $scope.$emit("hideLoader");
                        transaction.id = response.data.id;
                        Number(params.postData.amount) > 0 ? doPayment() : doRefund();
                    }, errorMessage => {
                        $scope.$emit("hideLoader");
                        $scope.$emit("CBA_PAYMENT_FAILED", errorMessage.data);
                    });
                };

            // ----------- init -------------
            (() => {
                console.log("CBA controller init");

                // Initiate Listeners
                var listenerPayment = $scope.$on("INITIATE_CBA_PAYMENT", initiatePaymentProcess);

                var listenerAddCard = $scope.$on("INITIATE_CBA_TOKENIZATION", ()=> {
                    sntCBAGatewaySrv.addCard(onAddCardSuccess, onAddCardFailure);
                });

                // Cleaning listeners
                $scope.$on("$destroy", listenerPayment);
                $scope.$on("$destroy", listenerAddCard);
            })();

        }
    ]);