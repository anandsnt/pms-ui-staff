angular.module('sntRover').service('rvAnalyticsSrv', ['$q', 'rvBaseWebSrvV2', function($q, rvBaseWebSrvV2) {

    // This flag is used to understand the required APIs are called
    var calledHKApis = false;

    var that = this;

    // Variables for API returned data
    that.activeReservations = null;
    that.yesterdaysReservations = null;
    that.roomStatuses = null;

    /*
     * Function To Fetch Active Reservation for that day
     */
    this.fetchActiveReservation = function(params) {

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
    this.fetchRoomStatus = function() {

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

    this.initRoomAndReservationApis = function(date) {
        var deferred = $q.defer();
        var completedResCall = false;
        var completedRoomsCall = false;

        that.fetchActiveReservation({
            date: date
        }).then(function(data) {
            that.activeReservations = data;

            completedResCall = true;

            if (completedRoomsCall) {
                calledHKApis = true;
                deferred.resolve();
            }
        });

        that.fetchRoomStatus().then(function(data) {
            that.roomStatuses = data;

            completedRoomsCall = true;
            if (completedResCall) {
                calledHKApis = true;
                deferred.resolve();
            }
        });
        return deferred.promise;
    };

    /*
     * This function will return the data structure for HK Work Priority
     */
    this.hkWorkPriority = function(date, hotelCheckinTime, hotelCheckoutTime) {
        var deferred = $q.defer();

        constructHkWorkPriority(deferred, date, hotelCheckinTime, hotelCheckoutTime);

        return deferred.promise;
    };

    /*
     * This function will return the data structure for HK Work Priority
     */
    this.hkOverview = function(date, isArrivalsManagement) {
        var deferred = $q.defer();

        constructHkOverview(deferred, date, isArrivalsManagement);

        return deferred.promise;
    };

    var constructHkOverview = function(deferred, date, isArrivalsManagement) {
        var hkOverview = {
            dashboard_type: 'house_keeping_overview',
            label: 'AN_HOUSEKEEPING_OVER_VIEW',
            data: []
        };
        var isOverview = isArrivalsManagement ? false : true;

        // Pushing arrivals data structure
        hkOverview.data.push(buildArrivals(that.activeReservations, date, isOverview, isArrivalsManagement));
        // Pushing departure data structure
        hkOverview.data.push(buildDepartures(that.activeReservations, date, isOverview, isArrivalsManagement));
        // Pushing Stayovers data structure
        hkOverview.data.push(buildStayOvers(that.activeReservations, that.roomStatuses, date));
        // Pushing vacant data structure
        hkOverview.data.push(buildVacants(that.activeReservations, that.roomStatuses, isOverview, isArrivalsManagement));

        deferred.resolve(hkOverview);
    };

    /*
     * Moved the complex data structure building to front-end to help server to scale by using more load on UI
     */
    var constructHkWorkPriority = function(deferred, date, hotelCheckinTime, hotelCheckoutTime) {
        var workPriority = {
            dashboard_type: 'work_priority',
            label: 'AN_WORK_PRIORITY_CHART',
            data: []
        };

        // Pushing arrivals data structure
        workPriority.data.push(buildArrivals(that.activeReservations, date, false, hotelCheckinTime));
        // Pushing vacant data structure
        workPriority.data.push(buildVacants(that.activeReservations, that.roomStatuses, false));
        // Pushing departure data structure
        workPriority.data.push(buildDepartures(that.activeReservations, date, false, hotelCheckoutTime));
        deferred.resolve(workPriority);
    };

    var buildDepartures = function buildDepartures(activeReservations, date, overview, hotelCheckoutTime) {
        var departures = activeReservations.filter(function(reservation) {
            return reservation.departure_date === date;
        });
        var departedCount = departures.filter(function(reservation) {
            return reservation.reservation_status === 'CHECKEDOUT';
        }).length;

        var lateCheckoutCount = departures.filter(function(reservation) {
            return reservation.reservation_status === 'CHECKEDIN' && isLateCheckout(reservation, hotelCheckoutTime);
        }).length;

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
            type: 'pending',
            count: remainingCount,
            label: 'AN_PENDING'
        });
        return departues;
    };

    var buildVacants = function buildVacants(activeReservations, roomStatuses, overview, isArrivalsManagement) {
        var rooms = roomStatuses;
        var dataType = 'rooms';
        var dataLabel = 'AN_ROOMS';

        if (!overview && !isArrivalsManagement) {
            var assignedRoomNumbers = activeReservations.filter(function(reservation) {
                return reservation.reservation_status === 'CHECKEDIN';
            }).map(function(reservation) {
                return reservation.arrival_room_number;
            });
            
            rooms = rooms.filter(function(room) {
                return !assignedRoomNumbers.includes(room.room_number);
            });
            dataType = 'vacant';
            dataLabel = 'AN_VACANT';
        }

        var inspectedCount = rooms.filter(function(room) {
            return room.status === 'INSPECTED';
        }).length;
        var cleanCount = rooms.filter(function(room) {
            return room.status === 'CLEAN';
        }).length;
        var dirtyCount = rooms.filter(function(room) {
            return room.status === 'DIRTY';
        }).length;
        var pickupCount = rooms.filter(function(room) {
            return room.status === 'PICKUP';
        }).length;

        var vacantRoomsData = {
            type: dataType,
            label: dataLabel
        };

        if (overview) {
            vacantRoomsData.contents = {
                left_side: [{
                    type: 'clean',
                    count: cleanCount,
                    label: 'AN_CLEAN'
                }, {
                    type: 'inspected',
                    count: inspectedCount,
                    label: 'AN_INSPECTED'
                }],
                right_side: [{
                    type: 'dirty',
                    count: dirtyCount,
                    label: 'AN_DIRTY'
                }, {
                    type: 'pickup',
                    count: pickupCount,
                    label: 'PICKUP'
                }]
            };
        } else {
            vacantRoomsData.contents = {
                left_side: [{
                    type: 'dirty',
                    count: dirtyCount,
                    label: 'AN_DIRTY'
                }, {
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
            };
        }
        return vacantRoomsData;
    };

    var buildArrivals = function buildArrivals(activeReservations, date, overview, hotelCheckinTime) {
        var arrivals = activeReservations.filter(function(reservation) {
            return reservation.arrival_date === date;
        }); // Performed checkin that day

        var perfomedCount = arrivals.filter(function(reservation) {
            return reservation.reservation_status === 'CHECKEDIN';
        }).length;

        var earlyCheckinCount = arrivals.filter(function(reservation) {
            return reservation.reservation_status === 'RESERVED' && isEarlyCheckin(reservation, hotelCheckinTime);
        }).length;

        var remainingCount = arrivals.length - perfomedCount - earlyCheckinCount;
        var arrivalsData = {
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
        }; // For work priority we need to calculate immediate arrivals

        if (!overview) {
            arrivalsData.contents.right_side.push({
                type: 'early_checkin',
                count: earlyCheckinCount,
                label: 'AN_EARLY_CHECKIN'
            });
        }

        arrivalsData.contents.right_side.push({
            type: 'remaining',
            count: remainingCount,
            label: 'AN_REMAINING'
        });
        return arrivalsData;
    };

    var buildStayOvers = function buildStayOvers(activeReservations, roomStatuses, date) {
        var stayOvers = activeReservations.filter(function(reservation) {
            return reservation.reservation_status === 'CHECKEDIN' && reservation.departure_date !== date;
        });
        var cleanAndInspectedRooms = roomStatuses.filter(function(room) {
            return room.status === 'INSPECTED' || room.status === 'CLEAN';
        }).map(function(room) {
            return room.room_number;
        });
        var cleanAndInspectedStayOversCount = stayOvers.filter(function(reservation) {
            return cleanAndInspectedRooms.includes(reservation.arrival_room_number);
        }).length;
        var dirtyOrPickupRoomsCount = stayOvers.length - cleanAndInspectedStayOversCount;
        
        return {
            type: 'stayovers',
            label: 'AN_STAYOVERS',
            contents: {
                left_side: [{
                    type: 'perfomed',
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

    /*
     * Function to determine if a reservation is early checkin
     */
    var isEarlyCheckin = function(reservation, hotelCheckinTime) {
        var eta = new Date(reservation.eta_hz);
        var hotelStdCheckinTime = new Date(hotelCheckinTime);

        if(hotelStdCheckinTime.getHours() > eta.getHours()) {
            return true;
        } else if (hotelStdCheckinTime.getHours() === eta.getHours()) {
            return hotelStdCheckinTime.getMinutes() > eta.getMinutes();
        }
        return false;
    };

    /*
     * Function to determine if a reservation is late checkout
     */
    var isLateCheckout = function(reservation, hotelCheckoutTime) {
        var etd = new Date(reservation.etd_hz);
        var hotelStdCheckoutTime = new Date(hotelCheckoutTime);

        if(hotelStdCheckoutTime.getHours() < etd.getHours()) {
            return true;
        } else if (hotelStdCheckoutTime.getHours() === etd.getHours()) {
            return hotelStdCheckoutTime.getMinutes() < etd.getMinutes();
        }
        return false;
    };

    /*
     * Function to determine if a reservation is VIP or not
     */
    var isVip = function(reservation) {
        return reservation.vip === 't';
    };
}]);
