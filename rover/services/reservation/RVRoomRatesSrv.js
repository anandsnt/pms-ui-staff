angular.module('sntRover').service('RVRoomRatesSrv', ['$q', 'rvBaseWebSrvV2', 'RVReservationBaseSearchSrv',
    function($q, RVBaseWebSrvV2, RVReservationBaseSearchSrv) {

        var service = this;

        //--------------------------------------------------------------------------------------------------------------
        // A. Private Methods
        var getInitialRoomTypeWithUpSell = function(params) {
            var deferred = $q.defer();
            service.fetchRoomTypeADRs(params, true).then(function(response) {
                if (response.results.length > 0) {
                    var levelOfBestRoom = RVReservationBaseSearchSrv.getRoomTypeLevel(response.results[0].id);
                    if (levelOfBestRoom > 0 && levelOfBestRoom < 3) {
                        var baseResults = response;
                        // Get the best room from the next level; If not found; stick to the original set of two
                        service.fetchRoomTypeADRs(params, false, levelOfBestRoom + 1).then(function(response) {
                            if (response.results > 0) {
                                baseResults.results[2] = response.results[1];
                            }
                            deferred.resolve(baseResults);
                        }, function(err) {
                            deferred.reject(err);
                        })
                    } else {
                        deferred.resolve(response);
                    }
                } else {
                    deferred.resolve(response);
                }

            }, function(er) {
                deferred.reject(err);
            });
            return deferred.promise;
        };

        //--------------------------------------------------------------------------------------------------------------
        // B. Private Methods

        service.fetchRoomTypeADRs = function(params, isInitial, level) {
            var deferred = $q.defer(),
                url = "/api/availability/room_type_adrs";
            if (isInitial) {
                params.per_page = 2;
                params.page = 1;
                params.order = "ROOM_LEVEL";
            }
            if (level) {
                params.per_page = 1;
                params.page = 1;
                params.level = level;
            }
            //CICO-27146
            params.exclude_pseudo = true;
            params.exclude_suite = true;

            RVBaseWebSrvV2.getJSON(url, params).then(function(response) {
                if (!!params.allotment_id || !!params.group_id) {
                    _.each(response.results, function(roomType) {
                        if (roomType.rate_id === null) {
                            roomType.rate_id = !!params.allotment_id ? 'ALLOTMENT_CUSTOM_' + params.allotment_id : 'GROUP_CUSTOM_' + params.group_id
                        }
                    });
                }
                deferred.resolve(response);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        service.fetchRateADRs = function(params) {
            var deferred = $q.defer(),
                url = "/api/availability/rate_adrs";
            //CICO-27146
            params.exclude_pseudo = true;
            params.exclude_suite = true;

            RVBaseWebSrvV2.getJSON(url, params).then(function(response) {
                if (!!params.allotment_id || !!params.group_id) {
                    _.each(response.results, function(rate) {
                        if (rate.id === null) {
                            rate.id = !!params.allotment_id ? 'ALLOTMENT_CUSTOM_' + params.allotment_id : 'GROUP_CUSTOM_' + params.group_id
                        }
                    });
                }
                deferred.resolve(response);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        service.fetchRatesInitial = function(params) {
            var defaultView = RVReservationBaseSearchSrv.getRoomRatesDefaultView(),
                promises = [],
                deferred = $q.defer(),
                data;
            if (defaultView === "RATE") {
                params.order = "ALPHABETICAL";
                promises.push(service.fetchRateADRs(params, true).then(function(response) {
                    data = response;
                }));
            } else {
                if(params.travel_agent_id || params.company_id
                         || params.group_id || params.allotment_id
                         || params.promotion_code || params.is_member == "true"){


                    promises.push(service.fetchRateADRs(params, true).then(function(response) {
                        data = response;
                    }));

                } else {
                    promises.push(getInitialRoomTypeWithUpSell(params, true).then(function(response) {
                        data = response;
                    }));

                }




            }

            $q.all(promises).then(function() {
                deferred.resolve(data);
            }, function(errorMessage) {
                deferred.reject(errorMessage);
            });

            return deferred.promise;
        };

        //--------------------------------------------------------------------------------------------------------------
        // C. Cache
    }
]);