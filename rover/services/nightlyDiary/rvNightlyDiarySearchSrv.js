angular.module('sntRover').service('RVNightlyDiarySearchSrv',
    ['$q',
    'BaseWebSrvV2',
    function($q, BaseWebSrvV2) {

        this.fetchSearchResults = function (data) {
            var deferred = $q.defer(),
                url = '/api/nightly_diary/room_search';

            // Edit URL according to api specs.
            BaseWebSrvV2.getJSON(url, data).then(function(response) {
                deferred.resolve(response);
            }, function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };
    }]);