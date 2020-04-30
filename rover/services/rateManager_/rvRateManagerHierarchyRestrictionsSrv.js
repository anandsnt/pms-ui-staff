angular.module('sntRover').service('rvRateManagerHierarchyRestrictionsSrv', ['$q', 'BaseWebSrvV2', 'rvRateManagerRestrictionsSrv',
    function($q, BaseWebSrvV2, rvRateManagerRestrictionsSrv) {
        // Exclusive service for hierarchy restrictions
        var service = this,
            houseUrl = '/api/restrictions/house',
            roomTypeUrl = '/api/restrictions/room_types',
            rateTypeUrl = '/api/restrictions/rate_types',
            rateUrl = '';

        service.fetchHouseRestrictions = (params) => {
            return this.getJSON(houseUrl, params)
        };
        service.fetchRoomTypeRestrictions = (params) => {};
        service.fetchRateTypeRestrictions = (params) => {};
        service.fetchRateRestrictions = (params) => {};

        service.saveHouseRestrictions = (params) => {
            return this.postJSON(houseUrl, params);
        };
        service.saveRoomTypeRestrictions = (params) => {};
        service.saveRateTypeRestrictions = (params) => {};
        service.saveRateRestrictions = (params) => {};

        /**
         * utility method as getJSON is repeating all the time
         * @param  {String} url
         * @param  {Object} params
         * @return {Object} Promise
         */
        this.getJSON = (url, params, keyFromResult) => {
            var deferred = $q.defer();

            BaseWebSrvV2.getJSON(url, params).then(function(data) {
                deferred.resolve(keyFromResult ? data[keyFromResult] : data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        /**
         * utility method as postJSON is repeating all the time
         * @param  {String} url
         * @param  {Object} params
         * @return {Object} Promise
         */
        this.postJSON = (url, params) => {
            var deferred = $q.defer();

            BaseWebSrvV2.postJSON(url, params)
                .then(data => {
                    deferred.resolve(data);
                }, error => {
                    deferred.reject(error);
                });
            return deferred.promise;
        };
    }
]);
