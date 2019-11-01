angular.module('sntRover').service('rvAnalyticsSrv', ['$q', 'rvBaseWebSrvV2', function($q, rvBaseWebSrvV2) {

    // This flag is used to understand the required APIs are called
    var calledHKApis = false;

    var that = this;

    // Variables for API returned data
    that.activeReservations = null;
    that.yesterdaysReservations = null;
    that.roomStatuses = null;
    that.selectedRoomType = "";
    that.hotelCheckinTime = null;
    that.hotelCheckoutTime = null;

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
    this.fetchRoomStatus = function(params) {

        // Webservice calling section
        var deferred = $q.defer();
        var url = 'redshift/analytics/room_status';

        rvBaseWebSrvV2.getJSON(url, params)
            .then(function(data) {

                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
        return deferred.promise;
    };

    this.initRoomAndReservationApis = function(params) {

        var deferred = $q.defer();
        var completedResCall = false;
        var completedRoomsCall = false;

        var isFromFrontDesk = params.isFromFrontDesk;

        that.fetchActiveReservation(params).then(function (data) {
            that.activeReservations = data;

            // From House keeping
            completedResCall = true;

            if (completedRoomsCall) {
                calledHKApis = true;
                deferred.resolve();
            }

        });

        if (isFromFrontDesk) {
            var yesterday = moment(params.date).subtract(1, 'days')
                                .format('YYYY-MM-DD');
            that.fetchActiveReservation({ date: yesterday }).then(function (yesterdaysReservations) {
               that.yesterdaysReservations = yesterdaysReservations
            });

        }

        that.fetchRoomStatus(params).then(function (data) {
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
     * Apply filter on active reservations
     */
    this.filteredReservations = function() {
        var reservations = that.activeReservations;
        // Filter reservations by room type
        if (that.selectedRoomType) {
            reservations = that.filterReservationsByRoomType(reservations, that.selectedRoomType);
        };
        return reservations;
    };

    /*
     * Filtered yesterdays reservations
     */
    this.filteredYesterdaysReservations = function() {
        var reservations = that.yesterdaysReservations;
        // Filter reservations by room type
        if (that.selectedRoomType) {
            reservations = that.filterReservationsByRoomType(reservations, that.selectedRoomType);
        };
        return reservations;
    };

    this.filterdRoomStatuses = function() {
        var rooms = that.roomStatuses;
        // Filter reservations by room type
        if (that.selectedRoomType) {
            rooms = that.roomStatuses.filter(function(room) {
                return room.room_type === that.selectedRoomType;
            });
        }
        return rooms;
    };

    /*
     * When controller initialize set the hotel checkin and checkout time
     */
    this.setHotelCiCoTime = function(hotelDetails) {
        that.hotelCheckinTime = hotelDetails.hotel_checkin_time;
        that.hotelCheckoutTime = hotelDetails.hotel_checkout_time;
    };

    /*
     * This function will return the data structure for HK Work Priority
     */
    this.hkWorkPriority = function(date) {
        var deferred = $q.defer();

        constructHkWorkPriority(deferred, date);

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

        var reservations = that.filteredReservations();

        var rooms = that.filterdRoomStatuses();

        // Pushing arrivals data structure
        hkOverview.data.push(buildArrivals(reservations, date, isOverview));
        // Pushing departure data structure
        hkOverview.data.push(buildDepartures(reservations, date, isOverview));
        // Pushing Stayovers data structure
        hkOverview.data.push(buildStayOvers(reservations, rooms, date));
        // Pushing vacant data structure
        hkOverview.data.push(buildVacants(reservations, rooms, isOverview, isArrivalsManagement));

        deferred.resolve(hkOverview);
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

        var reservations = that.filteredReservations();

        var rooms = that.filterdRoomStatuses();

        // Pushing arrivals data structure
        workPriority.data.push(buildArrivals(reservations, date, false));
        // Pushing vacant data structure
        workPriority.data.push(buildVacants(reservations, rooms, false));
        // Pushing departure data structure
        workPriority.data.push(buildDepartures(reservations, date, false));
        deferred.resolve(workPriority);
    };

    var buildDepartures = function(activeReservations, date, overview) {
        var departures = activeReservations.filter(function(reservation) {
            return reservation.departure_date === date;
        });
        var departedCount = departures.filter(function(reservation) {
            return reservation.reservation_status === 'CHECKEDOUT';
        }).length;

        var lateCheckoutCount = departures.filter(function(reservation) {
            return reservation.reservation_status === 'CHECKEDIN' && that.isLateCheckout(reservation);
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

        departues.contents.right_side.push({
            type: 'pending',
            count: remainingCount,
            label: 'AN_PENDING'
        });

        if (!overview) {
            departues.contents.right_side.push({
                type: 'late_checkout',
                count: lateCheckoutCount,
                label: 'AN_LATE_CHECKOUT'
            });
        }

        return departues;
    };

    var buildVacants = function(activeReservations, roomStatuses, overview, isArrivalsManagement) {
        var rooms = roomStatuses;
        var dataType = 'rooms';
        var dataLabel = 'AN_ROOMS';

        var assignedRoomNumbers = activeReservations.filter(function(reservation) {
            return reservation.reservation_status === 'CHECKEDIN';
        }).map(function(reservation) {
            return reservation.arrival_room_number;
        });

        rooms = rooms.filter(function(room) {
            return !assignedRoomNumbers.includes(room.room_number);
        });

        if (!isArrivalsManagement && !overview) {
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

    var buildArrivals = function(activeReservations, date, overview) {
        var arrivals = activeReservations.filter(function(reservation) {
            return reservation.arrival_date === date;
        }); // Performed checkin that day

        var perfomedCount = arrivals.filter(function(reservation) {
            return reservation.reservation_status === 'CHECKEDIN';
        }).length;

        var earlyCheckinCount = 0;

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
            earlyCheckinCount = arrivals.filter(function(reservation) {
                return reservation.reservation_status === 'RESERVED' && that.isEarlyCheckin(reservation);
            }).length;
            arrivalsData.contents.right_side.push({
                type: 'early_checkin',
                count: earlyCheckinCount,
                label: 'AN_EARLY_CHECKIN'
            });
        }

        var remainingCount = arrivals.length - perfomedCount - earlyCheckinCount;

        arrivalsData.contents.right_side.push({
            type: 'remaining',
            count: remainingCount,
            label: 'AN_REMAINING'
        });
        return arrivalsData;
    };

    var buildStayOvers = function(activeReservations, roomStatuses, date) {
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
    this.isEarlyCheckin = function(reservation) {
        var eta = moment(reservation.eta_hz);
        var hotelStdCheckinTime = moment(that.hotelCheckinTime);

        if (hotelStdCheckinTime.hours() > eta.hours()) {
            return true;
        } else if (hotelStdCheckinTime.hours() === eta.hours()) {
            return hotelStdCheckinTime.minutes() > eta.minutes();
        }
        return false;
    };

    /*
     * Function to determine if a reservation is late checkout
     */
    this.isLateCheckout = function(reservation) {
        var etd = moment(reservation.etd_hz);
        var hotelStdCheckoutTime = moment(that.hotelCheckoutTime);

        if (hotelStdCheckoutTime.hours() < etd.hours()) {
            return true;
        } else if (hotelStdCheckoutTime.hours() === etd.hours()) {
            return hotelStdCheckoutTime.minutes() < etd.minutes();
        }
        return false;
    };

    /*
     * Function to determine if a reservation is VIP or not
     */
    this.isVip = function(reservation) {
        return reservation.vip === 't';
    };

    this.filterReservationsByRoomType = function(reservations, roomType) {
      return reservations.filter(function(reservation) {
          return reservation.arrival_room_type === roomType || reservation.departure_room_type === roomType;
      });
    };
}]);
