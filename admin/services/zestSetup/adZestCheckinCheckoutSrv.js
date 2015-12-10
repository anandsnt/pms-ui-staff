admin.service('adZestCheckinCheckoutSrv',['$http', '$q', 'ADBaseWebSrv', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrv, ADBaseWebSrvV2){
    this.fetchSetup = function(data){
        var deferred = $q.defer();
        var url = '/admin/zest_station_setups';
        ADBaseWebSrvV2.getJSON(url).then(function(data) {
                deferred.resolve(data);
        },function(data){
                deferred.reject(data);
        });
        return deferred.promise;
    };

    this.saveSetup = function(data){
        var deferred = $q.defer();
        var url = '/admin/zest_station_setups';

        ADBaseWebSrvV2.putJSON(url,data).then(function(data) {
                deferred.resolve(data);
        },function(data){
                deferred.reject(data);
        });
        return deferred.promise;
    };

}]);