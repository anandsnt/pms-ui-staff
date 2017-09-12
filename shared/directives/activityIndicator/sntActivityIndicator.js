angular.module('sntActivityIndicator', [])
    .directive('activityIndicator',
        function () {
            return {
                template: '<div ng-show="hasLoader" id="loading"><div id="loading-spinner" ></div></div> ',
                controller: ['$log', '$scope', '$timeout', '$rootScope', 'sntActivity',
                    function ($log, $scope, $timeout, $rootScope, sntActivity) {
                        var stats = {
                            showLoader: 0,
                            hideLoader: 0
                        };

                        $scope.$on('showLoader', function () {
                            stats.showLoader++;
                            sntActivity.handleLegacyShow();
                        });

                        $scope.$on('hideLoader', function () {
                            $timeout(function () {
                                sntActivity.handleLegacyHide();
                            }, 100);
                            stats.hideLoader++;
                        });
                    }]
            };
        }
    )
    .service('sntActivity', ['$log', '$rootScope', '$timeout',
        function ($log, $rootScope, $timeout) {
            var service = this,
                activities = [],
                updateIndicator = function () {
                    $timeout(function () {
                        $rootScope.hasLoader = activities.length;
                    }, 300);
                };

            service.start = function (activity) {
                activities.push(activity);
                updateIndicator();
            };

            service.stop = function (activity) {
                var index = activities.indexOf(activity);

                if (activities.length && index > -1) {
                    activities.splice(index, 1);
                    updateIndicator();
                } else if (index === -1) {
                    $log.warn('trying to stop a non-existent activity...', activity);
                }
            };

            service.handleLegacyHide = function () {
                updateIndicator();
            };

            service.handleLegacyShow = function () {
                $rootScope.hasLoader = true;
            };

        }
    ]);
