admin.controller('adCheckmateSetupCtrl', ['$scope', 'checkmateSetupValues', 'adCheckmateSetupSrv',
    function($scope, checkmateSetupValues, adCheckmateSetupSrv){

    BaseCtrl.call (this, $scope);

    /**
     * when clicked on check box to enable/diable GoMomentIvy
     * @return {undefined}
     */
    $scope.toggleCheckmateEnabled = function() {
        $scope.checkmate.enabled = !$scope.checkmate.enabled;
    };

    /**
     * when the save is success
     */
    var successCallBackOfCheckmateSetup = function(data) {
        $scope.goBackToPreviousState();
    };

    /**
     * when we clicked on save button
     * @return {undefined}
     */
    $scope.saveCheckmateSetup = function() {
        var params 	= {
            checkmate: $scope.checkmate.enabled ? $scope.checkmate : _.pick($scope.checkmate, 'enabled')
        };
        var options = {
            params 			: params,
            successCallBack : successCallBackOfCheckmateSetup
        };
        $scope.callAPI(adCheckmateSetupSrv.saveCheckmateConfiguration, options);
    };

    /**
     * Initialization stuffs
     * @return {undefined}
     */
    (function() {
        $scope.checkmate = checkmateSetupValues;
    })();

}]);