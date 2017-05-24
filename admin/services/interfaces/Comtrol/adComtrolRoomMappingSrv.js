admin.service('adComtrolRoomMappingSrv', ['$http', '$q', 'ADBaseWebSrvV2',
    function($http, $q, ADBaseWebSrvV2) {

        var service = this,
            baseUrl = "/api/hotel_settings/comtrol_mappings/room_mappings";

        var fetchRoomsList = function() {
            var deferred = $q.defer();
            var url = '/admin/hotel_rooms.json?page=1&per_page=1000';

            ADBaseWebSrvV2.getJSON(url).then(function(response) {
                deferred.resolve(response.data.rooms);
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

            promises.push(fetchRoomsList().then(function(roomNumbers) {
                results["roomNumbers"] = roomNumbers;
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
            return ADBaseWebSrvV2.getJSON(baseUrl);
        };

        /**
         *
         * @param newMapping
         * @returns {deferred.promise|{then, catch, finally}}
         */
        service.create = function(newMapping) {
            return ADBaseWebSrvV2.postJSON(baseUrl, newMapping);
        };

        /**
         *
         * @param id
         * @returns {deferred.promise|{then, catch, finally}}
         */
        service.delete = function(id) {
            return ADBaseWebSrvV2.deleteJSON(baseUrl + "/" + id);
        };

        /**
         *
         * @param mapping
         * @returns {deferred.promise|{then, catch, finally}}
         */
        service.update = function(mapping) {
            return ADBaseWebSrvV2.putJSON(baseUrl + "/" + mapping.id, {
                room_no: mapping.room_no,
                external_room: mapping.external_room,
                external_extension: mapping.external_extension
            });
        };

    }]);
