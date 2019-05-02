admin.service('adComtrolRoomMappingSrv', ['$http', '$q', 'ADBaseWebSrvV2', 'adIFCSrv',
    function($http, $q, ADBaseWebSrvV2, adIFCSrv) {

        var service = this;

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
         * @param {Object} params Filter & Pagination parameters
         * @returns {deferred.promise|{then, catch, finally}} list of mappings
         */
        service.fetch = function(params) {
          return adIFCSrv.get('comtrol', 'list_room_mapping', params);
        };

        /**
         *
         * @param newMapping
         * @returns {deferred.promise|{then, catch, finally}}
         */
        service.create = function(newMapping) {
          return adIFCSrv.post('comtrol', 'create_room_mapping', newMapping);
        };

        /**
         *
         * @param id
         * @returns {deferred.promise|{then, catch, finally}}
         */
        service.delete = function(id) {
          return adIFCSrv.delete('comtrol', 'delete_room_mapping', { id: id });
        };

        /**
         *
         * @param mapping
         * @returns {deferred.promise|{then, catch, finally}}
         */
        service.update = function(mapping) {
          return adIFCSrv.put('comtrol', 'update_room_mapping', {
            id: mapping.id,
            room_no: mapping.room_no,
            external_room: mapping.external_room,
            external_extension: mapping.external_extension,
            external_access_level: mapping.external_access_level
          });
        };

    }]);
