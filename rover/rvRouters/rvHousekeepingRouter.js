angular.module('housekeepingModule', [])
	.config(function($stateProvider, $urlRouterProvider, $translateProvider){

    $stateProvider.state('rover.housekeeping', {
        abstract : true,
        url: '/housekeeping',
        templateUrl: '/assets/partials/housekeeping/rvHousekeeping.html',
        controller: 'RVHkAppCtrl'
    });

    $stateProvider.state('rover.housekeeping.dashboard', {
        url: '/dashboard',
        templateUrl: '/assets/partials/housekeeping/rvHkDashboard.html',
        controller: 'RVHkDashboardCtrl',
        resolve: {
            dashboardData: function(RVHkDashboardSrv) {
                return RVHkDashboardSrv.fetch();
            }
        }
    });

    $stateProvider.state('rover.housekeeping.search', {
        url: '/search',
        templateUrl: '/assets/partials/housekeeping/rvHkSearch.html',
        controller: 'RVHkSearchCtrl',
        resolve: {
            fetchedRoomList: function(RVHkSearchSrv) {
                return RVHkSearchSrv.roomList;
            }
        }
    });

    $stateProvider.state('rover.housekeeping.roomDetails', {
        url: '/roomDetails/:id',
        templateUrl: '/assets/partials/housekeeping/rvHkRoomDetails.html',
        controller: 'RVHkRoomDetailsCtrl',
        resolve: {
            roomDetailsData: function(RVHkRoomDetailsSrv, $stateParams) {
                return RVHkRoomDetailsSrv.fetch( $stateParams.id );
            }
        }
    });
});