admin.service('adExactOnlineSetupSrv', ['$http', '$q', 'ADBaseWebSrvV2', 'sntAuthorizationSrv',
    function($http, $q, ADBaseWebSrvV2, sntAuthorizationSrv) {

    var service = this;

    /**
     * to get the ExactOnLine configraton values
     * @return {undefined}
     */
    this.fetchExactOnLineConfiguration = function(code) {
        var deferred = $q.defer(),
            url = 'api/hotel_settings/exactonline';

        if (code) {
            service.setOAuth(code).
                then(function() {
                    ADBaseWebSrvV2.getJSON(url).
                        then(function(data) {
                            deferred.resolve(data);
                        }, function(data) {
                            deferred.reject(data);
                        });
                });

            return deferred.promise;
        }

        return ADBaseWebSrvV2.getJSON(url);
    };

    service.setOAuth = function(code) {
        return ADBaseWebSrvV2.getJSON('/api/hotel_settings/exactonline/oauth', {
            code: code,
            hotel_uuid: sntAuthorizationSrv.getProperty()
        });
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
        }, function(data) {
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
