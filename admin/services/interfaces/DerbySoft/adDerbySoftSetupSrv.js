admin.service('adDerbySoftSetupSrv', [
    '$http', '$q', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrvV2) {

        var service = this;

        service.getAllCancellationPolicies = function() {
            return ADBaseWebSrvV2.getJSON('/api/cancellation_policies.json?per_page=1000');
        };

        service.getAllCancellationCodes = function() {
            return ADBaseWebSrvV2.getJSON('/api/hotel_settings/derbysoft/cancellation_codes.json?per_page=1000');
        };

        service.getAllTaxChargeCodes = function() {
            return ADBaseWebSrvV2.getJSON('/admin/charge_codes/tax_charge_code.json?per_page=1000');
        };

        service.getAllTaxCodes = function() {
            return ADBaseWebSrvV2.getJSON('/api/hotel_settings/derbysoft/tax_codes.json?per_page=1000');
        };

        service.resetAuthToken = function() {
            return ADBaseWebSrvV2.postJSON('/api/integrations/derbysoft/reset_auth_token');

        };

        service.createMappings = function(params) {
            return ADBaseWebSrvV2.postJSON('/ifc/derbysoft/mappings', params);
        };

        service.fetchMappings = function(params) {
            return ADBaseWebSrvV2.getJSON('/ifc/derbysoft/mappings', params);
        };

        service.deleteMapping = function(id) {
            return ADBaseWebSrvV2.deleteJSON('/ifc/derbysoft/mappings/' + id);
        };

        service.updateMapping = function(params) {
            return ADBaseWebSrvV2.putJSON('/ifc/derbysoft/mappings/' + params.id, params);
        };

        service.saveMapping = function(params) {
            return ADBaseWebSrvV2.postJSON('/ifc/derbysoft/mappings', params);
        };

    }])
;
