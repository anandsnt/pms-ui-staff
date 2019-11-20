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
                    var isAggregated = params.group_by !== undefined;

                    deferred.resolve(formatDistribution(data, params.chart_type, isAggregated));
                }, function(data) {
                    deferred.reject(data);
                });

            return deferred.promise;
        };

        var formatDistribution = function(distributions, resultType, isAggregated) {
            var dataByDate = {};

            distributions.forEach(function(distribution) {
                if (dataByDate[distribution.date] === undefined) {
                    dataByDate[distribution.date] = [];
                }
                dataByDate[distribution.date].push(distribution);
            });

            var formatedData = [];

            Object.keys(dataByDate).forEach(function(date) {
                var dateElement = { date: date };
                var dateDatas = dataByDate[date];
                dateDatas.forEach(function(dateData) {
                    if (isAggregated) {
                        dateElement[dateData.value] = dateData[resultType];
                    } else {
                        dateElement[resultType] = dateData[resultType];
                    }
                });
                formatedData.push(dateElement);
            });

            return formatedData;
        };
    }
]);
