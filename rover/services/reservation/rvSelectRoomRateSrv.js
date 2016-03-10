sntRover.service('RVSelectRoomRateSrv', ['$q', 'rvBaseWebSrvV2', 'dateFilter',
    function($q, RVBaseWebSrvV2, dateFilter) {
        var self = this;

        self.restrictionColorClass = {
            'CLOSED': 'red',
            'CLOSED_ARRIVAL': 'red',
            'CLOSED_DEPARTURE': 'red',
            'MIN_STAY_LENGTH': 'blue',
            'MAX_STAY_LENGTH': 'grey',
            'MIN_STAY_THROUGH': 'purple',
            'MIN_ADV_BOOKING': 'green',
            'MAX_ADV_BOOKING': 'grey',
            'DEPOSIT_REQUESTED': 'grey',
            'CANCEL_PENALTIES': 'grey',
            'LEVELS': 'grey',
            'RATE_NOT_CONFIGURED': 'red'
        };

        // HOUSE AVAILABILITY IS SET EVERY TIME CALL IS MADE FOR RESTRICTIONS FROM THE CALLING METHOD IN THE RVSELECTROOMANDRATECTRL
        self.houseAvailability;
        self.promotionValidity;
        self.isGroupReservation;

        self.getRestrictions = function(params) {
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
                        //---------------------------------------------Add HOUSE_FULL to the restrictions array
                        //CICO-24923 Not needed in case of group bookings
                        if (self.houseAvailability && !self.isGroupReservation) {
                            if (self.houseAvailability[result.date] < 1) {
                                result.restrictions.push({
                                    type_id: 99,
                                    days: null
                                });
                            }
                        }

                        //--------------------------------------------- INVALID PROMO
                        if (self.promotionValidity !== null) {
                            if (!self.promotionValidity[result.date]) {
                                result.restrictions.push({
                                    type_id: 98,
                                    days: null
                                });
                            }
                        }

                        restrictions[result.date] = result.restrictions;
                        _.each(result.restrictions, function(restriction) {
                            if (!_.findWhere(summary, {
                                    type_id: restriction.type_id,
                                    days: restriction.days
                                })) {
                                summary.push(restriction);
                            }
                        });
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