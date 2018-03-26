angular.module('snt.transitionManager',
    ['ui.router'])
    .run(['$rootScope', '$transitions', 'transitions', '$log',
        function ($rootScope, $transitions, transitionsSrv, $log) {
            $transitions.onSuccess({}, function (transition) {
                if (transition.from().name === transition.to().name) {
                    $log.info('State refresh observed');
                } else if (!transitionsSrv.isInitial() &&
                    transitionsSrv.isBackNavigation(transition)) {
                    transitionsSrv.pop();
                } else if (transitionsSrv.isDeep(transition)) {
                    // TODO: Handle DSR looping back to a deep previous state here!
                } else {
                    transitionsSrv.push(transition);
                }

                transitionsSrv.debug();
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

            service.isDeep = function (transition) {
              return false;
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
