angular.module('sntRover').controller('rvDeviceStatusCtrl', ['$scope', 'ngDialog', '$log', 'sntActivity', 'rvDeviceStatusSrv',
    function ($scope, ngDialog, $log, sntActivity, rvDeviceStatusSrv) {

        var actionResponse = {};
        var callBacks = {
            'successCallBack': function (response) {
                $scope.screenMode = 'DISPLAY_MESSAGE';
                actionResponse = angular.toJson(response);
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
            $scope.actionDisplayName = device.display_name;
            sntapp.cardReader.doDeviceAction({
                service: action.service_name,
                action: action.action_name,
                successCallBack: callBacks['successCallBack'],
                failureCallBack: callBacks['failureCallBack']
            });
        };

        $scope.printReceipt = function() {
            sntapp.cardReader.doDeviceAction({
                service: 'RVDevicePlugin',
                action: 'printLastReceipt'
            });
        };

        $scope.emailReceipt = function() {
            $scope.screenMode = 'EMAIL_ENTRY';
            $scope.emailId = '';
        };

        $scope.sendEmail = function() {
            var options = {
                params: {
                    'email': $scope.emailId,
                    'message': actionResponse
                },
                successCallBack: $scope.closeThisDialog
            };

            $scope.callAPI(rvDeviceStatusSrv.sendLastReceipt, options);
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
