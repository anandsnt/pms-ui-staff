admin.controller('ADEmvTerminalDetailsCtrl', ['$scope', '$rootScope', 'ADEmvTerminalsSrv', '$state', '$stateParams', '$timeout', 'ngDialog',
    function ($scope, $rootScope, ADEmvTerminalsSrv, $state, $stateParams, $timeout, ngDialog) {
        /*
        * Controller class for Room List
        */
        var pinpadCommandsRequiringConfirmation = ['RESETPINPAD', 'PPREBOOT', 'PPRESET'];

        $scope.errorMessage = '';
        $scope.mod = 'edit';

        // inheriting from base controller
        BaseCtrl.call(this, $scope);

        $scope.itemDetails = {};
        $scope.itemDetails.name = '';
        $scope.itemDetails.terminal_identifier = '';
        $scope.itemDetails.terminal_access_code = '';
        $scope.mliEmvEnabled = $rootScope.mliEmvEnabled;

        var itemId = $stateParams.itemid;
        // if itemid is null, means it is for add item form

        if (!itemId) {
            $scope.mod = 'add';
        }

        var fetchSuccessOfItemDetails = function (data) {
            $scope.$emit('hideLoader');
            $scope.itemDetails = data;
        };

        var fetchFailedOfItemDetails = function (errorMessage) {
            $scope.$emit('hideLoader');
            $scope.errorMessage = errorMessage;
        };

        var promptConfirmation = function () {
            ngDialog.open({
                template: '/assets/partials/emvTerminals/adEMVPinpadCommandWarning.html',
                scope: $scope,
                class: '',
                closeByDocument: true
            });
        };

        if ($scope.mod === 'edit') {
            $scope.invokeApi(ADEmvTerminalsSrv.getItemDetails, {'item_id': itemId}, fetchSuccessOfItemDetails, fetchFailedOfItemDetails);
        }

        $scope.goBack = function () {
            $state.go('admin.emvTerminals');
        };

        $scope.saveItemDetails = function () {
            var postData = {};

            if ($scope.mod === 'edit') {
                postData.id = $scope.itemDetails.id;
            }

            postData.name = $scope.itemDetails.name;
            postData.terminal_identifier = $scope.itemDetails.terminal_identifier;
            postData.terminal_access_code = $scope.itemDetails.terminal_access_code;

            var fetchSuccessOfSaveItemDetails = function () {
                $timeout(function () {
                    $scope.goBack();
                }, 3000);
            };

            if ($scope.mod === 'edit') {
                $scope.invokeApi(ADEmvTerminalsSrv.updateItemDetails, postData, fetchSuccessOfSaveItemDetails);
            }
            else {
                $scope.invokeApi(ADEmvTerminalsSrv.saveItemDetails, postData, fetchSuccessOfSaveItemDetails);
            }
        };

        $scope.runTerminalCommand = function (confirmedFromDialog) {
            if (!confirmedFromDialog &&
                pinpadCommandsRequiringConfirmation.indexOf($scope.selectedTerminalCommand) >= 0) {
                promptConfirmation();
                return;
            }

            if (confirmedFromDialog) {
                ngDialog.close();
            }

            $scope.pinpadData = {};

            $scope.callAPI(ADEmvTerminalsSrv.runTerminalCommand, {
                params: {
                    terminalId: $scope.itemDetails.id,
                    command: $scope.selectedTerminalCommand
                },
                successCallBack: function (data) {
                    var pinpadRequest = data.request || '',
                        pinpadResponse = data.response || '';

                    $scope.pinpadData = {
                        request: pinpadRequest,
                        response: pinpadResponse,
                        isSuccess: data.message === 'SUCCESS'
                    };
                }
            });
        };

        (function () {
            $scope.selectedTerminalCommand = '';
            $scope.pinpadData = {};
        })();

    }]);
