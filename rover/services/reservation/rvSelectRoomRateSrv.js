sntRover.service('RVSelectRoomRateSrv', ['$q', 'rvBaseWebSrvV2', 'dateFilter',
    function($q, RVBaseWebSrvV2, dateFilter) {
        var self = this;

        self.restrictionsMapping = {
            1: {
                key: 'CLOSED',
                value: 'CLOSED'
            },
            2: {
                key: 'CLOSED_ARRIVAL',
                value: 'CLOSED FOR ARRIVAL'
            },
            3: {
                key: 'CLOSED_DEPARTURE',
                value: 'CLOSED FOR DEPARTURE'
            },
            4: {
                key: 'MIN_STAY_LENGTH',
                value: 'MIN. LENGTH OF STAY: '
            },
            5: {
                key: 'MAX_STAY_LENGTH',
                value: 'MAX. LENGTH OF STAY: '
            },
            6: {
                key: 'MIN_STAY_THROUGH',
                value: 'MIN. STAY THROUGH: '
            },
            7: {
                key: 'MIN_ADV_BOOKING',
                value: 'MIN. ADVANCE BOOKING: '
            },
            8: {
                key: 'MAX_ADV_BOOKING',
                value: 'MAX. ADVANCE BOOKING: '
            },
            9: {
                key: 'DEPOSIT_REQUESTED',
                value: ''
            },
            10: {
                key: 'CANCEL_PENALTIES',
                value: ''
            },
            11: {
                key: 'LEVELS',
                value: ''
            },
            98: {
                key: 'INVALID_PROMO',
                value: 'PROMOTION INVALID'
            },
            99: {
                key: 'HOUSE_FULL',
                value: 'NO HOUSE AVAILABILITY'
            }
        };

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
                        if (self.houseAvailability) {
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