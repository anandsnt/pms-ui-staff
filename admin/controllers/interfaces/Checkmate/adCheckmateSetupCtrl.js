admin.controller('adCheckmateSetupCtrl', ['$scope', 'checkmateSetupValues', 'adCheckmateSetupSrv',
  function ($scope, checkmateSetupValues, adCheckmateSetupSrv) {
    BaseCtrl.call(this, $scope);

    /**
     * when clicked on check box to enable/diable GoMomentIvy
     * @return {undefined}
     */
    $scope.toggleCheckmateEnabled = function () {
      $scope.checkmate.enabled = !$scope.checkmate.enabled;
    };

    /**
     * when the save is success
     */
    var successCallBackOfCheckmateSetup = function (data) {
      $scope.goBackToPreviousState();
    };

    /**
     * when we clicked on save button
     * @return {undefined}
     */
    $scope.saveCheckmateSetup = function () {
      var params = {
        enabled: $scope.checkmate.enabled,
        url: $scope.checkmate.url,
        access_token: $scope.checkmate.access_token
      };
      var options = {
        params: params,
        successCallBack: successCallBackOfCheckmateSetup
      };
      $scope.callAPI(adCheckmateSetupSrv.saveCheckmateConfiguration, options);
    };

    /**
     * Initialization stuffs
     * @return {undefined}
     */
    (function () {
      $scope.checkmate = {
        enabled: checkmateSetupValues.enabled,
        url: checkmateSetupValues.url,
        access_token: checkmateSetupValues.access_token
      };
    })();
  }]);