angular.module('housekeepingModule', [])
	.config(function($stateProvider, $urlRouterProvider, $translateProvider){

    $stateProvider.state('rover.housekeeping', {
        abstract : true,
        url: '/housekeeping',
        templateUrl: '/assets/partials/housekeeping/rvHousekeeping.html',
        controller: 'RVHkAppCtrl'
    });

    $stateProvider.state('rover.housekeeping.roomStatus', {
        url: '/roomStatus/:roomStatus',
        templateUrl: '/assets/partials/housekeeping/rvHkRoomStatus.html',
        controller: 'RVHkRoomStatusCtrl',
        resolve: {
            fetchedRoomList: function(RVHkRoomStatusSrv, $stateParams) {
                if(typeof $stateParams !== 'undefined' && typeof $stateParams.roomStatus !== 'undefined' && $stateParams.roomStatus != null){
                    var filterStatus = {
                        'INHOUSE_DIRTY': ['dirty', 'arrived'],
                        'INHOUSE_CLEAN': ['clean', 'arrived'],
                        'DEPARTURES_DIRTY': ['dueout', 'departed', 'dirty'],
                        'DEPARTURES_CLEAN': ['departed', 'clean'],
                    }
                    var filtersToApply = filterStatus[$stateParams.roomStatus];
                    for(var i = 0; i < filtersToApply.length; i++){
                        RVHkRoomStatusSrv.currentFilters[filtersToApply[i]] = true;
                    }
                }
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