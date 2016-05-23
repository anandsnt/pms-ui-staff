admin.controller('adExactOnlineSetupCtrl', ['$scope', 'exactOnlineSetupValues', 'adExactOnlineSetupSrv',
    function ($scope, exactOnlineSetupValues, adExactOnlineSetupSrv) {

        BaseCtrl.call(this, $scope);

        /**
         * when clicked on check box to enable/diable pabx
         * @return {undefined}
         */
        $scope.toggleExactOnlineEnabled = function () {
            $scope.exactOnlineSetup.enabled = !$scope.exactOnlineSetup.enabled;
        };

        /**
         * when the save is success
         * @return {undefined}
         */
        var successCallBackOfExactOnlineSetup = function (data) {
            $scope.goBackToPreviousState();
        };

        /**
         * when we clicked on save button
         * @return {undefined}
         */
        $scope.saveExactOnlineSetup = function () {
            var params = {};

            if (!$scope.exactOnlineSetup.active) {
                params = _.pick($scope.exactOnlineSetup, 'active');
            } else {
                params = _.extendOwn({}, $scope.exactOnlineSetup);
            }

            var options = {
                params: {
                    data: {
                        "product_cross_customer": params
                    },
                    interface: "EXACTONLINE"
                },
                successCallBack: successCallBackOfExactOnlineSetup
            };
            $scope.callAPI(adExactOnlineSetupSrv.saveExactOnLineConfiguration, options);
        };

        /**
         * Initialization stuffs
         * @return {undefined}
         */
        var initializeMe = function () {
            $scope.exactOnlineSetup = exactOnlineSetupValues.data.product_cross_customer;
        }();
    }]);