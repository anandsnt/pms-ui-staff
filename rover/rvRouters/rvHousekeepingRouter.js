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

    $stateProvider.state('rover.housekeeping.roomStatus', {
        url: '/roomStatus',
        templateUrl: '/assets/partials/housekeeping/rvHkRoomStatus.html',
        controller: 'RVHkRoomStatusCtrl',
        resolve: {
            fetchedRoomList: function(RVHkRoomStatusSrv) {
                return RVHkRoomStatusSrv.roomList;
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