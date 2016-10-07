admin.service('adTravelClickCRSSetupSrv', ['$http', '$q', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrvV2){

    /**
     * to get the Travel Click config values
     * @returns {deferred.promise|{then, catch, finally}}
     */
    this.fetchCRSConfiguration = function() {
        var deferred = $q.defer();
        var url = '/api/ota_config/travelclick';

        ADBaseWebSrvV2.getJSON(url).then(function(data) {
            deferred.resolve(data);
        },function(data){
            deferred.reject(data);
        });
        return deferred.promise;
    };

    /**
     * to save the WindsurferCRS config values
     * @returns {deferred.promise|{then, catch, finally}}
     */
    this.saveCRSConfiguration = function(params) {
        var deferred = $q.defer();
        var url = '/api/ota_config/travelclick';

        ADBaseWebSrvV2.putJSON(url, params).then(function(data) {
            deferred.resolve(data);
        },function(data){
            deferred.reject(data);
        });
        return deferred.promise;
    };

    /**
     *
     * @param params
     * @returns {deferred.promise|{then, catch, finally}}
     */
    this.runFullRefresh = function(params){
        var deferred = $q.defer();
        var url = '/api/ota_config/travelclick/full_refresh';

        ADBaseWebSrvV2.putJSON(url, params).then(function(data) {
            deferred.resolve(data);
        },function(data){
            deferred.reject(data);
        });
        return deferred.promise;
    }

}]);