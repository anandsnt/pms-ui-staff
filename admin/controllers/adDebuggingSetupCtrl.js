admin.controller('adDebuggingSetupCtrl',['$scope','adDebuggingSetupSrv','$state','$filter','$stateParams',function($scope,adDebuggingSetupSrv,$state,$filter,$stateParams){

 /*
  * To retrieve previous state
  */

  $scope.errorMessage = '';
  $scope.successMessage = '';
  $scope.isLoading = true;
  $scope.selectedDevice = "";
  BaseCtrl.call(this, $scope);


  $scope.fetchDeviceDebugSetup = function(){

    var fetchDeviceDebugSetupSuccessCallback = function(data) {
        $scope.isLoading = false;
        $scope.$emit('hideLoader');
        $scope.deviceList = data;
        setDurations();
  };
  
  $scope.invokeApi(adDebuggingSetupSrv.fetchDevices, {},fetchDeviceDebugSetupSuccessCallback);

  };
  $scope.fetchDeviceDebugSetup();

  $scope.saveDebugSettings = function(){

    var saveDebugSetupSuccessCallback = function(data) {
        $scope.isLoading = false;
        $scope.$emit('hideLoader');


  };
  var unwantedKeys = ["app_version", "device_type", "logging_start_time", "logging_end_time"];
  var saveData = dclone($scope.selectedDevice, unwantedKeys);

  $scope.invokeApi(adDebuggingSetupSrv.saveSetup, saveData,saveDebugSetupSuccessCallback);

  };

  var setDurations = function(){
    _.each($scope.deviceList, function(device){
        if(device.logging_end_time != "" && device.logging_start_time != ""){
          device.hours_log_enabled = (new Date(device.logging_end_time).getTime() - new Date(device.logging_start_time).getTime())/(1000*60*60) ;
        }
    })
  }

  $scope.getDisplayTime = function(date){
    var dateObj = new Date(date)
    return dateObj.toLocaleString();
  }

  $scope.changeDuration = function(hours){
    $scope.selectedDevice.logging_start_time = new Date().toLocaleString();
    $scope.selectedDevice.logging_end_time = new Date(new Date().getTime() + (hours * 1000 *60 *60)).toLocaleString();
  }

  $scope.selectDevice = function(event, device){
    if($scope.selectedDevice !== "" && $scope.selectedDevice.device_uid == device.device_uid)
      $scope.selectedDevice = "";
    else
      $scope.selectedDevice = device;
  }

  var setHoursList = function(){
    $scope.hours = [];
    for(var i = 1; i < 25; i++){
      var hour = {'name': i, 'value':i};
      $scope.hours.push(hour);
    } 
  };
  setHoursList();

  }]);