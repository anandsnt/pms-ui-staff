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

        this.getPrefinedValuesForDate = function(bussinessDate, date) {
            var today = bussinessDate;
            var definedDates = [{
                "value": "Yesterday",
                "date": moment(today).subtract(1, 'day').format("YYYY-MM-DD")
            }, {
                "value": "Today-2",
                "date": moment(today).subtract(2, 'day').format("YYYY-MM-DD")
            }, {
                "value": "Today-3",
                "date": moment(today).subtract(3, 'day').format("YYYY-MM-DD")
            }, {
                "value": "Today-4",
                "date": moment(today).subtract(4, 'day').format("YYYY-MM-DD")
            }, {
                "value": "Today-5",
                "date": moment(today).subtract(5, 'day').format("YYYY-MM-DD")
            }, {
                "value": "Today-6",
                "date": moment(today).subtract(6, 'day').format("YYYY-MM-DD")
            }];

            var isPredefinedDate = function(date) {
                return _.find(definedDates, function(definedDate) {
                    return definedDate.date === date;
                });
            };

            if (date === today) {
                return today;
            } else if (isPredefinedDate(date)) {
                return isPredefinedDate(date).value;
            }

            return date;

        };
    }
]);