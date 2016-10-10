angular.module('sntPay').controller('payCBACtrl',
    ['$scope', 'sntPaymentSrv', 'paymentAppEventConstants', 'paymentUtilSrv', 'sntCBAGatewaySrv',
        function($scope, sntPaymentSrv, payEvntConst, util, sntCBAGatewaySrv) {

            var transaction = {
                    id: null,
                    status: null
                },
                onSubmitSuccess = response => {
                    console.log("onSubmitSuccess", response);
                },
                onSubmitFailure = err => {
                    sntCBAGatewaySrv.updateTransactionFailure(
                        transaction.id,
                        err
                    ).then(response => {
                        $scope.$emit("hideLoader");
                        console.log(response);
                        var errorMessage = [err.RVErrorCode + " " + err.RVErrorDesc];
                        $scope.$emit("CBA_PAYMENT_FAILED", errorMessage);
                    }, errorMessage => {
                        $scope.$emit("hideLoader");
                        console.log(errorMessage);
                        $scope.$emit("CBA_PAYMENT_FAILED", errorMessage);
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
                        amount: $scope.payment.amount
                    }, onSubmitSuccess, onSubmitFailure);
                },
                initiatePaymentProcess = function(event, params) {
                    $scope.$emit("showLoader");
                    sntCBAGatewaySrv.initiateTransaction(
                        params.postData.amount,
                        params.bill_id
                    ).then(id => {
                        $scope.$emit("hideLoader");
                        transaction.id = id;
                        Number(params.postData.amount) > 0 ? doPayment() : doRefund();
                    }, errorMessage => {
                        $scope.$emit("hideLoader");
                        console.log(errorMessage);
                    });
                };

            // ----------- init -------------
            (() => {
                console.log("CBA controller init");

                // Initiate Listeners
                var listenerPayment = $scope.$on("INITIATE_CBA_PAYMENT", initiatePaymentProcess);

                // Cleaning listeners
                $scope.$on("$destroy", listenerPayment);
            })();

        }
    ]);