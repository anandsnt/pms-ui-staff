admin.service('adCegidMappingSrv', [
    '$http', '$q', 'ADBaseWebSrvV2', function ($http, $q, ADBaseWebSrvV2) {

        var service = this;
 
        service.getAllChargeCodes = function () {
            return ADBaseWebSrvV2.getJSON('/admin/charge_codes/list.json?per_page=1000');
        };

        service.fetchMappings = function (params) {
            return ADBaseWebSrvV2.getJSON('/ifc/cegid/mappings', params);
        };

        service.saveMapping = function (params) {
            return ADBaseWebSrvV2.postJSON('/ifc/cegid/mappings', params);
        };

        service.deleteMapping = function (id) {
            return ADBaseWebSrvV2.deleteJSON('/ifc/cegid/mappings/' + id);
        };

        service.updateMapping = function (params) {
            return ADBaseWebSrvV2.putJSON('/ifc/cegid/mappings/' + params.id, params);
        };

        service.fetchMeta = function () {
            var deferred = $q.defer(),
                promises = [],
                meta = {};
            promises.push(service.getAllChargeCodes().
                then(function (response) {
                    meta['charge_codes'] = response.data.charge_codes;
                    meta['charge_code_analytic_codes'] = response.data.charge_codes;
                }));

            $q.all(promises).
                then(function () {
                    deferred.resolve(meta);
                }, function (errorMessage) {
                    deferred.reject(errorMessage);
                });

            return deferred.promise;
        };

    }]);
