sntRover.service('RVReservationBaseSearchSrv', ['$q', 'rvBaseWebSrvV2',
    function($q, RVBaseWebSrvV2) {
        var that = this;

        this.fetchBaseSearchData = function() {
            var deferred = $q.defer();

            that.fetchRoomTypes = function() {
                var url = 'api/room_types.json';
                RVBaseWebSrvV2.getJSON(url).then(function(data) {
                    that.reservation.roomTypes = data.results;
                    deferred.resolve(that.reservation);
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
            var url = '/api/accounts/search_account';
            RVBaseWebSrvV2.postJSON(url, data).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.fetchRoomRates = function(data) {
            var deferred = $q.defer();
            var url = 'api/room_types.json';
            RVBaseWebSrvV2.getJSON(url).then(function(data) {
                deferred.resolve({
                    tax: 20,
                    rooms: [{
                        "room_type": [{
                            "level": 1,
                            "category_name": "Standard Room",
                            "avg_rate": 149,
                            "rates": [{
                                "rate_name": "Best Available Rate",
                                "summary": ["Winter Promotional Rate - Room Only. Taxes included. Different daily rates listed.",
                                    "Cancel by 4PM on 27-DEC-12 to avoid a penalty charge of 05.00.",
                                    "Cancel by 4:00 PM on 12/27/2014 to avoid a penalty charge of 105.00.",
                                    "A deposit is not required to guarantee your reservation."
                                ],
                                "rate_breakdown": [100, 100]
                            }, {
                                "rate_name": "Second Best Available Rate",
                                "summary": ["Winter Promotional Rate - Room Only. Taxes included. Different daily rates listed.",
                                    "Cancel by 4PM on 27-DEC-12 to avoid a penalty charge of 05.00.",
                                    "Cancel by 4:00 PM on 12/27/2014 to avoid a penalty charge of 105.00.",
                                    "A deposit is not required to guarantee your reservation."
                                ],
                                "rate_breakdown": [100, 100]
                            }]
                        }, {
                            "level": 1,
                            "category_name": "Second Room",
                            "avg_rate": 189,
                            "rates": [{
                                "rate_name": "Best Available Rate",
                                "summary": ["Winter Promotional Rate - Room Only. Taxes included. Different daily rates listed.",
                                    "Cancel by 4PM on 27-DEC-12 to avoid a penalty charge of 05.00.",
                                    "Cancel by 4:00 PM on 12/27/2014 to avoid a penalty charge of 105.00.",
                                    "A deposit is not required to guarantee your reservation."
                                ],
                                "rate_breakdown": [100, 100, 100]
                            }]
                        }],
                        "recommended": [],
                        "rate": []
                    }]
                });
            }, function(errorMessage) {
                deferred.reject(errorMessage);
            });
            return deferred.promise;
        };
    }
]);