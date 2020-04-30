angular.module('sntRover').service('rvRateManagerHierarchyRestrictionsSrv', ['$q', 'BaseWebSrvV2',
    function($q, BaseWebSrvV2) {
        // Exclusive service for hierarchy restrictions
        var service = this,
            houseUrl = '/api/restrictions/house';

        service.fetchHouseRestrictions = (params) => {
            return this.getJSON(houseUrl, params)
        };
        service.fetchRoomTypeRestrictions = () => {};
        service.fetchRateTypeRestrictions = () => {};
        service.fetchRateRestrictions = () => {};

        service.saveHouseRestrictions = (params) => {
            return this.postJSON(houseUrl, params);
        };
        service.saveRoomTypeRestrictions = () => {};
        service.saveRateTypeRestrictions = () => {};
        service.saveRateRestrictions = () => {};

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
