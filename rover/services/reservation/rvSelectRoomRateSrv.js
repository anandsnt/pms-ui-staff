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
            'MIN_ADV_BOOKING': 'grey',
            'MAX_ADV_BOOKING': 'green',
            'DEPOSIT_REQUESTED': 'grey',
            'CANCEL_PENALTIES': 'grey',
            'LEVELS': 'grey',
            'RATE_NOT_CONFIGURED': 'red'
        };

        // HOUSE AVAILABILITY IS SET EVERY TIME CALL IS MADE FOR RESTRICTIONS FROM THE CALLING METHOD IN THE RVSELECTROOMANDRATECTRL
        self.houseAvailability;
        self.promotionValidity;
        self.isGroupReservation;

        self.getRateDetails = function(params) {
            var deferred = $q.defer();
            var url = '/api/availability/rate_details';

            RVBaseWebSrvV2.getJSON(url, params).then(function(data) {
                var restrictions = {},
                    amounts = {},
                    summary = [];

                _.each(data.results, function(result, index) {
                    //---------------------------------------------Add HOUSE_FULL to the restrictions array
                    //CICO-24923 Not needed in case of group bookings
                    if (self.houseAvailability && !self.isGroupReservation && (index === 0 || index < data.results.length - 1)) {
                        if (self.houseAvailability[result.date] < 1) {
                            result.restrictions.push({
                                restriction_type_id: 99,
                                days: null
                            });
                        }
                    }

                    //--------------------------------------------- INVALID PROMO
                    if (self.promotionValidity !== null && (index === 0 || index < data.results.length - 1)) {
                        if (!self.promotionValidity[result.date]) {
                            result.restrictions.push({
                                restriction_type_id: 98,
                                days: null
                            });
                        }
                    }

                    restrictions[result.date] = result.restrictions;

                    amounts[result.date] = result.amount;

                    _.each(result.restrictions, function(restriction) {
                        if (!_.findWhere(summary, {
                            restriction_type_id: restriction.restriction_type_id,
                            days: restriction.days
                        })) {
                            summary.push(restriction);
                        }
                    });
                });

                deferred.resolve({
                    summary: summary,
                    dates: restrictions,
                    amounts: amounts
                });

            }, function(data) {
                deferred.reject(data);
            });

            return deferred.promise;
        };
    }
]);