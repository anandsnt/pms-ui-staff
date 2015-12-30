
sntRover.controller('RVWorkstationController',[
  '$scope',
  '$rootScope',
  '$filter',
  '$state',
  'ngDialog',
  'RVWorkstationSrv',
  '$timeout',
  function($scope, $rootScope, $filter, $state, ngDialog, RVWorkstationSrv, $timeout){
    BaseCtrl.call(this, $scope);

    var fetchKeyEncoderList = function() {
      var onEncodersListFetchSuccess = function(data) {
        $scope.key_encoders = data.results;
      };
      $scope.invokeApi(RVWorkstationSrv.fetchEncoders,{},onEncodersListFetchSuccess);

    };
    var fetchEmvTerminalList = function() {
      var onEmvTerminalListFetchSuccess = function(data) {
        $scope.emv_terminals = data.results;
      };
      $scope.invokeApi(RVWorkstationSrv.fetchEmvTerminals,{},onEmvTerminalListFetchSuccess);

    };

    $scope.saveWorkStation = function() { 
      var onSaveWorkstationSuccess = function(data) {
        $timeout(function(){
            ngDialog.close();
          }, 250);
      };
      
      $scope.mapping.rover_device_id = $scope.getDeviceId();
      $scope.invokeApi(RVWorkstationSrv.createWorkstation,$scope.mapping,onSaveWorkstationSuccess);

    };

    var init = function() {
      $scope.mapping = {};
      fetchKeyEncoderList();
      fetchEmvTerminalList();
    };

    init();

    
}]);