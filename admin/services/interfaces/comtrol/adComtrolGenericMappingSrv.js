admin.service('adComtrolGenericMappingSrv', ['$http', '$q', 'ADBaseWebSrvV2', 'adIFCSrv',
    function($http, $q, ADBaseWebSrvV2, adIFCSrv) {

        var service = this;

        var fetchNonPaymentChargeCodes = function() {
            var deferred = $q.defer();
            var url = '/api/charge_codes?exclude_payments=true&per_page=1000';

            ADBaseWebSrvV2.getJSON(url).then(function(data) {
                deferred.resolve(data.results);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        /**
         *
         */
        service.fetchMeta = function() {
            var deferred = $q.defer(),
                promises = [],
                results = {};

            promises.push(fetchNonPaymentChargeCodes().then(function(chargeCodes) {
                results["chargeCodes"] = chargeCodes;
            }));

            $q.all(promises).then(function() {
                deferred.resolve(results);
            }, function() {
                deferred.resolve("Unable to resolve meta data");
            });

            return deferred.promise;
        };

        /**
         *
         * @returns {deferred.promise|{then, catch, finally}}
         */
        service.fetch = function() {
          return adIFCSrv.get('comtrol', 'list_generic_mapping');
        };

        /**
         *
         * @param newMapping
         * @returns {deferred.promise|{then, catch, finally}}
         */
        service.create = function(newMapping) {
          return adIFCSrv.post('comtrol', 'create_generic_mapping', newMapping);
        };

        /**
         *
         * @param id
         * @returns {deferred.promise|{then, catch, finally}}
         */
        service.delete = function(id) {
          return adIFCSrv.delete('comtrol', 'delete_generic_mapping', { id: id });
        };

        /**
         *
         * @param mapping
         * @returns {deferred.promise|{then, catch, finally}}
         */
        service.update = function(mapping) {
          return adIFCSrv.put('comtrol', 'update_generic_mapping', {
            id: mapping.id,
            external_type: mapping.external_type,
            external_code: mapping.external_code,
            is_default: mapping.is_default,
            charge_code_name: mapping.charge_code_name
          });
        };
    }]);
