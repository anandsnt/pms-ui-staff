angular.module('sntRover').service('RVRoomRatesSrv', ['$q', 'rvBaseWebSrvV2', 'RVReservationBaseSearchSrv',
    function($q, RVBaseWebSrvV2, RVReservationBaseSearchSrv) {

        var service = this;

        //--------------------------------------------------------------------------------------------------------------
        // A. Private Methods


        //--------------------------------------------------------------------------------------------------------------
        // B. Private Methods

        service.fetchRoomTypeADRs = function(params, isInitial) {
            var deferred = $q.defer(),
                url = "/api/availability/room_type_adrs";
            if(isInitial){
                params.per_page = 2;
                params.page = 1;
            }
            RVBaseWebSrvV2.getJSON(url, params).then(function(response) {
                deferred.resolve(response);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };


        service.fetchRateADRs = function(params) {
            var deferred = $q.defer(),
                url = "/api/availability/rate_adrs";
            RVBaseWebSrvV2.getJSON(url, params).then(function(response) {
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
                promises.push(service.fetchRateADRs(params).then(function(response) {
                    data = response;
                }));
            } else {
                promises.push(service.fetchRoomTypeADRs(params, true).then(function(response) {
                    data = response;
                }));
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