angular.module('sntActivityIndicator', [])
    .directive('activityIndicator',
        function () {
            return {
                template: '<div ng-show="hasLoader" id="loading"><div id="loading-spinner" ></div></div> ',
                controller: ['$log', '$scope', '$timeout', function ($log, $scope, $timeout) {
                    var stats = {
                        showLoader: 0,
                        hideLoader: 0
                    };

                    $scope.$on('showLoader', function () {
                        $scope.hasLoader = true;
                        stats.showLoader++;
                        $log.info(stats);
                    });

                    $scope.$on('hideLoader', function () {
                        $timeout(function () {
                            $scope.hasLoader = false;
                        }, 100);
                        stats.hideLoader++;
                        $log.info(stats);
                    });
                }]
            };
        }
    )
    .service('sntActivity', ['$log',
        function ($log) {
            var service = this,
                activityStack = [];

            service.start = function (activity) {
                $log.info('start...', activity);
                activityStack.push(activity);
            };

            service.stop = function (activity) {
                $log.info('stop...', activity);
            };

            // ?
            service.pause = function (activity) {
                $log.info('stop...', activity);
            };
        }
    ]);
