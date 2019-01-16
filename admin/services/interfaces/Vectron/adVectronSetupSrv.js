admin.service('adVectronSetupSrv', [
    '$http', '$q', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrvV2) {

        var service = this;

        service.getAllChargeCodes = function() {
            return ADBaseWebSrvV2.getJSON('/admin/charge_codes/list.json?per_page=1000');
        };

        service.createMappings = function(params) {
            return ADBaseWebSrvV2.postJSON('/ifc/vectron/mappings', params);
        };

        service.fetchMappings = function(params) {
            return ADBaseWebSrvV2.getJSON('/ifc/vectron/mappings', params);
        };

        service.deleteMapping = function(id) {
            return ADBaseWebSrvV2.deleteJSON('/ifc/vectron/mappings/' + id);
        };

        service.updateMapping = function(params) {
            return ADBaseWebSrvV2.putJSON('/ifc/vectron/mappings/' + params.id, params);
        };

        service.resetAuthToken = function() {
            return ADBaseWebSrvV2.putJSON('/api/integrations/vectron/reset_auth_token');

        };

        service.saveMapping = function(params) {
            return ADBaseWebSrvV2.postJSON('/ifc/vectron/mappings', params);
        };

    }])
;
