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
                },
                allUnassigned: function() {
                    return [{
                        "id"         : 4,
                        "name"       : "Turndown",
                        "unassigned" : [{"id":231,"room_no":"110","current_status":"DIRTY","checkin_time":"11:56 am","checkout_time":null,"room_type":22,"is_vip":false,"floor_number":"01","is_queued":false,"reservation_status":"Due out","fo_status":"OCCUPIED","time_allocated":"00:15"},{"id":225,"room_no":"143","current_status":"CLEAN","checkin_time":"03:48 pm","checkout_time":null,"room_type":37,"is_vip":false,"floor_number":"01","is_queued":false,"reservation_status":"Stayover","fo_status":"OCCUPIED","time_allocated":"00:15"},{"id":351,"room_no":"210","current_status":"CLEAN","checkin_time":"12:16 pm","checkout_time":null,"room_type":53,"is_vip":false,"floor_number":"02","is_queued":false,"reservation_status":"Arrived","fo_status":"OCCUPIED","time_allocated":"00:15"},{"id":207,"room_no":"301","current_status":"DIRTY","checkin_time":"09:30 pm","checkout_time":null,"room_type":13,"is_vip":false,"floor_number":"01","is_queued":false,"reservation_status":"Stayover","fo_status":"OCCUPIED","time_allocated":"00:15"},{"id":245,"room_no":"307","current_status":"CLEAN","checkin_time":"03:49 pm","checkout_time":null,"room_type":12,"is_vip":false,"floor_number":"03","is_queued":false,"reservation_status":"Due out","fo_status":"OCCUPIED","time_allocated":"00:15"},{"id":249,"room_no":"308","current_status":"DIRTY","checkin_time":"06:53 am","checkout_time":null,"room_type":11,"is_vip":false,"floor_number":"03","is_queued":false,"reservation_status":"Stayover","fo_status":"OCCUPIED","time_allocated":"00:15"},{"id":252,"room_no":"314","current_status":"DIRTY","checkin_time":"11:33 am","checkout_time":"01:00 pm","room_type":11,"is_vip":false,"floor_number":"03","is_queued":false,"reservation_status":"Stayover","fo_status":"OCCUPIED","time_allocated":"00:15"},{"id":221,"room_no":"402","current_status":"DIRTY","checkin_time":"01:35 pm","checkout_time":null,"room_type":13,"is_vip":false,"floor_number":null,"is_queued":false,"reservation_status":"Due out","fo_status":"OCCUPIED","time_allocated":"00:15"},{"id":266,"room_no":"512","current_status":"INSPECTED","checkin_time":"02:00 am","checkout_time":"01:00 am","room_type":11,"is_vip":false,"floor_number":"03","is_queued":false,"reservation_status":"Arrival","fo_status":"VACANT","time_allocated":"00:15"},{"id":293,"room_no":"706","current_status":"DIRTY","checkin_time":"12:26 pm","checkout_time":null,"room_type":53,"is_vip":false,"floor_number":"05","is_queued":false,"reservation_status":"Stayover","fo_status":"OCCUPIED","time_allocated":"00:15"}]
                    }, {
                        "id"         : 20,
                        "name"       : "Daily Cleaning",
                        "unassigned" : [{"id":231,"room_no":"110","current_status":"DIRTY","checkin_time":"11:56 am","checkout_time":null,"room_type":22,"is_vip":false,"floor_number":"01","is_queued":false,"reservation_status":"Due out","fo_status":"OCCUPIED","time_allocated":"00:15"},{"id":225,"room_no":"143","current_status":"CLEAN","checkin_time":"03:48 pm","checkout_time":null,"room_type":37,"is_vip":false,"floor_number":"01","is_queued":false,"reservation_status":"Stayover","fo_status":"OCCUPIED","time_allocated":"00:15"},{"id":351,"room_no":"210","current_status":"CLEAN","checkin_time":"12:16 pm","checkout_time":null,"room_type":53,"is_vip":false,"floor_number":"02","is_queued":false,"reservation_status":"Arrived","fo_status":"OCCUPIED","time_allocated":"00:15"},{"id":207,"room_no":"301","current_status":"DIRTY","checkin_time":"09:30 pm","checkout_time":null,"room_type":13,"is_vip":false,"floor_number":"01","is_queued":false,"reservation_status":"Stayover","fo_status":"OCCUPIED","time_allocated":"00:15"},{"id":245,"room_no":"307","current_status":"CLEAN","checkin_time":"03:49 pm","checkout_time":null,"room_type":12,"is_vip":false,"floor_number":"03","is_queued":false,"reservation_status":"Due out","fo_status":"OCCUPIED","time_allocated":"00:15"},{"id":249,"room_no":"308","current_status":"DIRTY","checkin_time":"06:53 am","checkout_time":null,"room_type":11,"is_vip":false,"floor_number":"03","is_queued":false,"reservation_status":"Stayover","fo_status":"OCCUPIED","time_allocated":"00:15"},{"id":252,"room_no":"314","current_status":"DIRTY","checkin_time":"11:33 am","checkout_time":"01:00 pm","room_type":11,"is_vip":false,"floor_number":"03","is_queued":false,"reservation_status":"Stayover","fo_status":"OCCUPIED","time_allocated":"00:15"},{"id":221,"room_no":"402","current_status":"DIRTY","checkin_time":"01:35 pm","checkout_time":null,"room_type":13,"is_vip":false,"floor_number":null,"is_queued":false,"reservation_status":"Due out","fo_status":"OCCUPIED","time_allocated":"00:15"},{"id":266,"room_no":"512","current_status":"INSPECTED","checkin_time":"02:00 am","checkout_time":"01:00 am","room_type":11,"is_vip":false,"floor_number":"03","is_queued":false,"reservation_status":"Arrival","fo_status":"VACANT","time_allocated":"00:15"},{"id":293,"room_no":"706","current_status":"DIRTY","checkin_time":"12:26 pm","checkout_time":null,"room_type":53,"is_vip":false,"floor_number":"05","is_queued":false,"reservation_status":"Stayover","fo_status":"OCCUPIED","time_allocated":"00:15"}]
                    }]
               }
            }
        });


    });