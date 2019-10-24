admin.controller('ADDevicesListCtrl', ['$scope', '$state', 'ngTableParams', 'adDebuggingSetupSrv', '$timeout', 'appTypes',
  function($scope, $state, ngTableParams, adDebuggingSetupSrv, $timeout, appTypes) {

    ADBaseTableCtrl.call(this, $scope, ngTableParams);

    $scope.fetchTableData = function($defer, params) {
      var getParams = $scope.calculateGetParams(params);

      getParams.service_application_type_id = angular.copy(getParams.rate_type_id);
      getParams.sort_dir = getParams.sort_dir ? "asc" : "desc";
      delete getParams.rate_type_id;
      
      var findServiceType = function(device) {
        var serviceType = _.find($scope.filterList, function(filter) {
          return device.service_application_type_id === filter.id;
        });
        
        return serviceType;
      };
      
      var fetchSuccessOfItemList = function(data) {
        $timeout(function() {
          // No expanded rate view
          $scope.currentClickedElement = -1;
          $scope.totalCount = data.total_count;
          $scope.totalPage = Math.ceil(data.total_count / $scope.displyCount);
          _.each(data.results, function(device, index) {
            if (device.logging_end_time !== "" && device.logging_start_time !== "") {
              device.hours_log_enabled = (new Date(device.logging_end_time).getTime() - new Date(device.logging_start_time).getTime()) / (1000 * 60 * 60);
            }

            // set build status
            if (_.indexOf(_.pluck(appTypes, 'id'), device.service_application_type_id) === -1) {
              // if the service type not registered
              device.build_status = 'N/A';
            } else if (device.build_status !== 'FAILED' && device.app_version !== findServiceType(device).latest_build) {
              // if the service upgrade version is not latest and upgrade didn't failed
              device.build_status = 'PENDING';
              device.service_type = findServiceType(device).value;
            } else if (device.app_version === findServiceType(device).latest_build) {
              // if the app version is upto date
              device.build_status = 'SUCCESS';
              device.service_type = findServiceType(device).value;
            } else {
              device.build_status = (device.build_status === 'FAILED') ? 'FAILED' : '';
              device.service_type = findServiceType(device).value;
            }
          });
          $scope.data = data.results;
          $scope.currentPage = params.page();
          params.total(data.total_count);
          // params.total(data.results.length);
          $defer.resolve($scope.data);
        }, 500);
      };

      $scope.callAPI(adDebuggingSetupSrv.fetchInstalledDevices, {
        params: getParams,
        successCallBack: fetchSuccessOfItemList
      });
    };

    var loadTable = function() {
      $scope.tableParams = new ngTableParams({
        page: 1, // show first page
        count: $scope.displyCount, // count per page
        sorting: {
          device_name: 'asc' // initial sorting
        }
      }, {
        total: $scope.data.length, // length of data
        getData: $scope.fetchTableData
      });
    };

    $scope.deviceSelected = function(device) {
      $scope.selectedDevice = device;
      $scope.selectedDeviceId = device.id;
    };

    $scope.getDisplayTime = function(date) {
      var dateObj = new Date(date);

      return dateObj.toLocaleString();
    };

    $scope.changeDuration = function(hours) {
      $scope.selectedDevice.logging_start_time = new Date().toLocaleString();
      $scope.selectedDevice.logging_end_time = new Date(new Date().getTime() + (hours * 1000 * 60 * 60)).toLocaleString();
    };
    
    $scope.resetDeviceSelection = function() {
      $scope.selectedDevice = {};
      $scope.selectedDeviceId = -1;
    };

    var buildApiParams = function(device) {
      var params = {
        application: device.application || 'ROVER',
        device_name: device.device_name,
        device_uid: device.unique_id,
        device_version: device.device_version,
        hours_log_enabled: device.hours_log_enabled,
        is_logging_enabled: device.is_logging_enabled,
        last_logged_in_user: device.last_logged_in_user,
        service_application_type_id: device.service_application_type_id,
        is_excluded_from_auto_upgrade: device.is_excluded_from_auto_upgrade
      };

      return params;
    };

    $scope.saveDebugSettings = function () {
      var saveDebugSetupSuccessCallback = function() {
        $scope.isLoading = false;
        $scope.$emit('hideLoader');
        $scope.reloadTable();
        $scope.resetDeviceSelection();
      };
      var params = buildApiParams($scope.selectedDevice);
     
      $scope.invokeApi(adDebuggingSetupSrv.saveSetup, params, saveDebugSetupSuccessCallback);

    };

    $scope.toggleManualUpgrade = function(device) {
      var params =  buildApiParams(device);

      params.is_excluded_from_auto_upgrade = !params.is_excluded_from_auto_upgrade;
      
      $scope.callAPI(adDebuggingSetupSrv.saveSetup, {
        params: params,
        successCallBack: function() {
          device.is_excluded_from_auto_upgrade = !device.is_excluded_from_auto_upgrade;
        }
      });
    };

    (function() {
      $scope.selectedDevice = {};
      $scope.selectedDeviceId = -1;
      $scope.resetDeviceSelection();
      // Add All filter to list all the contents
      // rest values are in DB (Service types)
      appTypes.unshift({
        'id': 'All',
        'value': 'All'
      });
      $scope.filterFetchSuccess(appTypes);
      $scope.filterType = appTypes[0];
      $scope.hours = adDebuggingSetupSrv.gethoursList();
      loadTable();
    })();

  }
]);
