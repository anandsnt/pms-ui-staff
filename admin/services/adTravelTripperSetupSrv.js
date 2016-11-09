admin.service('adTravelTripperSetupSrv', ['$http', '$q', 'ADBaseWebSrv', 'ADBaseWebSrvV2', function ($http, $q, ADBaseWebSrv, ADBaseWebSrvV2) {

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

    this.fullRefresh = function(data) {
        //ota/full_refresh/:interface_id
        var start_date = '', end_date = '';
        if (data.start_date && data.end_date) {
            start_date = '?start_date='+data.start_date;
            end_date = '&end_date='+data.end_date;
        }

            var deferred = $q.defer();
            var url = 'admin/ota_full_refresh/'+data.interface_id+start_date+end_date;
            ADBaseWebSrvV2.postJSON(url).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
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