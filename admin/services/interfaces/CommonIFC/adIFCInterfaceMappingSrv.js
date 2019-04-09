admin.service('adIFCInterfaceMappingSrv', [
    '$http', '$q', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrvV2) {

        var service = this;

        var interfaceswithNumericExternalValues = ['HOGIA'];

        var metaLists = {
            'HOGIA': ['CHARGE_CODES'],
            'SUNACCOUNTING': ['CHARGE_CODES', 'MARKET_SEGMENTS'],
            'DERBYSOFT': ['CANCELLATION_POLICIES', 'CANCELLATION_CODES', 'TAX_CHARGE_CODES', 'TAX_CODES']
        };

        var metaPromises = {
            'CHARGE_CODES': function() {
                return ADBaseWebSrvV2.getJSON('/admin/charge_codes/list.json?per_page=1000');
            },
            'MARKET_SEGMENTS': function() {
                return ADBaseWebSrvV2.getJSON('/api/market_segments.json?per_page=1000&is_active=true');
            },
            'CANCELLATION_POLICIES': function() {
                return ADBaseWebSrvV2.getJSON('/api/cancellation_policies.json?per_page=1000');
            },
            'CANCELLATION_CODES': function() {
                return ADBaseWebSrvV2.getJSON('/api/hotel_settings/derbysoft/cancellation_codes.json?per_page=1000');
            },
            'TAX_CHARGE_CODES': function() {
                return ADBaseWebSrvV2.getJSON('/admin/charge_codes/tax_charge_code.json?per_page=1000');
            },
            'TAX_CODES': function() {
                return ADBaseWebSrvV2.getJSON('/api/hotel_settings/derbysoft/tax_codes.json?per_page=1000');
            }
        };

        service.add = function(params) {
            return ADBaseWebSrvV2.postJSON('/ifc/' + params.interfaceIdentifier.toLowerCase() + '/mappings', params.mapping);
        };

        service.delete = function(params) {
            return ADBaseWebSrvV2.deleteJSON('/ifc/' + params.interfaceIdentifier.toLowerCase() + '/mappings/' + params.id);
        };

        service.update = function(params) {
            return ADBaseWebSrvV2.putJSON('/ifc/' + params.interfaceIdentifier.toLowerCase() + '/mappings/' + params.id, params.mapping);
        };

        service.fetch = function(params) {
            return ADBaseWebSrvV2.getJSON('/ifc/' + params.interfaceIdentifier.toLowerCase() + '/mappings', params.payload);
        };

        service.isNumericExternalValue = function(interfaceIdentifier) {
            return interfaceswithNumericExternalValues.indexOf(interfaceIdentifier) >= 0;
        };

        service.fetchMeta = function(interfaceIdentifier) {
            var metaList = metaLists[interfaceIdentifier],
                deferred = $q.defer(),
                promises = [],
                meta = {};

            metaList.forEach(function(identifier) {
                promises.push(metaPromises[identifier]().
                    then(function(data) {
                        meta[identifier] = data.data.charge_codes;
                    }));
            });

            $q.all(promises).
                then(function() {
                    deferred.resolve(meta);
                });

            return deferred.promise;
        };


    }]);
