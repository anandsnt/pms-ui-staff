admin.service('adFeaturesSrv', ['$http', '$q', 'ADBaseWebSrv', function($http, $q, ADBaseWebSrv) {
  /**
    *   A getter method to return the hotel list
    */
  this.fetch = function(id) {
    var deferred = $q.defer();
    var url = '/admin/hotels/' + id + '/features.json';

    ADBaseWebSrv.getJSON(url, {}).then(function(data) {
        deferred.resolve(data);
    }, function(data) {
        deferred.reject(data);
    });
    return deferred.promise;
  };

  this.updateFeature = function(data) {
    var deferred = $q.defer(),
      url = '/admin/hotels/' + data.id + '/features/' + data.name + '.json',
      params = { value: data.enabled };

    ADBaseWebSrv.putJSON(url, params).then(function(data) {
      deferred.resolve(data);
    }, function(data) {
      deferred.reject(data);
    });
    return deferred.promise;
  };
}]);
