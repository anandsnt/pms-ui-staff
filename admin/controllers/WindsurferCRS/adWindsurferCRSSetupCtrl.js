admin.controller('adWindsurferCRSSetupCtrl', ['$scope', 'windsurferCRSSetupValues', 'adWindsurferCRSSetupSrv', '$timeout',
    function($scope, windsurferCRSSetupValues, adWindsurferCRSSetupSrv, $timeout) {

        BaseCtrl.call (this, $scope);

        /**
         * when clicked on check box to enable/diable pabx
         * @return {undefiend}
         */
        $scope.toggleWindsurferCRSEnabled = function() {
            $scope.windsurferSetup.enabled = !$scope.windsurferSetup.enabled;
        };

        /**
         * when the save is success
         * @return {undefien
         */
        var successCallBackOfWindsurferCRSSetup = function(data) {
            $scope.goBackToPreviousState();
        };

        /**
         * when we clicked on save button
         * @return {undefiend}
         */
        $scope.saveWindsurferCRSSetup = function() {
            var params 	= {};

            if (!$scope.windsurferSetup.enabled) {
                params.windsurfer = _.pick($scope.windsurferSetup, 'enabled');
            } else {
                params.windsurfer = _.extendOwn({}, $scope.windsurferSetup);
            }

            var options = {
                params 			: params,
                successCallBack : successCallBackOfWindsurferCRSSetup
            };
            $scope.callAPI(adWindsurferCRSSetupSrv.saveWindsurferCRSConfiguration, options);
        };

        /**
         * Initialization stuffs
         * @return {undefiend}
         */
        var initializeMe = function() {
            $scope.windsurferSetup = windsurferCRSSetupValues;
        }();
    }]);