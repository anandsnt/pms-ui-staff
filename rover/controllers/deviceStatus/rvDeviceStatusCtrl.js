angular.module('sntRover').controller('rvDeviceStatusCtrl', ['$scope', 'ngDialog', '$log', 'sntActivity',
    function ($scope, ngDialog, $log, sntActivity) {

        var callBacks = {
            'successCallBack': function (response) {
                ngDialog.open({
                    template: '/assets/partials/settings/rvDeviceMessage.html',
                    scope: $scope,
                    className: '',
                    data: angular.toJson(response)
                });
                sntActivity.stop('RUN_DEVICE_ACTION');
            },
            'failureCallBack': function (error) {
                $log.info('Device action failed with', error.RVErrorCode);

                $scope.errorMessage = [error.RVErrorDesc];
                sntActivity.stop('RUN_DEVICE_ACTION');
            }
        };

        $scope.clearErrorMessage = function () {
            $scope.errorMessage = '';
        };

        $scope.onExecuteAction = function (device) {
            var action = _.find(device.actions, {action_name: device.selectedAction});

            $scope.errorMessage = '';
            if (!action) {
                return;
            }
            sntActivity.start('RUN_DEVICE_ACTION');
            sntapp.cardReader.doDeviceAction({
                service: action.service_name,
                action: action.action_name,
                successCallBack: callBacks['successCallBack'],
                failureCallBack: callBacks['failureCallBack']
            });
        };

        (function () {
            $scope.clearErrorMessage();
            $scope.setScroller('deviceMessage', {
                snap: false,
                scrollbars: 'custom',
                hideScrollbar: false,
                click: false,
                scrollX: false,
                scrollY: true,
                preventDefault: true,
                interactiveScrollbars: true,
                preventDefaultException: {tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|A)$/}
            });
        })();
    }
]);
