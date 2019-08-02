admin.service('adStaahSetupSrv', [
    '$http', '$q', 'ADBaseWebSrvV2',
    function ($http, $q, ADBaseWebSrvV2) {
        var service = this;
        var cache = {};

        service.fetchMeta = function () {
            var deferred = $q.defer(),
                promises = [],
                meta = {};

            promises.push(service.getAllRates().then(function (response) {
                meta.rates = response.results;
            }));

            promises.push(service.getAllRoomTypes().then(function (response) {
                meta.room_types = response.results;
            }));

            promises.push(service.getAllMappingTypes().then(function (response) {
                meta.mapping_types = response.data;
            }));

            promises.push(service.getStaahMappings().then(function (response) {
                meta.staah_mappings = response;
            }));

            $q.all(promises).
            then(function () {
                deferred.resolve(meta);
            }, function (errorMessage) {
                deferred.reject(errorMessage);
            });

            return deferred.promise;
        };

        service.getStaahMappings = function () {
            if (_.isEmpty(cache.staah_mappings)) {
                cache.staah_mappings = ADBaseWebSrvV2.getJSON('ifc/proxy/staah/mappings');
            }
            return cache.staah_mappings;
        };


        service.getAllRates = function () {
            if (_.isEmpty(cache.rates)) {
                cache.rates = ADBaseWebSrvV2.getJSON('/api/rates/minimal');
            }
            return cache.rates;
        };

        service.getAllRoomTypes = function () {
            if (_.isEmpty(cache.room_types)) {
                cache.room_types = ADBaseWebSrvV2.getJSON('/api/room_types');
            }
            return cache.room_types;
        };

        service.getAllMappingTypes = function () {
            if (_.isEmpty(cache.mapping_types)) {
                cache.mapping_types = ADBaseWebSrvV2.getJSON('/ifc/proxy/mappings/types?integration=staah');
            }
            return cache.mapping_types;
        };

        service.createMappings = function (params) {
            return ADBaseWebSrvV2.postJSON('/ifc/staah/mappings', params);
        };

        service.fetchMappings = function (params) {
            return ADBaseWebSrvV2.getJSON('/ifc/staah/mappings', params);
        };

        service.deleteMapping = function (id) {
            return ADBaseWebSrvV2.deleteJSON('/ifc/staah/mappings/' + id);
        };

        service.updateMapping = function (params) {
            return ADBaseWebSrvV2.putJSON('/ifc/staah/mappings/' + params.id, params);
        };

        service.resetAuthToken = function () {
            return ADBaseWebSrvV2.postJSON('/api/integrations/staah/reset_auth_token');

        };

        service.saveMapping = function (params) {
            return ADBaseWebSrvV2.postJSON('/ifc/staah/mappings', params);
        };
    }
]);
