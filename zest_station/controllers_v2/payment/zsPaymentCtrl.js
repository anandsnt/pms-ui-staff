angular.module('sntZestStation').controller('zsPaymentCtrl', ['$scope', '$log', 'sntActivity', 'sntPaymentSrv', 'zsPaymentSrv', '$stateParams', 'zsStateHelperSrv', '$state', '$timeout',
    function($scope, $log, sntActivity, sntPaymentSrv, zsPaymentSrv, $stateParams, zsStateHelperSrv, $state, $timeout) {

        $scope.screeMode = {'value' : 'PROCESS_INITIAL'};

        $scope.makeCBAPayment = function() {
            $scope.$emit('showLoader');
            $scope.$broadcast('INITIATE_CBA_PAYMENT', zsPaymentSrv.getSubmitPaymentParams());
        };
        /**
         * Method to initate listeners that handle CBA payment scenarios
         * @returns {undefined} undefined
         */
        $scope.initiateCBAlisteners = function () {
            var listenerCBAPaymentFailure = $scope.$on('CBA_PAYMENT_FAILED', function(event, errorMessage) {
                $log.warn(errorMessage);
                $scope.$emit('hideLoader');
                $scope.screeMode.value = 'PROCESS_FAILED';
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
                    function(response) {
                        $scope.$broadcast('PAYMENT_SUCCESS');
                        $scope.$emit('hideLoader');
                    },
                    function(errorMessage) {
                        $log.warn(errorMessage);
                        $scope.$emit('hideLoader');
                        $scope.screeMode.value = 'PROCESS_FAILED';
                    }
                );
            });

            var listenerUpdateErrorMessage = $scope.$on('UPDATE_NOTIFICATION', function(event, response) {
                $log.warn(response);
                $scope.$emit('hideLoader');
                $scope.screeMode.value = 'PROCESS_FAILED';
                // TODO : Handle Error here!
            });

            $scope.$on('$destroy', listenerCBAPaymentFailure);
            $scope.$on('$destroy', listenerCBAPaymentSuccess);
            $scope.$on('$destroy', listenerUpdateErrorMessage);
        }

        $scope.reTryCardSwipe = function() {
            $scope.screeMode.value = 'PROCESS_IN_PROGRESS';
            if ($scope.zestStationData.paymentGateway === 'CBA' && $scope.isIpad) {
                $scope.makeCBAPayment();
            } else {
                $scope.screeMode.value = 'PROCESS_FAILED';
            }
        };
    }
]);