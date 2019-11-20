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

        this.getDistributionData = function() {
            return [{
                year: "2006",
                redDelicious: "10",
                mcintosh: "15",
                oranges: "9",
                pears: "6"
            }, {
                year: "2007",
                redDelicious: "12",
                mcintosh: "18",
                oranges: "9",
                pears: "4"
            }, {
                year: "2008",
                redDelicious: "05",
                mcintosh: "20",
                oranges: "8",
                pears: "2"
            }, {
                year: "2009",
                redDelicious: "01",
                mcintosh: "15",
                oranges: "5",
                pears: "4"
            }, {
                year: "2010",
                redDelicious: "02",
                mcintosh: "10",
                oranges: "4",
                pears: "2"
            }, {
                year: "2011",
                redDelicious: "03",
                mcintosh: "12",
                oranges: "6",
                pears: "3"
            }, {
                year: "2012",
                redDelicious: "04",
                mcintosh: "15",
                oranges: "8",
                pears: "1"
            }, {
                year: "2013",
                redDelicious: "06",
                mcintosh: "11",
                oranges: "9",
                pears: "4"
            }, {
                year: "2014",
                redDelicious: "10",
                mcintosh: "13",
                oranges: "9",
                pears: "5"
            }, {
                year: "2015",
                redDelicious: "16",
                mcintosh: "19",
                oranges: "6",
                pears: "9"
            }, {
                year: "2016",
                redDelicious: "19",
                mcintosh: "17",
                oranges: "5",
                pears: "7"
            }];
        }


        this.getColorsMappings = function() {
            return ["#ff0029", "#377eb8", "#66a61e", "#984ea3", "#00d2d5", "#ff7f00", "#af8d00", "#7f80cd", "#b3e900", "#c42e60", "#a65628", "#f781bf", "#8dd3c7", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#fccde5", "#bc80bd", "#ffed6f", "#c4eaff", "#cf8c00", "#1b9e77", "#d95f02", "#e7298a", "#e6ab02", "#a6761d", "#0097ff", "#00d067", "#000000", "#252525", "#525252", "#737373", "#969696", "#bdbdbd", "#f43600", "#4ba93b", "#5779bb", "#927acc", "#97ee3f", "#bf3947", "#9f5b00", "#f48758", "#8caed6", "#f2b94f", "#eff26e", "#e43872", "#d9b100", "#9d7a00", "#698cff", "#d9d9d9"];
        };
    }
]);