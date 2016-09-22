admin.controller('adDebuggingSetupCtrl',['$scope','adDebuggingSetupSrv','$state','$filter','$stateParams', 'ngTableParams',function($scope,adDebuggingSetupSrv,$state,$filter,$stateParams, ngTableParams){

 /*
  * To retrieve previous state
  */

  $scope.errorMessage = '';
  $scope.successMessage = '';
  $scope.isLoading = true;
  $scope.selectedDevice = "";
  $scope.selectedIndex = "";
  $scope.searchText = "";
  BaseCtrl.call(this, $scope);


  $scope.sortByName = function(){
      if($scope.selectedDevice === "") {
        $scope.tableParams.sorting({'device_name' : $scope.tableParams.isSortBy('device_name', 'asc') ? 'desc' : 'asc'});
      }
  };
  $scope.sortByUser = function(){
      if($scope.selectedDevice === "") {
        $scope.tableParams.sorting({'last_logged_in_user' : $scope.tableParams.isSortBy('last_logged_in_user', 'asc') ? 'desc' : 'asc'});
      }
  };
  $scope.sortByDevice = function(){
      if($scope.selectedDevice === "") {
        $scope.tableParams.sorting({'device_type' : $scope.tableParams.isSortBy('device_type', 'asc') ? 'desc' : 'asc'});
    }
  };

  $scope.filterDevices = function(value, index, array){
      if($scope.searchText == '')
        return true;
      var searchRegExp = new RegExp($scope.searchText.toLowerCase());
      // if(value.device_name != undefined && value.device_name != null && value.device_name != "")
      //   return searchRegExp.test(value.device_uid.toLowerCase()) || searchRegExp.test(value.device_name.toLowerCase()) || searchRegExp.test(value.application.toLowerCase()) || searchRegExp.test(value.device_type.toLowerCase()) || searchRegExp.test(value.device_version.toLowerCase());
      // else if(value.device_version != undefined && value.device_version != null && value.device_version != "")
      //   return searchRegExp.test(value.device_uid.toLowerCase()) || searchRegExp.test(value.application.toLowerCase()) || searchRegExp.test(value.device_type.toLowerCase()) || searchRegExp.test(value.device_version.toLowerCase());
      // else
      //   return searchRegExp.test(value.device_uid.toLowerCase()) || searchRegExp.test(value.application.toLowerCase()) || searchRegExp.test(value.device_type.toLowerCase());
   
      for(var key in value) {
        if(value[key] != null && value[key] != "" && typeof value[key] == 'string' && searchRegExp.test((value[key]).toLowerCase())){
            return true;
        }
      }
      return false;

   };

  $scope.fetchDeviceDebugSetup = function(){

    var fetchDeviceDebugSetupSuccessCallback = function(data) {
        $scope.isLoading = false;
        $scope.$emit('hideLoader');
        $scope.deviceList = data;
        setDurations();
        // REMEMBER - ADDED A hidden class in ng-table angular module js. Search for hidde or pull-right
        $scope.tableParams = new ngTableParams({
          // show first page
          page: 1,
          // count per page - Need to change when on pagination implemntation
          count: $scope.deviceList.length,
          sorting: {
            // initial sorting
            device_name: 'asc'
          }
        }, {
          // length of data
          total: $scope.deviceList.length,
          getData: function ($defer, params)
          {
            if (params.settings().$scope == null) {
              params.settings().$scope = $scope;
            };
            // use build-in angular filter
            var orderedData = params.sorting() ?
              $filter('orderBy')($scope.deviceList, params.orderBy()) :
              $scope.deviceList;
            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
          }
        });
        $scope.tableParams.reload();
  };
  
  $scope.invokeApi(adDebuggingSetupSrv.fetchDevices, {},fetchDeviceDebugSetupSuccessCallback);

  };
  $scope.fetchDeviceDebugSetup();

  $scope.saveDebugSettings = function(){

    var saveDebugSetupSuccessCallback = function(data) {
        $scope.isLoading = false;
        $scope.$emit('hideLoader');
        $scope.deviceList[$scope.selectedIndex] = $scope.selectedDevice;
        $scope.selectedDevice = "";
        $scope.selectedIndex = "";
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

  $scope.selectDevice = function(event, device, index){
    if($scope.selectedDevice !== "" && $scope.selectedDevice.device_uid == device.device_uid){
      $scope.selectedDevice = "";
      $scope.selectedIndex = "";
    }else{
      $scope.selectedIndex = index;
      $scope.selectedDevice = device;
      $scope.selectedDevice.hours_log_enabled = $scope.selectedDevice.hours_log_enabled == "" ? 4 : $scope.selectedDevice.hours_log_enabled;
    }
      
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