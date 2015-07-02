sntRover.service('RVReservationBaseSearchSrv', ['$q', 'rvBaseWebSrvV2',
    function($q, RVBaseWebSrvV2) {
        var that = this;

        this.fetchBaseSearchData = function() {
            var deferred = $q.defer();

            that.fetchBussinessDate = function() {
                var url = '/api/business_dates/active';
                RVBaseWebSrvV2.getJSON(url).then(function(data) {
                    that.reservation.businessDate = data.business_date;
                    deferred.resolve(that.reservation);
                }, function(errorMessage) {
                    deferred.reject(errorMessage);
                });
                return deferred.promise;
            };

            that.fetchRoomTypes = function() {
                var url = 'api/room_types.json?is_exclude_pseudo=true';
                RVBaseWebSrvV2.getJSON(url).then(function(data) {
                    that.reservation.roomTypes = data.results;
                    that.fetchBussinessDate();
                }, function(errorMessage) {
                    deferred.reject(errorMessage);
                });
                return deferred.promise;
            };

            var url = '/api/hotel_settings/show_hotel_reservation_settings';
            RVBaseWebSrvV2.getJSON(url).then(function(data) {
                that.reservation = {};
                that.reservation.settings = data;
                that.fetchRoomTypes();
            }, function(errorMessage) {
                deferred.reject(errorMessage);
            });
            return deferred.promise;
        };

        this.fetchCompanyCard = function(data) {
            var deferred = $q.defer();
            var url = '/api/accounts';
            RVBaseWebSrvV2.getJSON(url, data).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };


        this.fetchCurrentTime = function() {
            var deferred = $q.defer();
            var url = '/api/hotel_current_time';
            RVBaseWebSrvV2.getJSON(url).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.fetchAvailability = function(param) {
            var deferred = $q.defer();
            var url = '/api/availability?from_date=' + param.from_date + '&to_date=' + param.to_date + '&override_restrictions=true';
            if (typeof param.company_id != 'undefined' && param.company_id != '' && param.company_id != null) {
                url += '&company_id=' + param.company_id;
            }

            if (typeof param.travel_agent_id != 'undefined' && param.travel_agent_id != '' && param.travel_agent_id != null) {
                url += '&travel_agent_id=' + param.travel_agent_id;
            }

            RVBaseWebSrvV2.getJSON(url).then(function(data) {
                deferred.resolve(data);
            }, function(errorMessage) {
                deferred.reject(errorMessage);
            });
            return deferred.promise;
        };
        this.fetchMinTime = function() {
            var deferred = $q.defer();
            var url = '/api/hourly_rate_min_hours';
            RVBaseWebSrvV2.getJSON(url).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.fetchSortPreferences = function() {
            var deferred = $q.defer(),
                url = '/api/sort_preferences/list_selections';
            RVBaseWebSrvV2.getJSON(url).then(function(data) {
                deferred.resolve(data.room_rates);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }

        this.fetchAddonsForRates = function() {
            var deferred = $q.defer(),
                url = '/api/addons/rate_addons';
            RVBaseWebSrvV2.getJSON(url).then(function(data) {
                deferred.resolve(data.rate_addons);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        this.hasAnyConfiguredAddons = function(params) {
            var deferred = $q.defer();
            var url = '/api/addons/configured';
            RVBaseWebSrvV2.getJSON(url, params).then(function(data) {                
                deferred.resolve(data.addons_configured);
            }, function(errorMessage) {
                deferred.reject(errorMessage);
            });
            return deferred.promise;
        };
    }
]);