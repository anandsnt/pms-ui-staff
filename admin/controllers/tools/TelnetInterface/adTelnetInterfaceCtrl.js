admin.controller('adTelnetInterfaceCtrl', ['$scope', 'adTelnetInterfaceSrv', function($scope, adTelnetInterfaceSrv){

    BaseCtrl.call(this, $scope);

    /**
     * when telnet connection success
     */
    var onTelnetConnectivitySuccess = function() {
        $scope.successMessage = ['Telnet connection successful!!'];
    };

    /**
     * when api returned failed
     */
    var onTelnetConnectivityFailure = function() {
        $scope.errorMessage = ['Telnet connection failed'];
    };

    /** when clicked on test button */
    $scope.clickedOnTestButton = function() {
        var params = {
            host: $scope.host,
            port: $scope.port
        };

        var options =  {
            params: params,
            onSuccess: onTelnetConnectivitySuccess,
            failureCallBack: onTelnetConnectivityFailure
        };
        $scope.callAPI(adTelnetInterfaceSrv.testTelnetConnectivity, options);
    };

}]);

