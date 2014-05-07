admin.service('ADRatesConfigureSrv', ['$http', '$q', 'ADBaseWebSrvV2', '$rootScope',
    function ($http, $q, ADBaseWebSrvV2, $rootScope) {

        this.fetchSetsInDateRange = function (data) {
            var deferred = $q.defer();
            var url = "/api/rate_date_ranges/" + data.id;
            ADBaseWebSrvV2.getJSON(url).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.saveSet = function (data) {
            var deferred = $q.defer();
            var url = "/api/rate_sets/" + data.id;
            ADBaseWebSrvV2.putJSON(url, data).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };
        this.deleteSet = function (id) {

            var deferred = $q.defer();
            var url = "/api/rate_sets/" + id;
            ADBaseWebSrvV2.deleteJSON(url).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;

        };
        this.updateDateRange = function (data) {
            var deferred = $q.defer();
            var id = data.dateId;
            var url = "/api/rate_date_ranges/" + id;
            ADBaseWebSrvV2.putJSON(url, data).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

    }
]);