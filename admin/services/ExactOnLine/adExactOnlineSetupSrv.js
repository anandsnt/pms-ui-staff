admin.service('adExactOnlineSetupSrv', ['$http', '$q', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrvV2){

    /**
     * to get the ExactOnLine configraton values
     * @return {undefined}
     */
    this.fetchExactOnLineConfiguration = function() {
        var deferred = $q.defer();
        var url = 'api/hotel_settings/exactonline';

        ADBaseWebSrvV2.getJSON(url).then(function(data) {
            deferred.resolve(data);
        },function(data){
            deferred.reject(data);
        });
        return deferred.promise;
    };

    /**
     * to save the ExactOnLine configration values
     * @return {undefined}
     */
    this.saveExactOnLineConfiguration = function(params) {
        var deferred = $q.defer();
        var url = 'api/hotel_settings/exactonline';

        ADBaseWebSrvV2.postJSON(url, params).then(function(data) {
            deferred.resolve(data);
        },function(data){
            deferred.reject(data);
        });
        return deferred.promise;
    };

    /**
     * to run Exact Online Export
     * @return {undefined}
     */
    this.runExactOnlineExport = function(params) {
        var deferred = $q.defer();
        var url = 'api/hotel_settings/exactonline/run_process';

        ADBaseWebSrvV2.putJSON(url, params).then(function(data) {
            deferred.resolve(data);
        },function(data){
            deferred.reject(data);
        });
        return deferred.promise;
    };
}]);