sntRover.service('RVSelectRoomRateSrv', ['$q', 'rvBaseWebSrvV2', 'dateFilter',
    function($q, RVBaseWebSrvV2, dateFilter) {
        var that = this;
        this.getRestrictions = function(params) {
            var deferred = $q.defer();
            var url = '/api/availability/restrictions';
            // Generate a dummy response in case of custom rates
            if (params.rate_id && params.rate_id.toString().match(/_CUSTOM_/)) {
                var restrictions = {};
                for (ms = new tzIndependentDate(params.from_date) * 1, last = new tzIndependentDate(params.to_date) * 1; ms <= last; ms += (24 * 3600 * 1000)) {
                    restrictions[dateFilter(new tzIndependentDate(ms), 'yyyy-MM-dd')] = [];
                }
                deferred.resolve({
                    summary: [],
                    dates: restrictions
                });
            } else {
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
            }
            return deferred.promise;
        };
    }
]);