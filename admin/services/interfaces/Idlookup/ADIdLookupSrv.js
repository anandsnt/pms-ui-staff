admin.service('ADIdLookupSrv', ['$http', '$q', 'ADBaseWebSrvV2',
    function($http, $q, ADBaseWebSrvV2) {

        var service = this;

		service.search = function(params) {
            var deferred = $q.defer();

            ADBaseWebSrvV2.getJSON('/admin/id_lookup', params).then(function(response) {
                deferred.resolve(response);
            }, function(response) {
                deferred.reject(response.errors || response);
            });
            return deferred.promise;
        };

        service.export = function(params) {
            var deferred = $q.defer(),
            	url = '/admin/id_lookup/export.csv?entity='+ params.entity;

            ADBaseWebSrvV2.postJSON(url).then(function(response) {
                deferred.resolve(response);
            }, function(response) {
                deferred.reject(response.errors || response);
            });
            return deferred.promise;
        };
    }
]);
