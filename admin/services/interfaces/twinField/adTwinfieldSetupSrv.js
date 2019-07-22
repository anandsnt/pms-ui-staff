admin.service('adTwinfieldSetupSrv', [
    '$http', '$q', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrvV2) {

        var service = this;

        service.getPaymentChargeCodes = function() {
            return ADBaseWebSrvV2.getJSON('/admin/charge_codes/list.json?charge_code_type=PAYMENT&per_page=100');
        };

        service.getAllChargeCodes = function() {
            return ADBaseWebSrvV2.getJSON('/admin/charge_codes/list.json?per_page=1000');
        };

        service.getTaxChargeCodes = function() {
            return ADBaseWebSrvV2.getJSON('/admin/charge_codes/list.json?charge_code_type=PAYMENT&per_page=1000');
        };

        service.getAuthorizationURI = function() {
            return ADBaseWebSrvV2.getJSON('/ifc/proxy/twinfield/authorize');
        };

        service.fetchGLAccounts = function() {
            return ADBaseWebSrvV2.getJSON('/ifc/proxy/twinfield/twinfield_gl_accounts');
        };

        service.fetchVATCodes = function() {
            return ADBaseWebSrvV2.getJSON('/ifc/proxy/twinfield/twinfield_vat_types');
        };

        service.fetchMappings = function(params) {
            return ADBaseWebSrvV2.getJSON('/ifc/proxy/twinfield/twinfield_fetch_mappings', params);
        };

        service.saveMapping = function(params) {
            return ADBaseWebSrvV2.postJSON('/ifc/twinfield/mappings', params);
        };

        service.deleteMapping = function(id) {
            return ADBaseWebSrvV2.deleteJSON('/ifc/twinfield/mappings/' + id);
        };

        service.updateMapping = function(params) {
            return ADBaseWebSrvV2.putJSON('/ifc/twinfield/mappings/' + params.id, params);
        };

        service.fetchMeta = function() {
            var deferred = $q.defer(),
                promises = [],
                meta = {};

            promises.push(service.fetchGLAccounts().
                then(function(response) {
                    meta['gl_accounts'] = response;
                }));

            promises.push(service.fetchVATCodes().
                then(function(response) {
                    meta['vat_types'] = response;
                }));

            promises.push(service.getAllChargeCodes().
                then(function(response) {
                    meta['charge_codes'] = response.data.charge_codes;
                }));

            $q.all(promises).
                then(function() {
                    deferred.resolve(meta);
                }, function(errorMessage) {
                    deferred.reject(errorMessage);
                });
            
            return deferred.promise;
        };

    }]);
