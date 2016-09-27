angular.module('sntPay').controller('payCreateARPopupCtrl', ['$scope', 'sntPaymentSrv', '$timeout',
    function($scope, sntPaymentSrv, $timeout) {

        $scope.ar_number = "";
        $scope.errorMessage = "";
        $scope.showARNumberInput = false;

        $scope.onClickCreate = function() {
            if (!!$scope.ngDialogData.is_auto_assign_ar_numbers) {
                $scope.createAccountReceivable(true);
            }
            else {
                $scope.showARNumberInput = true;
            }
        };

        $scope.createAccountReceivable = function(isAutoAssignARNumber) {
            sntPaymentSrv.saveARDetails({
                id: $scope.ngDialogData.account_id,
                ar_number: isAutoAssignARNumber ? "" : $scope.ar_number,
                workstation_id: $scope.hotelConfig.workstationId
            }).then(data => {
                $scope.$emit("hideLoader");
                $scope.$emit("NEW_AR_ACCOUNT_CREATED", {
                    response: data,
                    params: $scope.ngDialogData
                });
                $timeout($scope.closeThisDialog, 300);
            }, errorMessage => {
                $scope.$emit("hideLoader");
                $scope.errorMessage = errorMessage;
            });
        };

        $scope.cancelButtonClick = function() {
            $scope.errorMessage = "";
            $scope.showARNumberInput = false;
        };

    }]);