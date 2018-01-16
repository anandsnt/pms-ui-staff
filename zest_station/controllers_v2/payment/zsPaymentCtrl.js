angular.module('sntZestStation').controller('zsPaymentCtrl', ['$scope', '$log', 'sntActivity', 'sntPaymentSrv', 'zsPaymentSrv', '$stateParams', 'zsStateHelperSrv', '$state', '$timeout',
    function($scope, $log, sntActivity, sntPaymentSrv, zsPaymentSrv, $stateParams, zsStateHelperSrv, $state, $timeout) {

        $scope.screenMode = {
            'value': 'PROCESS_INITIAL',
            'errorMessage': '',
            'paymentInProgress': false
        };

        $scope.makeCBAPayment = function() {
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

        var callSubmitPaymentApi = function(params) {
            $scope.callAPI(zsPaymentSrv.submitDeposit, {
                params: params,
                'successCallBack': function() {
                    $scope.screenMode.value = 'PAYMENT_SUCCESS';
                },
                'failureCallBack': function() {
                    $scope.screenMode.value = 'PAYMENT_FAILED';
                }
            });
        };

        $scope.proceedWithEMVPayment = function() {
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

            callSubmitPaymentApi(params);
        };
    }
]);