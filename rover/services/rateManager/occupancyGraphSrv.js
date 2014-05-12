sntRover.service('RateMgrOccupancyGraphSrv', ['$q', 'BaseWebSrvV2',
    function ($q, BaseWebSrvV2) {

        this.fetch = function () {
            var deferred = $q.defer();
            var url = '/api/daily_occupancies';
            var params = {
                "from_date": "2014-01-01",
                "to_date": "2014-05-01"
            }
            BaseWebSrvV2.getJSON(url, params).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };


    }
]);