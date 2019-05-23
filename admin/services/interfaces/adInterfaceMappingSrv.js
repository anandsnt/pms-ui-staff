admin.service('adInterfaceMappingSrv', [
    '$http', '$q', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrvV2) {
        var service = this;

        service.getAllChargeCodes = function() {
            return ADBaseWebSrvV2.getJSON('/admin/charge_codes/list.json?per_page=1000');
        };

        service.getMarketSegments = function() {
            return ADBaseWebSrvV2.getJSON('/api/market_segments.json?per_page=1000&is_active=true');
        };

        service.getCancellationPolicies = function() {
            return ADBaseWebSrvV2.getJSON('/api/cancellation_policies.json?per_page=1000');
        };

        service.getCancellationCodes = function() {
            return ADBaseWebSrvV2.getJSON('/api/hotel_settings/derbysoft/cancellation_codes.json?per_page=1000');
        };

        service.getTaxChargeCodes = function() {
            return ADBaseWebSrvV2.getJSON('/admin/charge_codes/tax_charge_code.json?per_page=1000');
        };

        service.getTaxCodes = function() {
            return ADBaseWebSrvV2.getJSON('/api/hotel_settings/derbysoft/tax_codes.json?per_page=1000');
        };

        service.createMapping = function(params) {
            var integration = params.interface.toLowerCase();

            delete params.interface;

            return ADBaseWebSrvV2.postJSON('/ifc/' + integration + '/mappings', params);
        };

        service.fetchMappings = function(params) {
            var integration = params.interface.toLowerCase();

            delete params.interface;

            return ADBaseWebSrvV2.getJSON('/ifc/' + integration + '/mappings', params);
        };

        service.deleteMapping = function(params) {
            return ADBaseWebSrvV2.deleteJSON('/ifc/' + params.interface.toLowerCase() + '/mappings/' + params.id);
        };

        service.updateMapping = function(params) {
            var integration = params.interface.toLowerCase();

            delete params.interface;

            return ADBaseWebSrvV2.putJSON('/ifc/' + integration + '/mappings/' + params.id, params);
        };
    }])
;
