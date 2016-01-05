admin.service('adZDirectSetupSrv', ['$http', '$q', 'ADBaseWebSrv', 'ADBaseWebSrvV2', function ($http, $q, ADBaseWebSrv, ADBaseWebSrvV2) {

  this.testSetup = function (data) {
    var deferred = $q.defer();
    var url = 'admin/test_ota_connection/'+data.interface;
    ADBaseWebSrvV2.postJSON(url, data).then(function (data) {
      deferred.resolve(data);
    }, function (data) {
      deferred.reject(data);
    });
    return deferred.promise;
  };

  this.fullRefresh = function (data) {
    //ota/full_refresh/:interface_id
    var deferred = $q.defer();
    var url = 'admin/ota_full_refresh/' + data.interface_id;
    ADBaseWebSrvV2.postJSON(url).then(function (data) {
      deferred.resolve(data);
    }, function (data) {
      deferred.reject(data);
    });
    return deferred.promise;
  };

  this.saveSetup = function (data) {
    var deferred = $q.defer();
    var url = 'admin/save_ota_connection_config.json?interface='+data.interface;//update for ZDirect-specific
    ADBaseWebSrvV2.postJSON(url, data).then(function (data) {
      deferred.resolve(data);
    }, function (data) {
      deferred.reject(data);
    });
    return deferred.promise;
  };

}]);