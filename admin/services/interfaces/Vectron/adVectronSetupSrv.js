admin.service('adVectronSetupSrv', [
    '$http', '$q', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrvV2) {

        var service = this;
        var cache = {
            'CHARGE_CODES': {},
            'PAYMENT_CHARGE_CODES': {},
            'POSTING_ACCOUNTS': {},
            'MAPPING_TYPES': {}
        }

        service.fetchMeta = function() {
            var deferred = $q.defer(),
                promises = [],
                meta = {};

            promises.push(service.getAllChargeCodes().
            then(function(response) {
                meta['charge_codes'] = response.data.charge_codes;
            }));

            promises.push(service.getAllPaymentChargeCodes().
            then(function(response) {
                meta['payment_charge_codes'] = response.data.charge_codes;
            }));

            promises.push(service.getAllPostingAccounts().
            then(function(response) {
                meta['posting_accounts'] = response.posting_accounts;
            }));

            promises.push(service.getAllMappingTypes().
            then(function(response) {
                meta['mapping_types'] = response.data;
            }));


            $q.all(promises).
            then(function() {
                deferred.resolve(meta);
            }, function(errorMessage) {
                deferred.reject(errorMessage);
            });

            return deferred.promise;
        };

        service.getAllChargeCodes = function() {
            if (_.isEmpty(cache['CHARGE_CODES'])) {
                cache['CHARGE_CODES'] = ADBaseWebSrvV2.getJSON('/admin/charge_codes/list.json?per_page=1000');
            }
            return cache['CHARGE_CODES']
        };

        service.getAllPaymentChargeCodes = function() {
            if (_.isEmpty(cache['PAYMENT_CHARGE_CODES'])) {
                cache['PAYMENT_CHARGE_CODES'] = ADBaseWebSrvV2.getJSON('/admin/charge_codes/list.json?per_page=1000&charge_code_type=PAYMENT');
            }
            return cache['PAYMENT_CHARGE_CODES']
        };

        service.getAllPostingAccounts = function() {
            if (_.isEmpty(cache['POSTING_ACCOUNTS'])) {
                cache['POSTING_ACCOUNTS'] = ADBaseWebSrvV2.getJSON('api/posting_accounts.json');
            }
            return cache['POSTING_ACCOUNTS']
        };

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
