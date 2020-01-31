angular.module('admin').service('ADIdLookupSrv', ['$http', '$q', 'sntBaseWebSrv',
    function ($http, $q, sntBaseWebSrv) {

        var service = this;

        // Search API call.
        service.search = function (params) {
            return sntBaseWebSrv.getJSON('/admin/id_lookup', params);
        };

        // Search API call.
        service.exportCSV = function (params) {
            return sntBaseWebSrv.download('/admin/id_lookup/export.csv?entity=' + params.entity, params);
        };
    }
]);
