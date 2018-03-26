angular.module('stayCardModule', [])
    .config(function ($stateProvider, $urlRouterProvider, $translateProvider, $injector) {
        // define module-specific routes here/
        // +-----------------+--------------------------+
        // |            reservation                     |
        // |              +                             |
        // |              |                             |
        // | search   <---+----> staycard               |
        // |                       +                    |
        // |                       |                    |
        // |                       |                    |
        // |                       |                    |
        // |       maincard   <----+->  reservationcard |
        // |                                            |
        // +--------------------------------------------+

        $stateProvider.state('rover.reservation', {
            abstract: true,
            url: '/staycard',
            templateUrl: '/assets/partials/staycard/rvStaycard.html',
            controller: 'RVReservationMainCtrl', // staycardController',
            resolve: {
                loadPaymentMapping: function (jsMappings) {
                    return jsMappings.loadPaymentMapping();
                },
                loadPaymentModule: function (jsMappings, loadPaymentMapping) {
                    return jsMappings.loadPaymentModule();
                },
                staycardJsAssets: function (jsMappings, mappingList) {
                    return jsMappings.fetchAssets(['rover.reservation', 'rover.groups', 'rover.allotments',
                        'rover.accounts', 'rover.companycarddetails', 'directives', 'highcharts'], ['highcharts-ng']);
                },
                /**
                 *   We have moved the fetching of 'baseData' form 'rover.reservation' state
                 *   to the states where it actually requires it.
                 *
                 *   Now we do want to bind the baseData so we have created a 'callFromChildCtrl' method on 'RVReservationMainCtrl'.
                 *
                 *   Once that state controller fetch 'baseData', it will find 'RVReservationMainCtrl' controller
                 *   by climbing the $socpe.$parent ladder and will call 'callFromChildCtrl' method.
                 */
                baseSearchData: function (RVReservationBaseSearchSrv, staycardJsAssets) {
                    return RVReservationBaseSearchSrv.fetchBaseSearchData();
                }
            }
        });


        $stateProvider.state('rover.reservation.search', {
            url: '/search',
            params: {
                guestId: null
            },
            templateUrl: '/assets/partials/reservation/rvBaseSearch.html',
            controller: 'RVReservationBaseSearchCtrl',
            resolve: {
                baseData: function (RVReservationSummarySrv, staycardJsAssets) {
                    return RVReservationSummarySrv.fetchInitialData();
                },
                activeCodes: function (RVReservationBaseSearchSrv, staycardJsAssets) {
                    return RVReservationBaseSearchSrv.getActivePromotions();
                },
                flyerPrograms: function (RVCompanyCardSrv, staycardJsAssets) {
                    return RVCompanyCardSrv.fetchHotelLoyaltiesFfp();
                },
                loyaltyPrograms: function (RVCompanyCardSrv, staycardJsAssets) {
                    return RVCompanyCardSrv.fetchHotelLoyaltiesHlps();
                },
                guestDetails: function (RVContactInfoSrv, staycardJsAssets, $stateParams) {
                    var guestId = $stateParams.guestId,
                        guestDetails = {};

                    if (guestId) {
                        guestDetails = RVContactInfoSrv.getGuestDetailsById(guestId);
                    }
                    return guestDetails;
                }
            }
        });

        $stateProvider.state('rover.reservation.staycard', {
            abstract: true,
            url: '/reservation',
            templateUrl: '/assets/partials/reservation/rvMain.html',
            controller: 'staycardController',
            onExit: function ($rootScope) {
                $rootScope.stayCardStateBookMark = {
                    previousState: '',
                    previousStateParams: {}
                };
            }
        });

        $stateProvider.state('rover.reservation.staycard.mainCard', {
            abstract: true,
            url: '/mainCard',
            templateUrl: '/assets/partials/reservation/rvMainCard.html',
            controller: 'RVReservationMainCardCtrl'
        });

        $stateProvider.state('rover.reservation.staycard.mainCard.room-rates', {
            url: '/room-rates',
            params: {
                from_date: '',
                to_date: '',
                fromState: '',
                view: 'DEFAULT',
                company_id: null,
                travel_agent_id: null,
                group_id: null,
                borrow_for_groups: '',
                allotment_id: null,
                promotion_code: null,
                disable_back_staycard: '',
                adults: '',
                children: '',
                promotion_id: '',
                room_type_id: null,
                is_member: '',
                guestId: ''
            },
            templateUrl: '/assets/partials/reservation/rvSelectRoomAndRate.html',
            controller: 'RVSelectRoomAndRateCtrl',
            resolve: {
                areReservationAddonsAvailable: function (RVReservationBaseSearchSrv, $stateParams, staycardJsAssets) { // CICO-16874
                    return RVReservationBaseSearchSrv.hasAnyConfiguredAddons({
                        from_date: $stateParams.from_date,
                        to_date: $stateParams.to_date,
                        is_active: true
                    });
                },
                rates: function (RVRoomRatesSrv, $stateParams, staycardJsAssets, RVReservationBaseSearchSrv) {
                    var params = {};

                    params.from_date = $stateParams.from_date;
                    params.to_date = $stateParams.to_date;
                    params.override_restrictions = $stateParams.override_restrictions;
                    params.adults = $stateParams.adults;
                    params.children = $stateParams.children;
                    if ($stateParams.company_id)
                        params.company_id = $stateParams.company_id;
                    if ($stateParams.travel_agent_id)
                        params.travel_agent_id = $stateParams.travel_agent_id;
                    if ($stateParams.group_id || $stateParams.allotment_id)
                        params.group_id = $stateParams.group_id || $stateParams.allotment_id;
                    if ($stateParams.promotion_code)
                        params.promotion_code = $stateParams.promotion_code;
                    if ($stateParams.promotion_id)
                        params.promotion_id = $stateParams.promotion_id;
                    if ($stateParams.room_type_id)
                        params.room_type_id = $stateParams.room_type_id;
                    if ($stateParams.is_member == 'true')
                        params.is_member = $stateParams.is_member;

                    var activeTab = RVReservationBaseSearchSrv.getRoomRatesDefaultView();

                    if (params.company_id || params.travel_agent_id || params.group_id || params.promotion_id || params.is_member) {
                        activeTab = 'RECOMMENDED';
                    }
                    RVRoomRatesSrv.setRoomAndRateActiveTab(activeTab);
                    return RVRoomRatesSrv.fetchRatesInitial(params);
                },
                ratesMeta: function (RVReservationBaseSearchSrv, staycardJsAssets) {
                    return RVReservationBaseSearchSrv.fetchRatesMeta();
                },
                house: function (RVReservationBaseSearchSrv, $stateParams, staycardJsAssets) {
                    return RVReservationBaseSearchSrv.fetchHouseAvailability({
                        from_date: $stateParams.from_date,
                        to_date: $stateParams.to_date
                    });
                }
            }
        });

        $stateProvider.state('rover.reservation.staycard.mainCard.addons', {
            url: '/addons',
            templateUrl: '/assets/partials/reservation/rvAddonsList.html',
            controller: 'RVReservationAddonsCtrl',
            params: {
                from_date: '',
                to_date: '',
                reservation: 'DAILY',
                from_screen: ''
            },
            resolve: {
                addonData: function (RVReservationAddonsSrv, $stateParams, staycardJsAssets) {
                    var params = {};

                    params.from_date = $stateParams.from_date;
                    params.to_date = $stateParams.to_date;
                    params.is_active = true;
                    params.is_not_rate_only = true;
                    return RVReservationAddonsSrv.fetchAddonData(params);
                }
            }
        });

        $stateProvider.state('rover.reservation.staycard.mainCard.summaryAndConfirm', {
            url: '/summaryAndConfirm',
            params: {
                reservation: 'DAILY',
                mode: 'OTHER'
            },
            templateUrl: '/assets/partials/reservation/rvSummaryAndConfirm.html',
            controller: 'RVReservationSummaryCtrl',
            resolve: {
                paymentMethods: function (RVReservationSummarySrv) {
                    return RVReservationSummarySrv.fetchPaymentMethods();
                }
            }
        });

        $stateProvider.state('rover.reservation.staycard.mainCard.reservationConfirm', {
            url: '/reservationConfirm/:id/:confirmationId',
            templateUrl: '/assets/partials/reservation/rvReservationConfirm.html',
            controller: 'RVReservationConfirmCtrl'
        });

        $stateProvider.state('rover.reservation.staycard.reservationcard', {
            abstract: true,
            url: '/reservationcard',
            templateUrl: '/assets/partials/reservationCard/rvReservationCard.html',
            controller: 'reservationCardController'
        });

        $stateProvider.state('rover.reservation.staycard.reservationcard.reservationdetails', {
            url: '/reservationdetails',
            templateUrl: '/assets/partials/reservationCard/rvReservationDetails.html',
            controller: 'reservationDetailsController',
            params: {
                id: null,
                confirmationId: null,
                isrefresh: null,
                justCreatedRes: null,
                isFromCards: null,
                isOnlineRoomMove: null,
                isKeySystemAvailable: null,
                isFromTACommission: null
            },
            resolve: {
                reservationListData: function (RVReservationCardSrv, $stateParams, staycardJsAssets) {
                    var data = {
                        'reservationId': $stateParams.id,
                        'isRefresh': $stateParams.isrefresh
                    };

                    return RVReservationCardSrv.fetch(data);
                },
                reservationDetails: function (RVReservationCardSrv, $stateParams, staycardJsAssets) {
                    var data = {
                        'confirmationNumber': $stateParams.confirmationId,
                        'isRefresh': $stateParams.isrefresh
                    };

                    return RVReservationCardSrv.fetchReservationDetails(data);
                },
                baseData: function (RVReservationSummarySrv, staycardJsAssets) {
                    return RVReservationSummarySrv.fetchInitialData();
                },
                paymentTypes: function (RVPaymentSrv, staycardJsAssets) {
                    return RVPaymentSrv.renderPaymentScreen();
                },
                reseravationDepositData: function (RVReservationCardSrv, $stateParams, $rootScope, staycardJsAssets) {
                    return $rootScope.isStandAlone ? RVReservationCardSrv.fetchDepositDetails($stateParams.id) : {};
                }
            }
        });

        $stateProvider.state('rover.reservation.staycard.billcard', {
            url: '/billcard/:reservationId',
            templateUrl: '/assets/partials/bill/rvBillCard.html',
            controller: 'RVbillCardController',
            params: {
                clickedButton: '',
                userId: ''
            },
            resolve: {
                billstaycardJsAssets: function (staycardJsAssets, jsMappings) {
                    return jsMappings.fetchAssets(['rover.reservation.staycard.billcard']);
                },
                reservationBillData: function (RVBillCardSrv, $stateParams, billstaycardJsAssets) {
                    return RVBillCardSrv.fetch($stateParams.reservationId);
                }
            }
        });
        $stateProvider.state('rover.reservation.staycard.roomassignment', {
            url: '/roomassignment',
            params: {
                reservation_id: '',
                room_type: '',
                clickedButton: '',
                upgrade_available: '', 
                cannot_move_room: ''
            },
            templateUrl: '/assets/partials/roomAssignment/rvRoomAssignment.html',
            controller: 'RVroomAssignmentController',
            resolve: {
                roomAssignmentJsAssets: function (jsMappings) {
                    return jsMappings.fetchAssets(['rover.reservation.staycard.roomassignment', 'directives']);
                },
                roomsList: function (RVRoomAssignmentSrv, $stateParams, roomAssignmentJsAssets) {

                    var params = {};

                    params.reservation_id = $stateParams.reservation_id;
                    // params.room_type = $stateParams.room_type;
                    return RVRoomAssignmentSrv.getRooms(params);
                },
                roomPreferences: function (RVRoomAssignmentSrv, $stateParams, roomAssignmentJsAssets) {
                    var params = {};

                    params.reservation_id = $stateParams.reservation_id;
                    return RVRoomAssignmentSrv.getPreferences(params);
                },
                roomUpgrades: function (RVUpgradesSrv, $stateParams, roomAssignmentJsAssets) {
                    // check if roomupgrade is available
                    if ($stateParams.upgrade_available === 'true') {
                        var params = {};

                        params.reservation_id = $stateParams.reservation_id;
                        return RVUpgradesSrv.getAllUpgrades(params);
                    }
                    else {
                        return [];
                    }

                }
            }
        });
        $stateProvider.state('rover.reservation.staycard.upgrades', {
            url: '/upgrades',
            params: {
                reservation_id: '',
                clickedButton: '',
                cannot_move_room: ''
            },
            templateUrl: '/assets/partials/upgrades/rvUpgrades.html',
            controller: 'RVUpgradesController',
            resolve: {
                roomAssignmentJsAssets: function (jsMappings, mappingList) {
                    return jsMappings.fetchAssets(['rover.reservation.staycard.roomassignment', 'directives']);
                },
                roomsList: function (RVRoomAssignmentSrv, $stateParams, roomAssignmentJsAssets) {
                    var params = {};

                    params.reservation_id = $stateParams.reservation_id;
                    return RVRoomAssignmentSrv.getRooms(params);
                }

            }
        });

        // Change stay dates
        $stateProvider.state('rover.reservation.staycard.changestaydates', {
            url: '/changestaydates',
            params: {
                reservationId: '',
                confirmNumber: ''
            },
            templateUrl: '/assets/partials/changeStayDates/rvChangeStayDates.html',
            controller: 'RVchangeStayDatesController',
            resolve: {
                changeStayDatesJsAssets: function (jsMappings, mappingList) {
                    return jsMappings.fetchAssets(['changestaydates', 'directives'], ['ui.calendar']);
                },
                stayDateDetails: function (RVChangeStayDatesSrv, $stateParams, changeStayDatesJsAssets) {
                    return RVChangeStayDatesSrv.fetchInitialData($stateParams.reservationId);
                }
            }
        });

        $stateProvider.state('rover.reservation.staycard.billcard.details', {
            url: '/',
            params: {
                billNo: 1
            },
            templateUrl: '/assets/partials/bill_details.html',
            controller: 'billDetailsController'
        });

        $stateProvider.state('rover.reservation.staycard.activitylog', {
            url: '/activitylog/:id',
            templateUrl: '/assets/partials/activityLog/rvActivityLog.html',
            controller: 'RVActivityLogCtrl',
            resolve: {
                activityLogAssets: function (jsMappings, staycardJsAssets, mappingList) {
                    return jsMappings.fetchAssets(['rover.reservation.staycard.activitylog', 'directives']);
                },
                activityLogResponse: function (RVActivityLogSrv, $stateParams, activityLogAssets) {
                    if (!!RVActivityLogSrv) {
                        return RVActivityLogSrv.fetchActivityLog($stateParams.id);
                    } else {
                        return {};
                    }
                },
                activeUserList: function (RVActivityLogSrv, activityLogAssets) {
                    return RVActivityLogSrv.fetchActiveUsers();
                }
            }
        });

        $stateProvider.state('rover.actionsManager', {
            url: '/actions',
            params: {
                restore: ''
            },
            templateUrl: '/assets/partials/actionsManager/rvActionsManager.html',
            controller: 'RVActionsManagerController',
            resolve: {
                actionsJsAssets: function (jsMappings, mappingList) {
                    return jsMappings.fetchAssets(['rover.actionsManager', 'directives']);
                },
                departments: function (rvActionTasksSrv, actionsJsAssets) {
                    return rvActionTasksSrv.fetchDepartments();
                }
            }
        });
    });
