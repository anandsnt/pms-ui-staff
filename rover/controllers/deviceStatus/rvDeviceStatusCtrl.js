angular.module('sntRover').controller('rvDeviceStatusCtrl', ['$scope', 'ngDialog', '$log', 'sntActivity', 'rvDeviceStatusSrv', 'rvUtilSrv',
    function ($scope, ngDialog, $log, sntActivity, rvDeviceStatusSrv, rvUtilSrv) {

        var actionResponse = {};
        var callBacks = {
            'successCallBack': function (response) {
                actionResponse = response;
                $scope.screenMode = 'DISPLAY_MESSAGE';
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
            $scope.actionDisplayName = action.display_name;
        };

        $scope.printReceipt = function() {
            $scope.$emit('showLoader');
            sntapp.cardReader.doDeviceAction({
                service: 'RVCardPlugin',
                action: 'printLastReceipt',
                successCallBack: function() {
                    $scope.$emit('hideLoader');
                },
                failureCallBack: function() {
                    $scope.$emit('hideLoader');
                }
            });
        };

        $scope.emailReceipt = function() {
            $scope.screenMode = 'EMAIL_ENTRY';
            $scope.screenData.emailId = '';
        };

        $scope.isEmailValid = function() {
            return rvUtilSrv.isEmailValid($scope.screenData.emailId);
        };

        $scope.sendEmail = function() {
            var options = {
                params: {
                    'email': $scope.screenData.emailId,
                    'message': actionResponse.message
                },
                successCallBack: function() {
                    $scope.screenMode = 'DISPLAY_MESSAGE';
                }
            };

            $scope.callAPI(rvDeviceStatusSrv.sendLastReceipt, options);
        };

        (function () {
            $scope.screenMode = 'DISPLAY_MESSAGE';
            $scope.screenData = {
                'emailId': ''
            };
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
