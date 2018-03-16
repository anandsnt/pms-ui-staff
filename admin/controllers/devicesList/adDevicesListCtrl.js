admin.controller('ADDevicesListCtrl', ['$scope', '$state', 'ngTableParams', 'adDebuggingSetupSrv', '$timeout', 'appTypes',
  function($scope, $state, ngTableParams, adDebuggingSetupSrv, $timeout, appTypes) {

    ADBaseTableCtrl.call(this, $scope, ngTableParams);

    $scope.fetchTableData = function($defer, params) {
      var getParams = $scope.calculateGetParams(params);

      getParams.service_application = angular.copy(getParams.rate_type_id);
      getParams.sort_dir = getParams.sort_dir ? "asc" : "desc";
      delete getParams.rate_type_id;
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
            } else if (device.build_status !== 'FAILED' && device.app_version !== $scope.filterType.latest_build) {
              // if the service upgrade version is not latest and upgrade didn't failed
              device.build_status = 'PENDING';
            } else if (device.app_version === $scope.filterType.latest_build) {
              // if the app version is upto date
              device.build_status = 'SUCCESS';
            } else {
              device.build_status = '';
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

    $scope.saveDebugSettings = function () {
      var saveDebugSetupSuccessCallback = function() {
        $scope.isLoading = false;
        $scope.$emit('hideLoader');
        $scope.reloadTable();
        $scope.resetDeviceSelection();
      };
      var params = {
        application: $scope.selectedDevice.application || 'ROVER',
        device_name: $scope.selectedDevice.device_name,
        device_uid: $scope.selectedDevice.unique_id,
        device_version: $scope.selectedDevice.device_version,
        hours_log_enabled: $scope.selectedDevice.hours_log_enabled,
        is_logging_enabled: $scope.selectedDevice.is_logging_enabled,
        last_logged_in_user: $scope.selectedDevice.last_logged_in_user
      };
     
      $scope.invokeApi(adDebuggingSetupSrv.saveSetup, params, saveDebugSetupSuccessCallback);

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