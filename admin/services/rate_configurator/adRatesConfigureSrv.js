admin.service('ADRatesConfigureSrv', ['$http', '$q', 'ADBaseWebSrvV2', '$rootScope',
    function ($http, $q, ADBaseWebSrvV2, $rootScope) {
        var that = this;

        this.fetchSetsInDateRange = function (data) {
            var deferred = $q.defer();
            var url = "/api/rate_date_ranges/" + data.id,
                params = {};

            if(!!data.child_rate_id) {
                params.child_rate_id =  data.child_rate_id;
            }

            ADBaseWebSrvV2.getJSON(url, params).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.saveHourlySet = function(data){
            var deferred = $q.defer();
            var url = "/api/rate_sets";

            ADBaseWebSrvV2.postJSON(url, data).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.updateHourlySet = function(data){
            var deferred = $q.defer();
            var url = "/api/rate_sets/"+ data.id;

            ADBaseWebSrvV2.putJSON(url, data).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.saveSet = function (data) {

            var deferred = $q.defer();
            var url = "/api/rate_date_ranges/" + data.dateRangeId +"/rate_sets";
            delete data['id'];
            delete data['dateRangeId'];

            ADBaseWebSrvV2.postJSON(url, data).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

        this.updateSet = function (data) {
            var deferred = $q.defer();
            var url = "/api/rate_sets/" + data.id;
            delete data['id'];
            delete data['dateRangeId'];

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

        this.rateManagerStatusCheck = function (data) {
            var deferred = $q.defer();
            var id = data.id;
            var url = '/api/rate_sets/'+id+'/custom_rate_check';
            ADBaseWebSrvV2.getJSON(url).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };

    }
]);