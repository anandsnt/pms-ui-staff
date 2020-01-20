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
                    

                    // _.each(data.dates, function(result, index) {
                    //      _.each(result.restrictions, function(restriction) {
                    //         if (!_.findWhere(summary, {
                    //             restriction_type_id: restriction.restriction_type_id,
                    //             days: restriction.days
                    //         })) {
                    //             summary.push(restriction);
                    //         }
                    //     });
                    // });


                    // data.summary = summary;
//                     data = {
//     "total_room_cost": 40.0,
//     "incl_stay_tax": 0,
//     "excl_stay_tax": 0.66,
//     "dates": {
//         "2019-11-24": {

//             "rate": "10.0",
//             "restrictions": [
//                 [],
//                 []
//             ],
//             "addon": 10.0,
//             "incl_tax": 0,
//             "excl_tax": 0.33,
//             "total": "20.33"
//         },
//         "2019-11-25": {

//             "rate": "10.0",
//             "restrictions": [
//                 [],
//                 []
//             ],
//             "addon": 10.0,
//             "incl_tax": 0,
//             "excl_tax": 0.33,
//             "total": "20.33"
//         }
//     },
//     "is_eod_in_progress": false,
//     "is_eod_manual_started": false,
//     "is_eod_failed": true,
//     "is_eod_process_running": false
// };
                    deferred.resolve(data);














                // _.each(data.dates, function(result, index) {
                //     // ---------------------------------------------Add HOUSE_FULL to the restrictions array
                //     // CICO-24923 Not needed in case of group bookings
                //     if (self.houseAvailability && !self.isGroupReservation && (index === 0 || index < data.dates.length - 1)) {
                //         if (self.houseAvailability[result.date] < 1) {
                //             result.restrictions.push({
                //                 restriction_type_id: 99,
                //                 days: null
                //             });
                //         }
                //     }

                //     // --------------------------------------------- INVALID PROMO
                //     if (self.promotionValidity !== null && (index === 0 || index < data.dates.length - 1)) {
                //         if (!self.promotionValidity[result.date]) {
                //             result.restrictions.push({
                //                 restriction_type_id: 98,
                //                 days: null
                //             });
                //         }
                //     }

                //     restrictions[result.date] = result.restrictions;

                //     amounts[result.date] = result.rate;

                //     _.each(result.restrictions, function(restriction) {
                //         if (!_.findWhere(summary, {
                //             restriction_type_id: restriction.restriction_type_id,
                //             days: restriction.days
                //         })) {
                //             summary.push(restriction);
                //         }
                //     });
                // });

                // deferred.resolve({
                //     summary: summary,
                //     dates: restrictions,
                //     amounts: amounts
                // });

            }, function(data) {
                deferred.reject(data);
            });

            return deferred.promise;
        };
    }
]);