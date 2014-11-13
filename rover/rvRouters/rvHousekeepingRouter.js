angular.module('housekeepingModule', [])
    .config(function($stateProvider, $urlRouterProvider, $translateProvider) {

        $stateProvider.state('rover.housekeeping', {
            abstract: true,
            url: '/housekeeping',
            templateUrl: '/assets/partials/housekeeping/rvHousekeeping.html',
            controller: 'RVHkAppCtrl'
        });

        $stateProvider.state('rover.housekeeping.roomStatus', {
            url: '/roomStatus?roomStatus&businessDate',
            templateUrl: '/assets/partials/housekeeping/rvHkRoomStatus.html',
            controller: 'RVHkRoomStatusCtrl',
            resolve: {
                roomList: function(RVHkRoomStatusSrv, $stateParams, $rootScope) {
                    if (!!$stateParams && !!$stateParams.roomStatus) {
                        var filterStatus = {
                            'INHOUSE_DIRTY': ['dirty', 'stayover'],
                            'INHOUSE_CLEAN': ['clean', 'stayover'],
                            'DEPARTURES_DIRTY': ['dueout', 'departed', 'dirty'],
                            'DEPARTURES_CLEAN': ['dueout', 'departed', 'clean'],
                            'OCCUPIED': ['occupied'],
                            'VACANT_READY': ['vacant', 'clean', 'inspected'],
                            'VACANT_NOT_READY': ['vacant', 'dirty'],
                            'OUTOFORDER_OR_SERVICE': ['out_of_order', 'out_of_service'],
                            'QUEUED_ROOMS': ['queued']
                        }
                        var filtersToApply = filterStatus[$stateParams.roomStatus];
                        for (var i = 0; i < filtersToApply.length; i++) {
                            RVHkRoomStatusSrv.currentFilters[filtersToApply[i]] = true;
                        }
                    }
                    var businessDate = $stateParams.businessDate || $rootScope.businessDate;
                    return RVHkRoomStatusSrv.fetchRoomList({
                        businessDate: businessDate
                    });
                },
                employees: function(RVHkRoomStatusSrv, $rootScope) {
                    return $rootScope.isStandAlone ? RVHkRoomStatusSrv.fetchHKEmps() : [];
                },
                workTypes: function(RVHkRoomStatusSrv, $rootScope) {
                    return $rootScope.isStandAlone ? RVHkRoomStatusSrv.fetchWorkTypes() : [];
                },
                roomTypes: function(RVHkRoomStatusSrv) {
                    return RVHkRoomStatusSrv.fetchRoomTypes();
                },
                floors: function(RVHkRoomStatusSrv) {
                    return RVHkRoomStatusSrv.fetchFloors();
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
            templateUrl: '/assets/partials/workManagement/rvWorkManagement.html',
            controller: 'RVWorkManagementCtrl',
            resolve: {
                employees: function(RVWorkManagementSrv) {
                    return RVWorkManagementSrv.fetchMaids();
                },
                workTypes: function(RVWorkManagementSrv) {
                    return RVWorkManagementSrv.fetchWorkTypes();
                },
                shifts: function(RVWorkManagementSrv) {
                    return RVWorkManagementSrv.fetchShifts();
                },
                floors: function(RVHkRoomStatusSrv) {
                    return RVHkRoomStatusSrv.fetchFloors();
                }
            }
        });

        $stateProvider.state('rover.workManagement.start', {
            url: '/start',
            templateUrl: '/assets/partials/workManagement/rvWorkManagementLanding.html',
            controller: 'RVWorkManagementStartCtrl'
        });

        $stateProvider.state('rover.workManagement.multiSheet', {
            url: '/multisheet/:date',
            templateUrl: '/assets/partials/workManagement/rvWorkManagementMultiSheet.html',
            controller: 'RVWorkManagementMultiSheetCtrl'
        });

        $stateProvider.state('rover.workManagement.singleSheet', {
            url: '/worksheet/:date/:id/:from',
            templateUrl: '/assets/partials/workManagement/rvWorkManagementSingleSheet.html',
            controller: 'RVWorkManagementSingleSheetCtrl',
            resolve: {
                wmWorkSheet: function(RVWorkManagementSrv, $stateParams) {
                    return RVWorkManagementSrv.fetchWorkSheet({
                        id: $stateParams.id
                    });
                }
            }
        });


    });