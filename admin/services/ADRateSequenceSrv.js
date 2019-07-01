admin.service('ADRateSequenceSrv', ['$http', '$q', 'ADBaseWebSrvV2', 'sntBaseWebSrv',
    function($http, $q, ADBaseWebSrvV2, sntBaseWebSrv) {

        this.fetchOptions = function() {
            var deferred = $q.defer(),
                url = '/api/sort_preferences';

            ADBaseWebSrvV2.getJSON(url).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };


        this.fetchSelections = function() {
            var deferred = $q.defer(),
                url = '/api/sort_preferences/list_selections';

            ADBaseWebSrvV2.getJSON(url).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.save = function(data) {
            var deferred = $q.defer(),
                url = '/api/sort_preferences/update_selections';

            ADBaseWebSrvV2.postJSON(url, data).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.searchRates = function(params) {
            var deferred = $q.defer(),
                url = '/api/sort_preferences/search_custom_rates';

            ADBaseWebSrvV2.getJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.createCustomSequence = function( params ) {
            var deferred = $q.defer(),
                url = '/admin/rate_sequences';

            sntBaseWebSrv.postJSON(url, params).then(function(response) {
                deferred.resolve(response);
            }, function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        this.updateCustomSequence = function( params ) {
            var deferred = $q.defer(),
                url = '/admin/rate_sequences/' + params.id ;

            sntBaseWebSrv.putJSON(url, params).then(function(response) {
                deferred.resolve(response);
            }, function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        this.listCustomSequence = function() {
            var deferred = $q.defer(),
                url = '/admin/rate_sequences';

            sntBaseWebSrv.getJSON(url).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };
    }
]);
