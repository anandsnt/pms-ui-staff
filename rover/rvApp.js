var sntRover = angular.module('sntRover', ['ui.router', 'ui.utils', 'ng-iscroll', 'ngAnimate', 'ngDialog',
    'ngSanitize', 'ngTable', 'highcharts-ng'
]);
sntRover.run(['$rootScope', '$state', '$stateParams',
    function ($rootScope, $state, $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
    }
]);