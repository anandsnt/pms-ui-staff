angular.module('sntRover').service('rvAnalyticsSrv', ['$q', 'rvBaseWebSrvV2', function($q, rvBaseWebSrvV2) {
    /*
     * Function To Fetch Active Reservation for that day
     */
    var fetchActiveReservation = function(params) {

        // Webservice calling section
        var deferred = $q.defer();
        var url = 'redshift/analytics/active_reservations';

        rvBaseWebSrvV2.getJSON(url, params)
            .then(function(data) {

                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
        return deferred.promise;
    };

    /*
     * Function To Fetch Current Room Status
     */
    var fetchRoomStatus = function() {

        // Webservice calling section
        var deferred = $q.defer();
        var url = 'redshift/analytics/room_status';

        rvBaseWebSrvV2.getJSON(url, {})
            .then(function(data) {

                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
        return deferred.promise;
    };

    /*
     * This function will return the data structure for HK Work Priority
     */
    this.hkWorkPriority = function(date) {
        var deferred = $q.defer();
        var completedResCall = false;
        var completedRoomsCall = false;

        var activeReservations, roomStatuses = null;

        fetchActiveReservation({ date: date }).then(function(data) {
            activeReservations = data;
            completedResCall = true;
            if (completedRoomsCall) {
                constructHkWorkPriority(deferred, date, activeReservations, roomStatuses);
            }
        });

        fetchRoomStatus().then(function(data) {
            roomStatuses = data;
            completedRoomsCall = true;
            if (completedResCall) {
                constructHkWorkPriority(deferred, date, activeReservations, roomStatuses);
            }
        });

        return deferred.promise;
    };

    /*
     * Moved the complex data structure building to front-end to help server to scale by using more load on UI
     */
    var constructHkWorkPriority = function(deferred, date, activeReservations, roomStatuses) {
        var workPriority = {
            dashboard_type: 'work_priority',
            label: 'AN_WORK_PRIORITY_CHART',
            data: []
        };
        // Pushing arrivals data structure
        workPriority.data.push(buildArrivals(activeReservations, date));
        // Pushing vacant data structure
        workPriority.data.push(buildVacants(activeReservations, roomStatuses));
        // Pushing departure data structure
        workPriority.data.push(buildDepartures(activeReservations, date));
        deferred.resolve(workPriority);
    };

    var buildDepartures = function(activeReservations, date) {
        var departures = activeReservations.filter(reservation => reservation.departure_date == date);
        var departedCount = departures.filter(reservation => reservation.reservation_status === 'CHECKEDOUT').length;
        var lateCheckoutCount = 1;
        var remainingCount = departures.length - lateCheckoutCount - departedCount;

        return {
            type: 'departures',
            label: 'AN_DEPARTURES',
            contents: {
                left_side: [{
                    type: 'perfomed',
                    count: departedCount,
                    label: 'AN_PERFOMED'
                }],
                right_side: [{
                    type: 'late_checkout',
                    count: lateCheckoutCount,
                    label: 'AN_LATE_CHECKOUT'
                }, {
                    type: 'remaining',
                    count: remainingCount,
                    label: 'AN_REMAINING'
                }]
            }
        };
    };

    var buildVacants = function(activeReservations, roomStatuses) {
        var assignedRoomNumbers = activeReservations.filter(reservation => reservation.reservation_status === 'CHECKEDIN')
                                                    .map(reservation => reservation.arrival_room_number);

        var vaccantRooms = roomStatuses.filter(room => !(assignedRoomNumbers.includes(room.room_number)));

        var inspectedCount = vaccantRooms.filter(room => room.status === 'INSPECTED').length;
        var cleanCount = vaccantRooms.filter(room => room.status === 'CLEAN').length;
        var dirtyCount = vaccantRooms.filter(room => room.status === 'DIRTY').length;
        var pickupCount = vaccantRooms.filter(room => room.status === 'PICKUP').length;
        return {
            type: 'vacant',
            label: 'AN_VACANT',
            contents: {
                left_side: [{
                    type: 'dirty',
                    count: dirtyCount,
                    label: 'AN_DIRTY'
                },{
                    type: 'pickup',
                    count: pickupCount,
                    label: 'PICKUP'
                }, {
                    type: 'clean',
                    count: cleanCount,
                    label: 'AN_CLEAN'
                }],
                right_side: [{
                    type: 'inspected',
                    count: inspectedCount,
                    label: 'AN_INSPECTED'
                }]
            }
        };
    };

    var buildArrivals = function(activeReservations, date) {
        var arrivals = activeReservations.filter(reservation => reservation.arrival_date == date);
        // Performed checkin that day
        var perfomedCount = arrivals.filter(reservation => reservation.reservation_status === 'CHECKEDIN').length;


        var earlyCheckinCount = 0;

        var remainingCount = arrivals.length - perfomedCount - earlyCheckinCount;

        return {
            type: 'arrivals',
            label: 'AN_ARRIVALS',
            contents: {
                left_side: [{
                    type: 'perfomed',
                    count: perfomedCount,
                    label: 'AN_PERFOMED'
                }],
                right_side: [{
                    type: 'early_checkin',
                    count: earlyCheckinCount,
                    label: 'AN_EARLY_CHECKIN'
                },{
                    type: 'remaining',
                    count: remainingCount,
                    label: 'AN_REMAINING'
                }]
            }
        };
    };
}]);
