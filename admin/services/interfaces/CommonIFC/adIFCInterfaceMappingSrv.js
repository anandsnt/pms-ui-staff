admin.service('adIFCInterfaceMappingSrv', [
    '$http', '$q', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrvV2) {

        var service = this;

        var metaLists = {
            'hogia': ['CHARGE_CODES']
        };

        var metaPromises = {
            'CHARGE_CODES': function() {
                return ADBaseWebSrvV2.getJSON('/admin/charge_codes/list.json?per_page=1000');
            }
        };

        service.add = function(params) {
            return ADBaseWebSrvV2.putJSON('/ifc/' + params.interfaceIdentifier + '/mappings', params.mapping);
        };

        service.delete = function(params) {
            return ADBaseWebSrvV2.deleteJSON('/ifc/' + params.interfaceIdentifier + '/mappings/' + params.id);
        };

        service.update = function(params) {
            return ADBaseWebSrvV2.putJSON('/ifc/' + params.interfaceIdentifier + '/mappings/' + params.id, params.mapping);
        };

        service.fetch = function(identifier) {
            return ADBaseWebSrvV2.deleteJSON('/ifc/' + identifier + '/mappings');
        };

        service.fetchMeta = function(interfaceIdentifier) {
            let metaList = metaLists[interfaceIdentifier.toLowerCase()],
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
