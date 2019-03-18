admin.service('ADChannelMgrSrv', ['$http', '$q', 'ADBaseWebSrvV2', 'ADBaseWebSrv',
    function ($http, $q, ADBaseWebSrvV2, ADBaseWebSrv) {

        /*
         * Service function to toggle activate/de-activate rate
         * @params {object} id
         */
        this.toggleActivate = function (params) {
            var id = params.id;
            var deferred = $q.defer();
            var url = "/api/channel_managers/" + id + "/activate";
            

            ADBaseWebSrvV2.putJSON(url, params).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };
        
        this.fetchManagers = function (data) {
            var deferred = $q.defer();

            var url = "/api/channel_managers.json";

            ADBaseWebSrvV2.getJSON(url, data).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };
        
        this.fetchMinimalRateDetails = function (data) {
            var deferred = $q.defer();

            var url = "api/rates/minimal",
                params = data;

            ADBaseWebSrvV2.getJSON(url, params).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        /**
         * Fetch rates configured to a channel manager
         * @param id
         * @returns {*}
         */
        this.fetchChannelRates = function(payLoad) {
            return ADBaseWebSrvV2.getJSON('/api/channel_managers/' + payLoad.interfaceId + '/rates', payLoad);
        };
        
        this.fetchRates = function (data) {
            var deferred = $q.defer();

            var url = "/api/rates.json";

            ADBaseWebSrvV2.getJSON(url, data).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };
        
        
        this.getRoomTypesByRate = function (data) {
            var deferred = $q.defer();

                var url = '/api/rates/' + data.id;

            ADBaseWebSrvV2.getJSON(url, data).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };
        
        this.fetchRoomTypes = function() {
                var deferred = $q.defer();
                var url = '/admin/room_types.json';

                ADBaseWebSrvV2.getJSON(url).then(function(data) {
                        deferred.resolve(data);
                }, function(data) {
                        deferred.reject(data);
                });
                return deferred.promise;
        };
        this.deleteRateOnChannel = function(data) {
                var deferred = $q.defer();
                var url = '/api/channel_managers/' + data.channel_manager_id + '/channel_manager_rates/' + data.channel_manager_rate_id;

                ADBaseWebSrvV2.deleteJSON(url).then(function(data) {
                        deferred.resolve(data);
                }, function(data) {
                        deferred.reject(data);
                });
                return deferred.promise;
        };

        this.fetchManagerDetails = function(data) {
            return ADBaseWebSrvV2.getJSON('/api/channel_managers/' + data.id);
        };

        this.add = function (params) {
            return ADBaseWebSrvV2.postJSON('/api/channel_managers/' + params.channelId + '/channel_manager_rates', {
                rate_id: params.rate,
                room_type_ids: params.roomTypes
            });
        };

        this.update = function (params) {
            return ADBaseWebSrvV2.putJSON('/api/channel_managers/' + params.channelId + '/channel_manager_rates/' + params.id, {
                rate_id: params.rate,
                room_type_ids: params.roomTypes,
                active: true
            });
        };

    }
]);
