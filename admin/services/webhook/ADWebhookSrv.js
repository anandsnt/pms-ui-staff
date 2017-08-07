angular.module('admin').service('ADWebhookSrv', ['$http', '$q', 'ADBaseWebSrvV2', '$log',
    function ($http, $q, ADBaseWebSrvV2, $log) {
        var service = this;

        service.fetchConfig = function () {
            var deferred = $q.defer();
            var url = 'api/billing_groups.json';

            ADBaseWebSrvV2.getJSON(url).then(function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        };
    }
]);
