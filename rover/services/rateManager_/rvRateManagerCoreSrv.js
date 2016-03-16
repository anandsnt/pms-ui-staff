angular.module('sntRover').service('rvRateManagerCoreSrv', ['$q', 'BaseWebSrvV2',
    function ($q, BaseWebSrvV2) {

        /**
         * A. MULTIPLE RATES
         *      /api/daily/rates
         *      Request Params
         *          1. rate_type_ids
         *          2. rate_ids
         *          3. name_card_ids
         *          4. group_by
         *          5. order_id
         *          6. from_date
         *          7. to_date
         * B. ALL ROOM TYPES
         *      /api/daily_rates/room_restrictions
         *      Request Params
         *          1. from_date
         *          2. to_date
         *          3. order_id
         * C. INDIVIDUAL RATE
         *      /api/daily_rates/:id
         *      Request Params
         *          1. from_date
         *          2. to_date
         *          3. order_id
         */

        var service = this;

        service.fetchMultipleRateInfo = function (params) {
            var url = '/api/daily_rates/';
            var deferred = $q.defer();
            BaseWebSrvV2.getJSON(url, params).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        service.fetchAllRoomTypesInfo = function (params) {
            var url = '/api/daily_rates/room_restrictions';
            var deferred = $q.defer();
            BaseWebSrvV2.getJSON(url, params).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        service.fetchSingleRateInfo = function (params) {
            var url = '/api/daily_rates/' + params.rate_id;
            var deferred = $q.defer();
            BaseWebSrvV2.getJSON(url, params).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        service.fetchRates = function () {
            var url = '/api/rates/detailed';
            var deferred = $q.defer();
            BaseWebSrvV2.getJSON(url).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };        

        service.fetchRatesAndDailyRates = function (params) {
            var promises = [],
                rates = [],
                dailyRateAndRestrictions = [],
                deferred = $q.defer();

            promises.push(service.fetchMultipleRateInfo(params).then(function(data) {
                dailyRateAndRestrictions = data.results;
            }));
            promises.push(service.fetchRates().then(function(data) {
                rates = data.results;
            }));

            $q.all(promises).then(function(data) {
                deferred.resolve({
                    rates,
                    dailyRateAndRestrictions
                });
            });

            return deferred.promise;
        }; 

    }
]);