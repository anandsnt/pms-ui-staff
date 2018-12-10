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
            return ADBaseWebSrvV2.getJSON('/api/hotel_settings/twinfield/authorize');
        };

        service.fetchGLAccounts = function() {
            return ADBaseWebSrvV2.getJSON('/api/hotel_settings/twinfield/fetch_gl_accounts');
        };

        service.fetchVATCodes = function() {
            return ADBaseWebSrvV2.getJSON('/api/hotel_settings/twinfield/fetch_vat_types');
        };

        service.fetchCostCenters = function() {
            return ADBaseWebSrvV2.getJSON('/api/hotel_settings/twinfield/fetch_cost_centers');
        };

        service.fetchMappings = function(params) {
            return ADBaseWebSrvV2.getJSON('/api/hotel_settings/twinfield/fetch_mappings', params);
        };

        service.saveMapping = function(params) {
            return ADBaseWebSrvV2.postJSON('/api/hotel_settings/twinfield/save_mappings', params);
        };

        service.deleteMapping = function(id) {
            return ADBaseWebSrvV2.deleteJSON('/api/hotel_settings/twinfield/mappings/' + id);
        };

        service.updateMapping = function(params) {
            return ADBaseWebSrvV2.putJSON('/api/hotel_settings/twinfield/mappings/' + params.id, params);
        };

        service.fetchMeta = function() {
            var deferred = $q.defer(),
                promises = [],
                meta = {};

            promises.push(service.fetchGLAccounts().
                then(function(response) {
                    meta['gl_accounts'] = response.data;
                }));

            promises.push(service.fetchVATCodes().
                then(function(response) {
                    meta['vat_types'] = response.data;
                }));

            promises.push(service.fetchCostCenters().
                then(function(response) {
                    meta['cost_centers'] = response.data;
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

    }])
;
