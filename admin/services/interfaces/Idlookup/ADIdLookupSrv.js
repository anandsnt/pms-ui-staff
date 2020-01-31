admin.service('ADIdLookupSrv', ['$http', '$q', 'sntBaseWebSrv',
    function($http, $q, sntBaseWebSrv) {

        var service = this;

        // Search API call.
		service.search = function(params) {
            var deferred = $q.defer();

            sntBaseWebSrv.getJSON('/admin/id_lookup', params).then(function(response) {
                deferred.resolve(response);
            }, function(response) {
                deferred.reject(response.errors || response);
            });
            return deferred.promise;
        };

        // Search API call.
        service.exportCSV = function(params) {
            var deferred = $q.defer(),
                url = '/admin/id_lookup/export.csv?entity=' + params.entity;

            sntBaseWebSrv.exportFile(url, params).then(function(response) {
                deferred.resolve(response);
            }, function(response) {
                deferred.reject(response.errors || response);
            });
            return deferred.promise;
        };
    }
]);
