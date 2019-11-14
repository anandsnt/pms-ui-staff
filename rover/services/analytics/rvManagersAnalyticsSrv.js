angular.module('sntRover').service('rvManagersAnalyticsSrv', [
    '$q',
    'sntActivity',
    'rvBaseWebSrvV2',
    'rvAnalyticsSrv',
    function($q, sntActivity, rvBaseWebSrvV2, rvAnalyticsSrv) {

        this.roomPerformanceKPR = function(params) {
            var deferred = $q.defer();

            var url = '/redshift/analytics/room_performance_kpr';

            rvBaseWebSrvV2.getJSON(url, params)
                .then(function(data) {
                    deferred.resolve(data);
                }, function(data) {
                    deferred.reject(data);
                });

            return deferred.promise;
        };
    }]);
