sntRover.controller('rvDeviceStatusCtrl', ['$scope', 'ngDialog',
    function ($scope, ngDialog) {

        var callBacks = {
            'successCallBack': function (response) {
                console.log(response);
                ngDialog.open({
                    template: '/assets/partials/settings/rvDeviceMessage.html',
                    scope: $scope,
                    className: '',
                    data: angular.toJson(response)
                });
            },
            'failureCallBack': function (errorMessage) {
                $scope.errorMessage = errorMessage;
            }
        };

        $scope.print = function (message) {
            console.log(message);
        };

        $scope.onExecuteAction = function (device) {
            console.log('onExecuteAction', device);

            if (device.selectedAction === 'getLastReceipt') {
                sntapp.cardReader.getLastReceipt(callBacks);
            }

        };
    }
]);
