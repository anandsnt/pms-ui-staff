angular.module('snt.transitionManager',
    ['ui.router'])
    .run(['$rootScope', '$transitions', 'transitions', '$log', '$window',
        function ($rootScope, $transitions, transitionsSrv, $log, $window) {

            $transitions.onSuccess({}, function (transition) {
                var deepIndex;

                if (transition.from().name === transition.to().name) {
                    $log.info('State refresh observed');
                } else if (!transitionsSrv.isInitial() &&
                    transitionsSrv.isBackNavigation(transition)) {
                    transitionsSrv.pop();
                } else if ((deepIndex = transitionsSrv.isDeep(transition)) >= 0) {
                    transitionsSrv.clearLoop(deepIndex + 1);
                } else {
                    transitionsSrv.push(transition);
                }

                if ($window['dataLayer']) {
                    $window['dataLayer'].push({
                        event: 'sntPageView',
                        attributes: {
                            route: transition.to().name.replace(/\./g, '/'),
                            stateParams: transition.params()
                        }
                    });
                }

                transitionsSrv.debug();
            });

            $transitions.onStart({}, function (transition) {
                if (!transitionsSrv.isInitial() &&
                    transitionsSrv.isBackNavigation(transition)) {
                    transition.options().custom['isBack'] = true;
                }
            });

        }
    ])
    .service('transitions', ['$log',
        function ($log) {
            var service = this,
                transitions = [];

            service.isInitial = function () {
                return !transitions.length;
            };

            service.push = function (transition) {
                transitions.push(angular.copy(transition));
            };

            service.pop = function () {
                transitions.pop();
            };

            service.get = function (idx) {
                idx = idx || transitions.length - 1;

                return transitions[idx];
            };

            service.clearLoop = function (transitionIndex) {
                transitions.splice(transitionIndex);
            };

            service.isDeep = function (transition) {
                return transitions.map(
                    function (transition) {
                        return transition.to().name;
                    }
                ).indexOf(transition.to().name);
            };

            service.isBackNavigation = function (next) {
                var prev = service.get();

                return next.from().name === prev.to().name &&
                    prev.from().name === next.to().name;
            };

            service.debug = function () {
                var style = 'background: green; color: white; display: block;';

                $log.info('%c' + transitions.map(function (transition) {
                    return transition.to().name;
                }).join('--/--'), style);
            };
        }
    ]);
