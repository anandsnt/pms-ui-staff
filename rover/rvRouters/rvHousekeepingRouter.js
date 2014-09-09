angular.module('housekeepingModule', [])
    .config(function($stateProvider, $urlRouterProvider, $translateProvider) {

        $stateProvider.state('rover.housekeeping', {
            abstract: true,
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
                    if (!$stateParams) {
                        return false;
                    };

                    if (!!$stateParams.roomStatus) {
                        var filterStatus = {
                            'INHOUSE_DIRTY': ['dirty', 'stayover'],
                            'INHOUSE_CLEAN': ['clean', 'stayover'],
                            'DEPARTURES_DIRTY': ['dueout', 'departed', 'dirty'],
                            'DEPARTURES_CLEAN': ['departed', 'clean'],
                            'OCCUPIED': ['occupied'],
                            'VACANT_READY': ['vacant', 'clean', 'inspected'],
                            'VACANT_NOT_READY': ['vacant', 'dirty', 'out_of_order'],
                            'OUTOFORDER_OR_SERVICE': ['out_of_order', 'out_of_service'],
                        }
                        var filtersToApply = filterStatus[$stateParams.roomStatus];
                        for (var i = 0; i < filtersToApply.length; i++) {
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
                    return RVHkRoomDetailsSrv.fetch($stateParams.id);
                }
            }
        });

        /**
         * House Keeping Routes for WorkManagement
         * CICO-8605, CICO-9119 and CICO-9120
         */

        $stateProvider.state('rover.workManagement', {
            abstract: true,
            url: '/workmanagement',
            templateUrl: '/assets/partials/workManagement/rvWorkManagement.html'
        });

        $stateProvider.state('rover.workManagement.start', {
            url: '/start',
            templateUrl: '/assets/partials/workManagement/rvWorkManagementLanding.html',
            controller: 'RVWorkManagementCtrl'
        });

        $stateProvider.state('rover.workManagement.multiSheet', {
            url: '/multisheet',
            templateUrl: '/assets/partials/workManagement/rvWorkManagementMultiSheet.html'
        });

        $stateProvider.state('rover.workManagement.new', {
            url: '/new',
            templateUrl: '/assets/partials/workManagement/rvWorkManagementNewWorkSheet.html'
        });


    });