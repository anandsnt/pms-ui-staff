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
                    "physical_count": 177,
                    "rates": [{
                        "id": 1,
                        "name": "First Rate",
                        "rate_description": "First Rate Description",
                        "deposit_requests": "",
                        "cancellation_policy": ""
                    }],
                    "room_types": [{
                        "id": 1,
                        "name": "2 Bedroom Suites SEA",
                        "physical_count": 6,
                        "max_occupancy": null,
                        "level": 1,
                        "room_type_description": "2 Bed Room Suite"
                    }, {
                        "id": 2,
                        "name": "Deluxe Room",
                        "physical_count": 39,
                        "max_occupancy": null,
                        "level": 1,
                        "room_type_description": "2 Bed Room Suite"
                    }, {
                        "id": 3,
                        "name": "Deluxe Twin",
                        "physical_count": 40,
                        "max_occupancy": null,
                        "level": 1,
                        "room_type_description": "2 Bed Room Suite"
                    }, {
                        "id": 4,
                        "name": "Junior Suite",
                        "physical_count": 12,
                        "max_occupancy": null,
                        "room_type_description": "2 Bed Room Suite"
                    }, {
                        "id": 53,
                        "name": "Posting",
                        "physical_count": 1,
                        "max_occupancy": null,
                        "level": 1,
                        "room_type_description": "2 Bed Room Suite"
                    }, {
                        "id": 26,
                        "name": "Posting Interface",
                        "physical_count": 0,
                        "level": 1,
                        "max_occupancy": null,
                        "room_type_description": "2 Bed Room Suite"
                    }, {
                        "id": 5,
                        "name": "Posting Master",
                        "physical_count": 16,
                        "max_occupancy": null,
                        "level": 1,
                        "room_type_description": "2 Bed Room Suite"
                    }, {
                        "id": 54,
                        "name": "Posting Master",
                        "physical_count": 1,
                        "max_occupancy": 5,
                        "level": 1,
                        "room_type_description": "2 Bed Room Suite"
                    }, {
                        "id": 17,
                        "name": "Super Suites",
                        "physical_count": 2,
                        "max_occupancy": null,
                        "level": 1,
                        "room_type_description": "2 Bed Room Suite"
                    }, {
                        "id": 6,
                        "name": "Standard Room- King Bed",
                        "physical_count": 31,
                        "max_occupancy": null,
                        "level": 1,
                        "room_type_description": "2 Bed Room Suite"
                    }, {
                        "id": 7,
                        "name": "Standard Room- Double Beds",
                        "physical_count": 29,
                        "max_occupancy": null,
                        "level": 1,
                        "room_type_description": "2 Bed Room Suite"
                    }],
                    "results": [{
                        "date": "2014-05-27",
                        "house": {
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 177
                        },
                        "room_types": [{
                            "id": 1,
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 6
                        }, {
                            "id": 2,
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 39
                        }, {
                            "id": 3,
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 40
                        }, {
                            "id": 4,
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 12
                        }, {
                            "id": 53,
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 1
                        }, {
                            "id": 26,
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 0
                        }, {
                            "id": 5,
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 16
                        }, {
                            "id": 54,
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 1
                        }, {
                            "id": 17,
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 2
                        }, {
                            "id": 6,
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 31
                        }, {
                            "id": 7,
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 29
                        }],
                        "rates": [{
                            "id": 1,
                            "room_rates": [{
                                "room_type_id": 1,
                                "sold": 0,
                                "sell_limit": null,
                                "availability": 6,
                                "single": 10,
                                "double": 12,
                                "extra_adult": 13,
                                "child": 12,
                                "restrictions": [

                                ]
                            }]
                        }]
                    }, {
                        "date": "2014-05-28",
                        "house": {
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 177
                        },
                        "room_types": [{
                            "id": 1,
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 6
                        }, {
                            "id": 2,
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 39
                        }, {
                            "id": 3,
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 40
                        }, {
                            "id": 4,
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 12
                        }, {
                            "id": 53,
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 1
                        }, {
                            "id": 26,
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 0
                        }, {
                            "id": 5,
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 16
                        }, {
                            "id": 54,
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 1
                        }, {
                            "id": 17,
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 2
                        }, {
                            "id": 6,
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 31
                        }, {
                            "id": 7,
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 29
                        }],
                        "rates": [{
                            "id": 1,
                            "room_rates": [{
                                "room_type_id": 1,
                                "sold": 0,
                                "sell_limit": null,
                                "availability": 6,
                                "single": null,
                                "double": null,
                                "extra_adult": null,
                                "child": null,
                                "restrictions": [

                                ]
                            }]
                        }]
                    }, {
                        "date": "2014-05-29",
                        "house": {
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 177
                        },
                        "room_types": [{
                            "id": 1,
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 6
                        }, {
                            "id": 2,
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 39
                        }, {
                            "id": 3,
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 40
                        }, {
                            "id": 4,
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 12
                        }, {
                            "id": 53,
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 1
                        }, {
                            "id": 26,
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 0
                        }, {
                            "id": 5,
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 16
                        }, {
                            "id": 54,
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 1
                        }, {
                            "id": 17,
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 2
                        }, {
                            "id": 6,
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 31
                        }, {
                            "id": 7,
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 29
                        }],
                        "rates": [{
                            "id": 1,
                            "room_rates": [{
                                "room_type_id": 1,
                                "sold": 0,
                                "sell_limit": null,
                                "availability": 6,
                                "single": null,
                                "double": null,
                                "extra_adult": null,
                                "child": null,
                                "restrictions": [

                                ]
                            }]
                        }]
                    }, {
                        "date": "2014-05-30",
                        "house": {
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 177
                        },
                        "room_types": [{
                            "id": 1,
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 6
                        }, {
                            "id": 2,
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 39
                        }, {
                            "id": 3,
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 40
                        }, {
                            "id": 4,
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 12
                        }, {
                            "id": 53,
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 1
                        }, {
                            "id": 26,
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 0
                        }, {
                            "id": 5,
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 16
                        }, {
                            "id": 54,
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 1
                        }, {
                            "id": 17,
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 2
                        }, {
                            "id": 6,
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 31
                        }, {
                            "id": 7,
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 29
                        }],
                        "rates": [{
                            "id": 1,
                            "room_rates": [{
                                "room_type_id": 1,
                                "sold": 0,
                                "sell_limit": null,
                                "availability": 6,
                                "single": null,
                                "double": null,
                                "extra_adult": null,
                                "child": null,
                                "restrictions": [

                                ]
                            }]
                        }]
                    }, {
                        "date": "2014-05-31",
                        "house": {
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 177
                        },
                        "room_types": [{
                            "id": 1,
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 6
                        }, {
                            "id": 2,
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 39
                        }, {
                            "id": 3,
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 40
                        }, {
                            "id": 4,
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 12
                        }, {
                            "id": 53,
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 1
                        }, {
                            "id": 26,
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 0
                        }, {
                            "id": 5,
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 16
                        }, {
                            "id": 54,
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 1
                        }, {
                            "id": 17,
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 2
                        }, {
                            "id": 6,
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 31
                        }, {
                            "id": 7,
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 29
                        }],
                        "rates": [{
                            "id": 1,
                            "room_rates": [{
                                "room_type_id": 1,
                                "sold": 0,
                                "sell_limit": null,
                                "availability": 6,
                                "single": null,
                                "double": null,
                                "extra_adult": null,
                                "child": null,
                                "restrictions": [

                                ]
                            }]
                        }]
                    }, {
                        "date": "2014-06-01",
                        "house": {
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 177
                        },
                        "room_types": [{
                            "id": 1,
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 6
                        }, {
                            "id": 2,
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 39
                        }, {
                            "id": 3,
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 40
                        }, {
                            "id": 4,
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 12
                        }, {
                            "id": 53,
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 1
                        }, {
                            "id": 26,
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 0
                        }, {
                            "id": 5,
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 16
                        }, {
                            "id": 54,
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 1
                        }, {
                            "id": 17,
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 2
                        }, {
                            "id": 6,
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 31
                        }, {
                            "id": 7,
                            "sold": 0,
                            "sell_limit": null,
                            "availability": 29
                        }],
                        "rates": [{
                            "id": 1,
                            "room_rates": [{
                                "room_type_id": 1,
                                "sold": 0,
                                "sell_limit": null,
                                "availability": 6,
                                "single": null,
                                "double": null,
                                "extra_adult": null,
                                "child": null,
                                "restrictions": [

                                ]
                            }]
                        }]
                    }],
                    "total_count": 6
                });
            }, function(errorMessage) {
                deferred.reject(errorMessage);
            });
            return deferred.promise;
        };
    }
]);