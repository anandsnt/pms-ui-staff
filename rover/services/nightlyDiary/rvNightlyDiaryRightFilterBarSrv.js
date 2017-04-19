angular.module('sntRover').service('RVNightlyDiaryRightFilterBarSrv',
    ['$q',
    'BaseWebSrvV2',
    function($q, BaseWebSrvV2) {
        var service = this;

        /*
         * Fetch room type list
         * @param {data} object
         * return object
         */
        service.fetchRoomType = function(params) {
            var deferred = $q.defer(),
                url = '/api/room_types.json?exclude_pseudo=true&exclude_suite=true';

            BaseWebSrvV2.getJSON(url, params).then(function(response) {
                deferred.resolve(response);
            }, function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        /*
         * Fetch Floor list
         * @param {data} object
         * return object
         */
        service.fetchFloorList = function(params) {
            var deferred = $q.defer(),
                url = '/api/floors.json';

            BaseWebSrvV2.getJSON(url, params).then(function(response) {
                deferred.resolve(response);
            }, function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        service.fetchRoomTypeAndFloorList = function(params) {
            var deferred = $q.defer(),
                promises = [],
                response = {};

            promises.push(service.fetchFloorList(params).then((data) => {
                response.floors = data.floors;
            }));

            promises.push(service.fetchRoomType(params).then((data) => {
                response.rooms = data.results;
            }));

            $q.all(promises).then(() => {
                deferred.resolve(response);
            });
            return deferred.promise;
        };
}]);