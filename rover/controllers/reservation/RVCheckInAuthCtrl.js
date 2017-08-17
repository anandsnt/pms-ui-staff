angular.module('sntRover').controller('RVCheckInAuthCtrl', ['$scope', '$log', 'RVCCAuthorizationSrv', 'rvPermissionSrv',
    function ($scope, $log, RVCCAuthorizationSrv, rvPermissionSrv) {

        var authorize = function () {
            var params = {};

            // CICO-43933
            if ($scope.checkInState.swipedCardData) {
                params = angular.copy($scope.checkInState.swipedCardData);
            }

            $scope.callAPI(RVCCAuthorizationSrv.manualAuthorization, {
                params: _.extend(params, {
                    is_emv_request: $scope.ngDialogData.is_emv_request,
                    amount: $scope.ngDialogData.amount || 0,
                    payment_method_id: $scope.ngDialogData.payment_method_id,
                    reservation_id: $scope.ngDialogData.reservation_id
                }),
                successCallBack: function (response) {
                    $scope.authResponse = response;
                    $scope.authState = 'SUCCESS';
                },
                failureCallBack: function (response) {
                    $scope.authResponse = response;
                    $scope.authState = 'FAILURE';
                }
            });
        };

        $scope.onClickContinue = function () {
            $scope.$emit('CONTINUE_CHECKIN', $scope.authResponse);
        };

        $scope.onClickContinueWithoutCC = function () {
            $scope.$emit('CONTINUE_CHECKIN', $scope.authResponse);
        };

        $scope.cancelAuthProcess = function () {
            $scope.$emit('STOP_CHECKIN_PROCESS');
        };

        (function () {
            $scope.authState = 'IN_PROGRESS';
            $scope.authResponse = {};
            $scope.canCheckInWithoutCC = rvPermissionSrv.getPermissionValue('OVERRIDE_CC_AUTHORIZATION');
            authorize();
        })();
    }
]);
