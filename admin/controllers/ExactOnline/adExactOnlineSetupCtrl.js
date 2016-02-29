admin.controller('adExactOnlineSetupCtrl', ['$scope', 'exactOnlineSetupValues', 'adExactOnlineSetupSrv',
    function($scope, exactOnlineSetupValues, adExactOnlineSetupSrv) {

        BaseCtrl.call (this, $scope);

        /**
         * when clicked on check box to enable/diable pabx
         * @return {undefiend}
         */
        $scope.toggleExactOnlineEnabled = function() {
            $scope.exactOnlineSetup.enabled = !$scope.exactOnlineSetup.enabled;
        };

        /**
         * when the save is success
         * @return {undefien
         */
        var successCallBackOfExactOnlineSetup = function(data) {
            $scope.goBackToPreviousState();
        };

        /**
         * when we clicked on save button
         * @return {undefiend}
         */
        $scope.saveExactOnlineSetup = function() {
            var params 	= {};

            if (!$scope.exactOnlineSetup.active) {
                params = _.pick($scope.exactOnlineSetup, 'active');
            } else {
                params = _.extendOwn({}, $scope.exactOnlineSetup);
            }

            var options = {
                params 			: params,
                successCallBack : successCallBackOfExactOnlineSetup
            };
            $scope.callAPI(adExactOnlineSetupSrv.saveExactOnLineConfiguration, options);
        };

        /**
         * Initialization stuffs
         * @return {undefiend}
         */
        var initializeMe = function() {
            $scope.exactOnlineSetup = exactOnlineSetupValues;
        }();
    }]);