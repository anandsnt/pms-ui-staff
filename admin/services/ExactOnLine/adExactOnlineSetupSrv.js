admin.service('adExactOnlineSetupSrv', ['$http', '$q', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrvV2) {

    /**
     * to run Exact Online Export
     * @return {undefined}
     */
    this.runExactOnlineExport = function(params) {
        var deferred = $q.defer();
        var url = 'api/hotel_settings/exactonline/run_process';

        ADBaseWebSrvV2.putJSON(url, params).then(function(data) {
            deferred.resolve(data);
        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };

    this.fetchBalancingAccounts = function() {
        var deferred = $q.defer();
        var url = 'api/hotel_settings/exactonline/gl_accounts';

        ADBaseWebSrvV2.getJSON(url).then(function(data) {
            deferred.resolve(data);
        }, function(data) {
            deferred.reject(data);
        });

        return deferred.promise;
    };

    /**
     * to get the ExactOnLine configraton values
     * @return {undefined}
     */
    this.fetchJournalsList = function() {
        var deferred = $q.defer();
        var url = 'api/hotel_settings/exactonline/journals';

        ADBaseWebSrvV2.getJSON(url).then(function(data) {
            deferred.resolve(data);
        }, function(data) {
            deferred.reject(data);
        });

        return deferred.promise;
    };

    /**
     * to get the ExactOnLine endpoints list
     * The endpoint vary based on regions
     * @returns {promise|{then, catch, finally}|*}
     */
    this.fetchEndpointsList = function() {
        var deferred = $q.defer();
        var url = '/api/hotel_settings/exactonline/endpoints';

        ADBaseWebSrvV2.getJSON(url).then(function(data) {
            deferred.resolve(data);
        }, function(data) {
            deferred.reject(data);
        });

        return deferred.promise;
    };

}]);