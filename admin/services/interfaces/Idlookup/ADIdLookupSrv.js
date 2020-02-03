angular.module('admin').service('ADIdLookupSrv', ['$http', '$q', 'sntBaseWebSrv',
    function ($http, $q, sntBaseWebSrv) {

        var service = this;

        service.search = function (params) {
            return sntBaseWebSrv.getJSON('/admin/id_lookup', params);
        };

        service.exportCSV = function (params) {
            return sntBaseWebSrv.download('/admin/id_lookup/export.csv?entity=' + params.entity, params);
        };
    }
]);
