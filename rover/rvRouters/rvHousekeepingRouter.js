angular.module('housekeepingModule', [])
	.config(function($stateProvider, $urlRouterProvider, $translateProvider){

    $stateProvider.state('rover.housekeeping', {
        abstract : true,
        url: '/housekeeping',
        templateUrl: '/assets/partials/housekeeping/rvHousekeeping.html'
    });

    $stateProvider.state('rover.housekeeping.dashboard', {
        url: '/dashboard',
        templateUrl: '/assets/partials/housekeeping/rvHkDashboard.html',
        controller: 'RVHkDashboardCtrl'
    });
});