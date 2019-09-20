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
                successCallBack: function (response) {
                    console.log(response);
                    $scope.$emit("HIDE_SIX_PAY_LOADER");
                },
                failureCallBack: function () {
                    $scope.state.numAttempts++;
                    $scope.errorMessage = ['UNABLE TO ADD CARD TO FILE']
                    $scope.$emit("HIDE_SIX_PAY_LOADER");
                }
            });

        };
    }
]);
