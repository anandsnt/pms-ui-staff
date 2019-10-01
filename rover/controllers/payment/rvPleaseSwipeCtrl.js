sntRover.controller('RVPleaseSwipeCtrl', ['$rootScope', '$scope', 'sntPaymentSrv',
    function ($rootScope, $scope, sntPaymentSrv) {
        BaseCtrl.call(this, $scope);

        $scope.state = {
            numAttempts: 0
        };

        $scope.addCardOWS = function () {
            $scope.$emit("SHOW_SIX_PAY_LOADER");

            $scope.callAPI(sntPaymentSrv.getSixPaymentToken, {
                params: {
                    reservation_id: $scope.reservationBillData.reservation_id,
                    workstation_id: $scope.workstation_id
                },
                successCallBack: function () {
                    $scope.$emit('REFRESH_BILLCARD_VIEW');
                    $scope.$emit("HIDE_SIX_PAY_LOADER");
                    $scope.closeDialog();
                },
                failureCallBack: function (err) {
                    $scope.state.numAttempts++;
                    $scope.errorMessage = err;
                    $scope.$emit("HIDE_SIX_PAY_LOADER");
                }
            });

        };
    }
]);
