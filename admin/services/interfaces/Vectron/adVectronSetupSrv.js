admin.service('adVectronSetupSrv', [
    '$http', '$q', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrvV2) {

        var service = this;
        var cache = {
            'CHARGE_CODES': {},
            'PAYMENT_CHARGE_CODES': {},
            'POSTING_ACCOUNTS': {},
            'MAPPING_TYPES': {}
        }

        service.getAllChargeCodes = function() {
            // return ADBaseWebSrvV2.getJSON('/admin/charge_codes/list.json?per_page=1000');
            if (_.isEmpty(cache['CHARGE_CODES'])) {
                cache['CHARGE_CODES'] = ADBaseWebSrvV2.getJSON('/admin/charge_codes/list.json?per_page=1000');
            }
            return cache['CHARGE_CODES']
        };

        service.getAllPaymentChargeCodes = function() {
            // return ADBaseWebSrvV2.getJSON('/admin/charge_codes/list.json?per_page=1000&charge_code_type=PAYMENT');
            if (_.isEmpty(cache['PAYMENT_CHARGE_CODES'])) {
                cache['PAYMENT_CHARGE_CODES'] = ADBaseWebSrvV2.getJSON('/admin/charge_codes/list.json?per_page=1000&charge_code_type=PAYMENT');
            }
            return cache['PAYMENT_CHARGE_CODES']
        };

        service.getAllPostingAccounts = function() {
            // return ADBaseWebSrvV2.getJSON('api/posting_accounts.json');
            if (_.isEmpty(cache['POSTING_ACCOUNTS'])) {
                cache['POSTING_ACCOUNTS'] = ADBaseWebSrvV2.getJSON('api/posting_accounts.json');
            }
            return cache['POSTING_ACCOUNTS']
        };

        function snakeToCamel(s){
            return s.charAt(0).toUpperCase() + s.slice(1).replace(/(\_\w)/g, function(m){return ' ' + m[1].toUpperCase();});
        }

        service.getAllMappingTypes = function() {
            if (_.isEmpty(cache['MAPPING_TYPES'])) {
                cache['MAPPING_TYPES'] = ADBaseWebSrvV2.getJSON('/ifc/proxy/mappings/types?integration=vectron');
            }
            return cache['MAPPING_TYPES']
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
            return ADBaseWebSrvV2.postJSON('/api/integrations/vectron/reset_auth_token');

        };

        service.saveMapping = function(params) {
            return ADBaseWebSrvV2.postJSON('/ifc/vectron/mappings', params);
        };

    }])
;
