admin.service('adLightSpeedPOSSetupSrv', ['$http', '$q', 'ADBaseWebSrvV2',
    function($http, $q, ADBaseWebSrvV2) {

        var service = this;

        /**
         * to get the LightSpeedPOS configuration values
         * @return {promise|{then, catch, finally}|*}
         */
        service.fetchLightSpeedPOSConfiguration = function() {
            var deferred = $q.defer(),
                url = '/api/hotel_settings/lightspeed';

            ADBaseWebSrvV2.getJSON(url).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        /**
         * to save the LightSpeedPOS configration values
         * @return {undefined}
         */
        service.saveLightSpeedPOSConfiguration = function(params) {
            var deferred = $q.defer(),
                url = '/api/hotel_settings/lightspeed';

            ADBaseWebSrvV2.postJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        service.deleteRestaurant = function(restaurantId) {
            var deferred = $q.defer(),
                url = 'api/hotel_settings/restaurants/' + restaurantId + '.json';

            ADBaseWebSrvV2.deleteJSON(url).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        service.updateRestaurant = function(restaurant) {
            var deferred = $q.defer(),
                url = 'api/hotel_settings/restaurants/' + restaurant.id + '.json';

            ADBaseWebSrvV2.putJSON(url, restaurant).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };


        service.getCompaniesList = function() {
            var deferred = $q.defer(),
                url = 'api/hotel_settings/restaurants/companies.json';

            ADBaseWebSrvV2.getJSON(url).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });

            return deferred.promise;
        };

        service.getRestaurants = function() {
            var deferred = $q.defer(),
                url = '/api/hotel_settings/restaurants.json';

            ADBaseWebSrvV2.getJSON(url).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });

            return deferred.promise;
        };

        service.createRestaurant = function(params) {
            var deferred = $q.defer(),
                url = '/api/hotel_settings/restaurants.json';

            ADBaseWebSrvV2.postJSON(url, params).then(function(data) {
                deferred.resolve(data);
            }, function(data) {
                deferred.reject(data);
            });

            return deferred.promise;
        };

    }
]);