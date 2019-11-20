angular.module('sntRover').service('rvManagersAnalyticsSrv', [
    '$q',
    'sntActivity',
    'rvBaseWebSrvV2',
    function($q, sntActivity, rvBaseWebSrvV2) {

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

        this.distributions = function(params) {
            var deferred = $q.defer();

            var url = '/redshift/analytics/distributions';

            rvBaseWebSrvV2.getJSON(url, params)
                .then(function(data) {
                    deferred.resolve(formatDistribution(data));
                }, function(data) {
                    deferred.reject(data);
                });

            return deferred.promise;
        };

        var formatDistribution = function(distributions) {
            var formatedData = {};

            distributions.forEach(function(distribution) {
                if (formatedData[distribution.date] === undefined) {
                    formatedData[distribution.date] = [];
                }
                formatedData[distribution.date].push(distribution);
            });

            return formatedData;
        };

    }
]);