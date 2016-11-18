angular.module('sntRover').service('RVNightlyDiarySearchSrv',
    ['$q',
    'BaseWebSrvV2',
    function($q, BaseWebSrvV2) {
        var that = this;

        that.searchPerPage = 50;
        that.page = 1;
        
        that.fetchSearchResults = function (data) {
            var deferred = $q.defer(),
                url = 'search.json?per_page=' + that.searchPerPage + '&page=' + that.page;

            data.fakeDataToAvoidCache = new Date();
            // Edit URL according to api specs.
            BaseWebSrvV2.getJSON(url, data).then(function(response) {
                deferred.resolve(response.data);
            }, function(error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };
    }]);