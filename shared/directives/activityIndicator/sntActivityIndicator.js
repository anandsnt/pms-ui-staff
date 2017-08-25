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
    .service('sntActivity', ['$log', '$rootScope',
        function ($log, $rootScope) {
            var service = this,
                activityStack = [],
                updateIndicator = function () {
                    $rootScope.hasLoader = activityStack.length;
                };

            service.start = function (activity) {
                activityStack.push(activity);
                updateIndicator();
            };

            service.stop = function (activity) {
                activityStack.splice(_.indexOf(activityStack, activityStack.indexOf(activity)));
                updateIndicator();
            };

            service.handleLegacyHide = function () {
                updateIndicator();
            };

            service.handleLegacyShow = function () {
                $rootScope.hasLoader = true;
            };

        }
    ]);
