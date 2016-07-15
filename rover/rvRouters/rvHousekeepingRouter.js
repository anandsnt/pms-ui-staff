angular.module('housekeepingModule', [])
    .config(function($stateProvider, $urlRouterProvider, $translateProvider) {

        $stateProvider.state('rover.housekeeping', {
            abstract: true,
            url: '/housekeeping',
            templateUrl: '/assets/partials/housekeeping/rvHousekeeping.html',
            controller: 'RVHkAppCtrl',
            resolve: {
                housekeepingAssets: function(jsMappings, mappingList) {
                    return jsMappings.fetchAssets(['rover.housekeeping', 'directives']);
                }
            }
        });

        $stateProvider.state('rover.housekeeping.roomStatus', {
            url: '/roomStatus?roomStatus&businessDate',
            templateUrl: '/assets/partials/housekeeping/rvHkRoomStatus.html',
            controller: 'RVHkRoomStatusCtrl',
            resolve: {
                fetchPayload: function(RVHkRoomStatusSrv, $stateParams, $rootScope, housekeepingAssets) {
                    if (!!$stateParams && !!$stateParams.roomStatus) {
                        var filterStatus = {
                            'INHOUSE_DIRTY'         : ['dirty', 'stayover'],
                            'INHOUSE_CLEAN'         : ['clean', 'stayover'],
                            'DEPARTURES_DIRTY'      : ['dueout', 'departed', 'dirty'],
                            'DEPARTURES_CLEAN'      : ['dueout', 'departed', 'clean'],
                            'OCCUPIED'              : ['occupied'],
                            'VACANT_READY'          : ['vacant', 'clean', 'inspected'],
                            'VACANT_NOT_READY'      : ['vacant', 'dirty'],
                            'OUTOFORDER_OR_SERVICE' : ['out_of_order', 'out_of_service'],
                            'QUEUED_ROOMS'          : ['queued']
                        };
                        var filtersToApply = filterStatus[$stateParams.roomStatus];
                        for (var i = 0; i < filtersToApply.length; i++) {
                            RVHkRoomStatusSrv.currentFilters[filtersToApply[i]] = true;
                        }

                        // RESET: since a housekeeping dashboard can disturb these props
                        RVHkRoomStatusSrv.currentFilters.page  = 1;
                        RVHkRoomStatusSrv.currentFilters.query = '';

                        return RVHkRoomStatusSrv.fetchPayload({ isStandAlone: $rootScope.isStandAlone });
                    } else {
                        return RVHkRoomStatusSrv.fetchPayload({ isStandAlone: $stateParams.isStandAlone || $rootScope.isStandAlone });
                    }
                },
                employees: function(RVHkRoomStatusSrv, $rootScope, housekeepingAssets) {
                    return $rootScope.isStandAlone ? RVHkRoomStatusSrv.fetchHKEmps() : [];
                },
                roomTypes: function(RVHkRoomStatusSrv, housekeepingAssets) {
                    return RVHkRoomStatusSrv.fetchRoomTypes();
                },
                floors: function(RVHkRoomStatusSrv, housekeepingAssets) {
                    return RVHkRoomStatusSrv.fetchFloors();
                },
                hkStatusList: function(RVHkRoomStatusSrv, housekeepingAssets) {
                    return RVHkRoomStatusSrv.fetchHkStatusList();
                },
                allRoomIDs: function(RVHkRoomStatusSrv, housekeepingAssets) {
                    return RVHkRoomStatusSrv.fetchAllRoomIDs();
                }
            }
        });

        $stateProvider.state('rover.housekeeping.roomDetails', {
            url: '/roomDetails/:id',
            templateUrl: '/assets/partials/housekeeping/rvHkRoomDetails.html',
            controller: 'RVHkRoomDetailsCtrl',
            resolve: {
                roomDetailsData: function(RVHkRoomDetailsSrv, $stateParams, housekeepingAssets) {
                    return RVHkRoomDetailsSrv.fetch($stateParams.id);
                }
            }
        });
        $stateProvider.state('rover.housekeeping.roomDetails.log', {
            url: '/roomDetails/log',
            templateUrl: '/assets/partials/housekeeping/rvLogTab.html',
            controller: 'RVHKLogTabCtrl',
            resolve: {

                roomDetailsLogData: function(RVHkRoomDetailsSrv, $stateParams) {
                    var params = {
                        id: $stateParams.id,
                        page: 1,
                        per_page: 50
                    };
                    return RVHkRoomDetailsSrv.getRoomLog(params);
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
                workManagementAssets: function(jsMappings, mappingList) {
                    return jsMappings.fetchAssets(['rover.workManagement', 'directives']);
                },
                employees: function(RVWorkManagementSrv, workManagementAssets) {
                    return RVWorkManagementSrv.fetchMaids();
                },
                workTypes: function(RVWorkManagementSrv, workManagementAssets) {
                    return RVWorkManagementSrv.fetchWorkTypes();
                },
                shifts: function(RVWorkManagementSrv, workManagementAssets) {
                    return RVWorkManagementSrv.fetchShifts();
                },
                floors: function(RVHkRoomStatusSrv, workManagementAssets) {
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
            controller: 'RVWorkManagementMultiSheetCtrl',
            resolve: {
                allUnassigned: function(RVWorkManagementSrv, $stateParams, workManagementAssets) {
                    return RVWorkManagementSrv.fetchAllUnassigned({
                        date: $stateParams.date
                    });
                },
                activeWorksheetEmp: function(RVHkRoomStatusSrv, workManagementAssets) {
                    return RVHkRoomStatusSrv.fetchActiveWorksheetEmp();
                },
                fetchHKStaffs: function(RVWorkManagementSrv, workManagementAssets) {
                    return RVWorkManagementSrv.fetchHKStaffs();
                },

                payload: function(fetchHKStaffs, RVWorkManagementSrv, $stateParams, workManagementAssets) {
                    var unassignedRoomsParam = {
                        date: $stateParams.date,
                    };

                    var assignedRoomsParam = {
                        date: $stateParams.date,
                        employee_ids: fetchHKStaffs.emp_ids
                    };

                    return RVWorkManagementSrv.processedPayload(unassignedRoomsParam, assignedRoomsParam);
                }
            }
        });

        $stateProvider.state('rover.workManagement.singleSheet', {
            url: '/worksheet/:date/:id/:from',
            templateUrl: '/assets/partials/workManagement/rvWorkManagementSingleSheet.html',
            controller: 'RVWorkManagementSingleSheetCtrl',
            resolve: {
                wmWorkSheet: function(RVWorkManagementSrv, $stateParams, workManagementAssets) {
                    return RVWorkManagementSrv.fetchWorkSheet({
                        id: $stateParams.id
                    });
                },
                allUnassigned: function(RVWorkManagementSrv, $stateParams, workManagementAssets) {
                    return RVWorkManagementSrv.fetchAllUnassigned({
                        date: $stateParams.date
                    });
                }
            }
        });


    });