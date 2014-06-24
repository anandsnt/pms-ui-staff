angular.module('houseKeepingModule', [])
    .config(function($stateProvider, $urlRouterProvider, $translateProvider) {

        //define module-specific routes here
        $stateProvider.state('rover.houseKeeping', {
        	abstract : true,
            url: '/house',
            templateUrl: '/assets/rover/partials/houseKeeping/rvHouse.html',
            controller: 'RVHouseMainCtrl'
        });

        $stateProvider.state('rover.houseKeeping.dashboard', {
            url: '/dashboard',
            templateUrl: '/assets/rover/partials/houseKeeping/rvHouseDashboard.html',
            controller: 'RVHouseDashboardCtrl'
        });
});