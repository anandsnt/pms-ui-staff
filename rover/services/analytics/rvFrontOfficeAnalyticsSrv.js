angular.module('sntRover').service('rvFrontOfficeAnalyticsSrv', [
	'$q',
	'rvBaseWebSrvV2',
	'rvAnalyticsSrv',
	function($q, rvBaseWebSrvV2, rvAnalyticsSrv) {

		this.fetchFrontDeskAnalyticsData = function(params) {
			var url = '/sample_json/dashboard/dashboardAnalytics.json';

			return rvBaseWebSrvV2.getJSON(url, params);
		};

		this.fdArrivalsManagement = function(date) {
            var deferred = $q.defer();

            rvAnalyticsSrv.hkOverview(date).then(function(response) {
                response.label = 'AN_ARRIVALS_MANAGEMENT';
                response.dashboard_type = 'arrivals_management_chart';
                response.data = _.reject(response.data, function(data){
                    return data.type === 'stayovers';
                });
                response.data = _.sortBy(response.data, function(data) {
                    if (data.type === 'arrivals') {
                        return 0;
                    } else if (data.type === "rooms") {
                        return 1;
                    } else {
                        return 3;
                    }
                });
                deferred.resolve(response);
            });

            return deferred.promise;
        };

		this.fdWorkload = function(date) {
            var deferred = $q.defer();
            constructFdWorkLoad(deferred, date);
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

            var arrivingReservations = rvAnalyticsSrv.activeReservations.filter(function(reservation){
                return reservation.arrival_date === date;
            });

            var departingReservations = rvAnalyticsSrv.activeReservations.filter(function(reservation){
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
                    var elementInUnderscore = element.split(/(?=[A-Z])/).join('_').toLowerCase();
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
            var userInitData = {
                earlyCheckin: 0,
                checkin: 0,
                vipCheckin: 0,
                vipCheckout: 0,
                checkout: 0,
                lateCheckout: 0
            };
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
            reservations.forEach(function(reservation){
                var user = 'REMAINING';
                if (reservation.reservation_status !== 'RESERVED') {
                    if (reservation.ci_agent === null ) {
                        return;
                    } else {
                        user = reservation.ci_agent;
                    }
                }

                if (typeof usersActivity[user] === 'undefined') {
                    usersActivity[user] = $.extend({}, userInitData);
                };

                if (isVip(reservation)) {
                    usersActivity[user].vipCheckin = usersActivity[user].vipCheckin + 1;
                } else if(isEarlyCheckin(reservation)) {
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
            reservations.forEach(function(reservation){
                var user = 'REMAINING';
                if (reservation.reservation_status !== 'CHECKEDIN') {
                    if (reservation.co_agent === null ) {
                        return;
                    } else {
                        user = reservation.co_agent;
                    }
                }

                if (typeof usersActivity[user] === 'undefined') {
                    usersActivity[user] = $.extend({}, userInitData);
                };

                if (isVip(reservation)) {
                    usersActivity[user].vipCheckout = usersActivity[user].vipCheckout + 1;
                } else if(isLateCheckout(reservation)) {
                    usersActivity[user].lateCheckout = usersActivity[user].lateCheckout + 1;
                } else {
                    usersActivity[user].checkout = usersActivity[user].checkout + 1;
                }
            });
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
