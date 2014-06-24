angular.module('houseKeepingModule', [])
	.config(function($stateProvider, $urlRouterProvider, $translateProvider){

    $stateProvider.state('rover.houseKeeping', {
        abstract : true,
        url: '/houseKeeping',
        templateUrl: '/assets/partials/houseKeeping/rvHouse.html'
    });

    $stateProvider.state('rover.houseKeeping.dashboard', {
        url: '/dashboard',
        templateUrl: '/assets/partials/houseKeeping/rvHouseDashboard.html',
        controller: 'RVHouseDashboardCtrl'
    });
});