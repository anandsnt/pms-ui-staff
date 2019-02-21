admin.service('adInterfaceMappingSrv', [
    '$http', '$q', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrvV2) {
        var service = this;

        service.getAllChargeCodes = function() {
            return ADBaseWebSrvV2.getJSON('/admin/charge_codes/list.json?per_page=1000');
        };

        service.createMapping = function(params) {
            var interface = params.interface.toLowerCase();

            delete params.interface;

            return ADBaseWebSrvV2.postJSON('/ifc/' + interface + '/mappings', params);
        };

        service.fetchMappings = function(params) {
            var interface = params.interface.toLowerCase();

            delete params.interface;

            return ADBaseWebSrvV2.getJSON('/ifc/' + interface + '/mappings', params);
        };

        service.deleteMapping = function(params) {
            return ADBaseWebSrvV2.deleteJSON('/ifc/' + params.interface.toLowerCase() + '/mappings/' + params.id);
        };

        service.updateMapping = function(params) {
            var interface = params.interface.toLowerCase();

            delete params.interface;

            return ADBaseWebSrvV2.putJSON('/ifc/' + interface + '/mappings/' + params.id, params);
        };
    }])
;
