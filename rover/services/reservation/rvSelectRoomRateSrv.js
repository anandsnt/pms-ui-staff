sntRover.service('RVSelectRoomRateSrv', ['$q', 'rvBaseWebSrvV2', 'dateFilter',
    function($q, RVBaseWebSrvV2, dateFilter) {
        var that = this;
        this.getRestrictions = function(params) {
            var deferred = $q.defer();
            var url = '/api/availability/restrictions';
            RVBaseWebSrvV2.getJSON(url, params).then(function(data) {
                
                var restrictions = {},
                    summary = [];

                _.each(data.results, function(result) {
                    restrictions[result.date] = result.restrictions;
                    _.each(result.restrictions, function(restriction) {
                        summary.push(restriction);
                    })
                });

                deferred.resolve({
                    summary: summary,
                    dates: restrictions
                });

            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };
    }
]);