admin.service('ADZestStationSrv', ['$http', '$q', 'ADBaseWebSrv', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrv, ADBaseWebSrvV2) {


    this.fetch = function() {
        var deferred = $q.defer();
        var url = '/api/hotel_settings/kiosk';
        ADBaseWebSrvV2.getJSON(url).then(function(data) {
            deferred.resolve(data);
        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    this.fetchZestStationData = function() {
        var deferred = $q.defer();
        var url = '/api/zest_stations';
        ADBaseWebSrvV2.getJSON(url).then(function(data) {
            deferred.resolve(data);
        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };


    this.save = function(data) {
        var deferred = $q.defer();
        var url = '/api/hotel_settings/change_settings';

        ADBaseWebSrvV2.postJSON(url, data).then(function(data) {
            deferred.resolve(data);
        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };


}]);