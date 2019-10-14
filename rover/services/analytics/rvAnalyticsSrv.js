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

    // This flag is used to understand the required APIs are called
    var calledHKApis = false;
    // Variables for API returned data
    var activeReservations = null;
    var roomStatuses = null;

    /*
     * This function will return the data structure for HK Work Priority
     */
    this.hkWorkPriority = function(date) {
        var deferred = $q.defer();
        var completedResCall = false;
        var completedRoomsCall = false;



        fetchActiveReservation({ date: date }).then(function(data) {
            activeReservations = data;

            completedResCall = true;

            if (completedRoomsCall) {
                calledHKApis = true;
                constructHkWorkPriority(deferred, date);
            }
        });

        fetchRoomStatus().then(function(data) {
            roomStatuses = data;

            completedRoomsCall = true;
            if (completedResCall) {
                calledHKApis = true;
                constructHkWorkPriority(deferred, date);
            }
        });

        return deferred.promise;
    };

    /*
     * This function will return the data structure for HK Work Priority
     */
    this.hkOverview = function(date) {
        var deferred = $q.defer();

        constructHkOverview(deferred, date);

        return deferred.promise;
    };

    var constructHkOverview = function(deferred, date) {
        // Call after the HK Priority is done to avoid duplicate API calls
        var hkInterval = window.setInterval(function(){
            if (calledHKApis) {
                var hkOverview = {
                    dashboard_type: 'house_keeping_overview',
                    label: 'AN_HOUSEKEEPING_VIEW',
                    data: []
                };
                // Pushing arrivals data structure
                hkOverview.data.push(buildArrivals(activeReservations, date, true));
                // Pushing departure data structure
                hkOverview.data.push(buildDepartures(activeReservations, date, true));
                // Pushing Stayovers data structure
                hkOverview.data.push(buildStayOvers(activeReservations, roomStatuses, date));
                // Pushing vacant data structure
                hkOverview.data.push(buildVacants(activeReservations, roomStatuses, true));
                window.clearInterval(hkInterval);

                deferred.resolve(hkOverview);
            }
        }, 200);

    };

    /*
     * Moved the complex data structure building to front-end to help server to scale by using more load on UI
     */
    var constructHkWorkPriority = function(deferred, date) {
        var workPriority = {
            dashboard_type: 'work_priority',
            label: 'AN_WORK_PRIORITY_CHART',
            data: []
        };
        // Pushing arrivals data structure
        workPriority.data.push(buildArrivals(activeReservations, date, false));
        // Pushing vacant data structure
        workPriority.data.push(buildVacants(activeReservations, roomStatuses, false));
        // Pushing departure data structure
        workPriority.data.push(buildDepartures(activeReservations, date));
        deferred.resolve(workPriority);
    };

    var buildDepartures = function(activeReservations, date, overview) {
        var departures = activeReservations.filter(reservation => reservation.departure_date == date);
        var departedCount = departures.filter(reservation => reservation.reservation_status === 'CHECKEDOUT').length;
        var lateCheckoutCount = 0;
        var remainingCount = departures.length - lateCheckoutCount - departedCount;

        var departues = {
            type: 'departures',
            label: 'AN_DEPARTURES',
            contents: {
                left_side: [{
                    type: 'perfomed',
                    count: departedCount,
                    label: 'AN_PERFOMED'
                }],
                right_side: []
            }
        };

        if (!overview) {
            departues.contents.right_side.push({
                type: 'late_checkout',
                count: lateCheckoutCount,
                label: 'AN_LATE_CHECKOUT'
            });
        }

        departues.contents.right_side.push({
            type: 'remaining',
            count: remainingCount,
            label: 'AN_REMAINING'
        });
        return departues;
    };

    var buildVacants = function(activeReservations, roomStatuses, overview) {
        var rooms = roomStatuses;
        var dataType = 'rooms';
        var dataLabel = 'AN_ROOMS';

        if (!overview) {
            var assignedRoomNumbers = activeReservations.filter(reservation => reservation.reservation_status === 'CHECKEDIN')
                .map(reservation => reservation.arrival_room_number);

            rooms = rooms.filter(room => !(assignedRoomNumbers.includes(room.room_number)));

            dataType = 'vacant';
            dataLabel = 'AN_VACANT';
        }

        var inspectedCount = rooms.filter(room => room.status === 'INSPECTED').length;
        var cleanCount = rooms.filter(room => room.status === 'CLEAN').length;
        var dirtyCount = rooms.filter(room => room.status === 'DIRTY').length;
        var pickupCount = rooms.filter(room => room.status === 'PICKUP').length;

        return {
            type: dataType,
            label: dataLabel,
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

    var buildArrivals = function(activeReservations, date, overview) {
        var arrivals = activeReservations.filter(reservation => reservation.arrival_date == date);
        // Performed checkin that day
        var perfomedCount = arrivals.filter(reservation => reservation.reservation_status === 'CHECKEDIN').length;

        var earlyCheckinCount = 0;

        var remainingCount = arrivals.length - perfomedCount - earlyCheckinCount;

        var arrivals = {
            type: 'arrivals',
            label: 'AN_ARRIVALS',
            contents: {
                left_side: [{
                    type: 'perfomed',
                    count: perfomedCount,
                    label: 'AN_PERFOMED'
                }],
                right_side: []
            }
        };

        // For work priority we need to calculate immediate arrivals
        if (!overview) {
            arrivals.contents.right_side.push({
                type: 'early_checkin',
                count: earlyCheckinCount,
                label: 'AN_EARLY_CHECKIN'
            });
        }

        arrivals.contents.right_side.push({
            type: 'remaining',
            count: remainingCount,
            label: 'AN_REMAINING'
        });

        return arrivals;
    };

    var buildStayOvers = function(activeReservations, roomStatuses, date) {
        var stayOvers = activeReservations.filter(reservation => reservation.arrival_date !== date && reservation.departure_date !== date);

        var cleanAndInspectedRooms = roomStatuses.filter( room => room.status === 'INSPECTED' || room.status === 'CLEAN')
                                                 .map(room => room.room_number);
        var cleanAndInspectedStayOversCount = stayOvers.filter(reservation => cleanAndInspectedRooms.includes(reservation.arrival_room_number)).length;

        var dirtyOrPickupRoomsCount = stayOvers.length - cleanAndInspectedStayOversCount;

        return {
          type: 'stayovers',
          label: 'AN_STAYOVERS',
          contents: {
              left_side: [{
                  type: 'performed',
                  label: 'AN_PERFOMED',
                  count: cleanAndInspectedStayOversCount
              }],
              right_side: [{
                  type: 'remaining',
                  label: 'AN_REMAINING',
                  count: dirtyOrPickupRoomsCount
              }]
          }
        };
    };
}]);
