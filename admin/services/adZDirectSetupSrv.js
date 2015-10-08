admin.service('adZDirectSetupSrv', ['$http', '$q', 'ADBaseWebSrv', 'ADBaseWebSrvV2', function ($http, $q, ADBaseWebSrv, ADBaseWebSrvV2) {

  this.fetchSetup = function (data) {
    var deferred = $q.defer();
    var url = 'api/settings/zdirect';

    ADBaseWebSrvV2.getJSON(url).then(function (data) {
      deferred.resolve(data);
    }, function (data) {
      deferred.reject(data);
    });
    return deferred.promise;
  };

  this.saveSetup = function (data) {
    var deferred = $q.defer();
    var url = 'api/settings/zdirect';
    ADBaseWebSrvV2.postJSON(url, data).then(function (data) {
      deferred.resolve(data);
    }, function (data) {
      deferred.reject(data);
    });
    return deferred.promise;
  };

  this.toggleActive = function (data) {
    var deferred = $q.defer();
    var url = 'api/settings/zdirect';
    ADBaseWebSrvV2.postJSON(url, data).then(function (data) {
      deferred.resolve(data);
    }, function (data) {
      deferred.reject(data);
    });
    return deferred.promise;
  };

}]);