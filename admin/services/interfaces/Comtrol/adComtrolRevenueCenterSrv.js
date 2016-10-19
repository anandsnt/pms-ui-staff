admin.service('adComtrolRevenueCenterSrv', ['$http', '$q', 'ADBaseWebSrvV2', function($http, $q, ADBaseWebSrvV2) {
    /**
     *
     * @returns {deferred.promise|{then, catch, finally}}
     */
    this.fetch = function() {
        var deferred = $q.defer();
        var url = '';

        ADBaseWebSrvV2.getJSON(url).then(function(data) {
            deferred.resolve([]);
        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };


}]);