sntRover.service('RVReservationBaseSearchSrv', ['$q', 'rvBaseWebSrvV2',
    function($q, RVBaseWebSrvV2) {
        var that = this;
        this.reservation = {
                                'settings':{},
                                'roomTypes':{},
                                'businessDate':{}
                            };



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

            if(isEmpty(that.reservation.settings) && isEmpty(that.reservation.roomTypes) && isEmpty(that.reservation.businessDate)){
                var url = '/api/hotel_settings/show_hotel_reservation_settings';
                RVBaseWebSrvV2.getJSON(url).then(function(data) {        
                    that.reservation.settings = data;
                    that.fetchRoomTypes();
                }, function(errorMessage) {
                    deferred.reject(errorMessage);
                });
            }else{
                deferred.resolve(that.reservation);
            };
            
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

        this.autoCompleteCodes = function(data) {
            var deferred = $q.defer();
            var url = '/api/code_search';
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

            if (!!param.company_id) {
                url += '&company_id=' + param.company_id;
            }

            if (!!param.travel_agent_id) {
                url += '&travel_agent_id=' + param.travel_agent_id;
            }

            if (!!param.group_id) {
                url += '&group_id=' + param.group_id;
            }
            
            if (!!param.promotion_code) {
                url += '&promotion_code=' + encodeURI(param.promotion_code);//to handle special characters
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
        };

        this.fetchAddonsForRates = function(params) {
            var deferred = $q.defer(),
                url = '/api/addons/rate_addons';
            RVBaseWebSrvV2.getJSON(url, params).then(function(data) {
                deferred.resolve(data.rate_addons);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

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

        this.getActivePromotions = function() {
            var deferred = $q.defer();
            var url = '/api/promotions?is_active=true';
            RVBaseWebSrvV2.getJSON(url).then(function(data) {
                deferred.resolve(data);
            }, function(errorMessage) {
                deferred.reject(errorMessage);
            });
            return deferred.promise;
        };

        this.fetchUserMemberships = function(guestId) {
            var deferred = $q.defer();
            var url = '/staff/user_memberships.json?user_id=' + guestId;
            RVBaseWebSrvV2.getJSON(url).then(function(response) {
                deferred.resolve(response.data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.checkOverbooking = function(params) {
            var deferred = $q.defer();
            var url = '/api/availability/overbooking_check';
            RVBaseWebSrvV2.getJSON(url, params).then(function(response) {
                deferred.resolve(response.results);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };
    }
]);