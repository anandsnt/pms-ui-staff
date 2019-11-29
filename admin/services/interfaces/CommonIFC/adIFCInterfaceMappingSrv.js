admin.service('adIFCInterfaceMappingSrv', [
    '$http', '$q', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrvV2) {

        var service = this;

        var interfaceswithNumericExternalValues = ['HOGIA'];

        var metaLists = {
            'AXBASE3000': ['ROOM_NUMBERS', 'ROOM_TYPES'],
            'CEGID': ['CHARGE_CODES'],
            'DATAPLUS': ['CHARGE_CODES', 'MARKET_SEGMENTS'],
            'DELPHI': ['CHARGE_CODES', 'GROUP_HOLD_STATUSES', 'MARKET_SEGMENTS', 'SOURCE_CODES'],
            'DERBYSOFT': ['CANCELLATION_POLICIES', 'CANCELLATION_CODES', 'TAX_CHARGE_CODES', 'TAX_CODES'],
            'EXACTONLINE': ['CHARGE_CODES', 'TAX_CHARGE_CODES'],
            'FISKALTRUST': ['PAYMENT_CODES'],
            'HOGIA': ['CHARGE_CODES'],
            'IGEL': ['CHARGE_CODES', 'PAYMENT_CODES'],
            'SAFEACCOUNTING': ['CHARGE_CODES', 'TAX_CHARGE_CODES'],
            'SUNACCOUNTING': ['CHARGE_CODES', 'MARKET_SEGMENTS'],
            'SIE': ['CHARGE_CODES']
        };

        var metaPromises = {
            'CANCELLATION_CODES': function() {
                return ADBaseWebSrvV2.getJSON('/api/hotel_settings/derbysoft/cancellation_codes.json?per_page=1000');
            },
            'CANCELLATION_POLICIES': function() {
                return ADBaseWebSrvV2.getJSON('/api/cancellation_policies.json?per_page=1000');
            },
            'CHARGE_CODES': function() {
                return ADBaseWebSrvV2.getJSON('/admin/charge_codes/list.json?per_page=1000');
            },
            'GROUP_HOLD_STATUSES': function() {
                return ADBaseWebSrvV2.getJSON('/api/group_hold_statuses');
            },
            'MARKET_SEGMENTS': function() {
                return ADBaseWebSrvV2.getJSON('/api/market_segments.json?per_page=1000&is_active=true');
            },
            'SOURCE_CODES': function() {
                return ADBaseWebSrvV2.getJSON('/api/sources?&is_active=true');
            },
            'TAX_CHARGE_CODES': function() {
                return ADBaseWebSrvV2.getJSON('/admin/charge_codes/tax_charge_code.json?per_page=1000');
            },
            'TAX_CODES': function() {
                return ADBaseWebSrvV2.getJSON('/api/hotel_settings/derbysoft/tax_codes.json?per_page=1000');
            },
            'PAYMENT_CODES': function() {
                return ADBaseWebSrvV2.getJSON('/admin/charge_codes/payment_charge_codes.json?per_page=1000');
            },
            'ROOM_NUMBERS': function() {
                return ADBaseWebSrvV2.getJSON('/admin/hotel_rooms.json?page=1&per_page=100&query=&sort_dir=true&sort_field=name');
            },
            'ROOM_TYPES': function() {
                return ADBaseWebSrvV2.getJSON('/ifc/axbase3000/mappings');
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

        service.resetAuthToken = function(mapping_interface) {
            return ADBaseWebSrvV2.postJSON('/api/integrations/' + mapping_interface + '/reset_auth_token');
        };

        service.fetchMeta = function(interfaceIdentifier) {
            var metaList = metaLists[interfaceIdentifier],
                deferred = $q.defer(),
                promises = [],
                meta = {};

            metaList.forEach(function(identifier) {
                promises.push(metaPromises[identifier]().
                    then(function(data) {
                        meta[identifier] = data.data ? data.data : data;
                    }));
            });

            $q.all(promises).
                then(function() {
                    deferred.resolve(meta);
                }, function(err) {
                    throw err;
                });
            return deferred.promise;
        };


    }]);