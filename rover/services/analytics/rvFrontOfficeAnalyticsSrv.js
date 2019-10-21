angular.module('sntRover').service('rvFrontOfficeAnalyticsSrv', [
    '$q',
    'sntActivity',
    'rvBaseWebSrvV2',
    'rvAnalyticsSrv',
    function($q, sntActivity, rvBaseWebSrvV2, rvAnalyticsSrv) {

        // This variable is used in FO activity and Workload
        var userInitData = {
            earlyCheckin: 0,
            checkin: 0,
            vipCheckin: 0,
            vipCheckout: 0,
            checkout: 0,
            lateCheckout: 0
        };

        this.fetchFrontDeskAnalyticsData = function(params) {
            var url = '/sample_json/dashboard/dashboardAnalytics.json';

            return rvBaseWebSrvV2.getJSON(url, params);
        };

        /*
         * Front desk arrivals and stay-overs data
         */
        this.fdArrivalsManagement = function(date) {
            var deferred = $q.defer();

            rvAnalyticsSrv.hkOverview(date).then(function(response) {
                response.label = 'AN_ARRIVALS_MANAGEMENT';
                response.dashboard_type = 'arrivals_management_chart';
                response.data = _.reject(response.data, function(data) {
                    return data.type === 'stayovers';
                });
                response.data = _.sortBy(response.data, function(data) {
                    var index;

                    if (data.type === 'arrivals') {
                        index = 0;
                    } else if (data.type === "rooms") {
                        index = 1;
                    } else {
                        index = 3;
                    }
                    return index;
                });
                deferred.resolve(response);
            });

            return deferred.promise;
        };

        /*
         * Front desk workload data
         */
        this.fdWorkload = function(date) {
            var deferred = $q.defer();

            constructFdWorkLoad(deferred, date);
            return deferred.promise;
        };


        this.fdFoActivity = function(date) {
            var deferred = $q.defer();

            var yesterday = moment(date).subtract(1, 'days').format('YYYY-MM-DD');

            sntActivity.start('YESTERDAYS_RESERVATION');

            rvAnalyticsSrv.fetchActiveReservation({ date: yesterday }).then(function(yesterdaysReservations) {
                rvAnalyticsSrv.yesterdaysReservations = yesterdaysReservations;

                constructFoActivity(date, yesterday, deferred);

            }).finally(function(){
                sntActivity.stop('YESTERDAYS_RESERVATION');
            });

            return deferred.promise;
        };

        /*
         * Constructing the front desk workload graphs
         */
        var constructFdWorkLoad = function(deferred, date) {
            var fdWorkLoad = {
                dashboard_type: 'frontdesk_workload',
                label: 'AN_WORKLOAD',
                data: []
            };

            var arrivingReservations = rvAnalyticsSrv.activeReservations.filter(function(reservation) {
                return reservation.arrival_date === date;
            });

            var departingReservations = rvAnalyticsSrv.activeReservations.filter(function(reservation) {
                return reservation.departure_date === date;
            });

            var userActivity = constructUserCiCoActivity(arrivingReservations, departingReservations);

            var users = Object.keys(userActivity);

            var elements = ['earlyCheckin', 'checkin', 'vipCheckin', 'vipCheckout', 'checkout', 'lateCheckout'];

            users.forEach(function(user) {
                var userActivityElement = {
                    type: user,
                    label: user,
                    contents: {
                        right_side: []
                    }
                };

                elements.forEach(function(element) {
                    var elementInUnderscore = element.split(/(?=[A-Z])/).join('_')
                                              .toLowerCase();

                    userActivityElement.contents.right_side.push({
                        type: elementInUnderscore,
                        label: "AN_" + elementInUnderscore.toUpperCase(),
                        count: userActivity[user][element]
                    });
                });
                // Pushing each user's data
                fdWorkLoad.data.push(userActivityElement);
            });

            return deferred.resolve(fdWorkLoad);
        };

        /*
         * Construct the users checkin / checkout activity
         */
        var constructUserCiCoActivity = function(arrivals, departures) {
            var usersActivity = {};

            // Calculate the arrivals info
            constructUserCiActivity(arrivals, userInitData, usersActivity);


            // Calculate the departues info
            constructUserCoActivity(departures, userInitData, usersActivity);

            return usersActivity;
        };

        /*
         * Build the user's checkin reservatons activity
         */
        var constructUserCiActivity = function(reservations, userInitData, usersActivity) {
            reservations.forEach(function(reservation) {
                var user = 'REMAINING';

                if (reservation.reservation_status !== 'RESERVED') {
                    if (reservation.ci_agent === null) {
                        return;
                    } else {
                        user = reservation.ci_agent;
                    }
                }

                if (typeof usersActivity[user] === 'undefined') {
                    usersActivity[user] = $.extend({}, userInitData);
                }

                if (isVip(reservation)) {
                    usersActivity[user].vipCheckin = usersActivity[user].vipCheckin + 1;
                } else if (isEarlyCheckin(reservation)) {
                    usersActivity[user].earlyCheckin = usersActivity[user].earlyCheckin + 1;
                } else {
                    usersActivity[user].checkin = usersActivity[user].checkin + 1;
                }

            });
        };

        /*
         * Build the user's checkout reservatons activity
         */
        var constructUserCoActivity = function(reservations, userInitData, usersActivity) {
            reservations.forEach(function(reservation) {
                var user = 'REMAINING';

                if (reservation.reservation_status !== 'CHECKEDIN') {
                    if (reservation.co_agent === null) {
                        return;
                    } else {
                        user = reservation.co_agent;
                    }
                }

                if (typeof usersActivity[user] === 'undefined') {
                    usersActivity[user] = $.extend({}, userInitData);
                }

                if (isVip(reservation)) {
                    usersActivity[user].vipCheckout = usersActivity[user].vipCheckout + 1;
                } else if (isLateCheckout(reservation)) {
                    usersActivity[user].lateCheckout = usersActivity[user].lateCheckout + 1;
                } else {
                    usersActivity[user].checkout = usersActivity[user].checkout + 1;
                }
            });
        };

        /*
         * Build the data structure for FO CI/CO activity by hour basis
         */
        var constructFoActivity = function(today, yesterday, deferred) {
            var foActivity = {
                dashboard_type: 'frontdesk_activity',
                label: 'AN_FO_ACTIVITY',
                data: {}
            };

            initFoActivityDataStructure(foActivity);

            // Todays CI/CO data
            constructCiCoActivity(today, rvAnalyticsSrv.activeReservations, foActivity, true);
            // Yesterdays CI/CO data
            constructCiCoActivity(yesterday, rvAnalyticsSrv.yesterdaysReservations, foActivity, false);
            return deferred.resolve(foActivity);
        };


        var constructCiCoActivity = function(date, reservations, foActivity, isToday) {
            var arrivingReservations = reservations.filter(function(reservation) {
                return reservation.arrival_date === date;
            });

            var departingReservations = reservations.filter(function(reservation) {
                return reservation.departure_date === date;
            });

            buildCheckinActivity(arrivingReservations, foActivity, isToday);

            buildCheckoutActivity(departingReservations, foActivity, isToday);
        };


        // Build the checkin activity for todays and yesterdays arrivals
        var buildCheckinActivity = function(arrivals, foActivity, isToday) {
            arrivals.forEach(function(reservation) {
                var dayKey = 'yesterday';
                if (isToday) {
                    dayKey = 'today';
                }
                var hourActivity = foActivity.data[moment(reservation.eta_hz).format('h A')];

                if (isVip(reservation)) {
                    hourActivity[dayKey].vipCheckin = hourActivity[dayKey].vipCheckin + 1;
                } else if (isLateCheckout(reservation)) {
                    hourActivity[dayKey].earlyCheckin = hourActivity[dayKey].earlyCheckin + 1;
                } else {
                    hourActivity[dayKey].checkin = hourActivity[dayKey].checkin + 1;
                }

            });
        };

        // Build the checkout activity for todays and yesterdays departues
        var buildCheckoutActivity = function(departures, foActivity, isToday) {
            departures.forEach(function(reservation) {
                var dayKey = 'yesterday';
                if (isToday) {
                    dayKey = 'today';
                }
                var hourActivity = foActivity.data[moment(reservation.etd_hz).format('h A')];

                if (isVip(reservation)) {
                    hourActivity[dayKey].vipCheckout = hourActivity[dayKey].vipCheckout + 1;
                } else if (isLateCheckout(reservation)) {
                    hourActivity[dayKey].lateCheckout = hourActivity[dayKey].lateCheckout + 1;
                } else {
                    hourActivity[dayKey].checkout = hourActivity[dayKey].checkout + 1;
                }

            });
        };

        // Init the data for the structure
        var initFoActivityDataStructure = function(foActivity) {
            var date = new Date();
            // Construct the 6 AM to 5 AM
            for(var hour = 6; hour <= 29; hour ++) {
                foActivity.data[moment(date.setHours(hour)).format('h A')] = {
                    today: $.extend({}, userInitData),
                    yesterday: $.extend({}, userInitData)
                };
            }
        };

        /*
         * Function to determine if a reservation is early checkin
         */
        var isEarlyCheckin = function(reservation) {
            return false;
        };

        /*
         * Function to determine if a reservation is late checkout
         */
        var isLateCheckout = function(reservation) {
            return false;
        };

        /*
         * Function to determine if a reservation is VIP or not
         */
        var isVip = function(reservation) {
            return reservation.vip === 't';
        };
    }
]);
