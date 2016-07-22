
angular.module('stayCardModule', [])
    .config(function($stateProvider, $urlRouterProvider, $translateProvider) {
        //define module-specific routes here/
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
            controller: 'RVReservationMainCtrl', //staycardController',
            resolve: {
                staycardJsAssets: function(jsMappings, mappingList) {
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
                baseSearchData: function(RVReservationBaseSearchSrv, staycardJsAssets) {
                    return RVReservationBaseSearchSrv.fetchBaseSearchData();
                }
            }
        });


        $stateProvider.state('rover.reservation.search', {
            url: '/search',
            templateUrl: '/assets/partials/reservation/rvBaseSearch.html',
            controller: 'RVReservationBaseSearchCtrl',
            resolve: {
                baseData: function(RVReservationSummarySrv, staycardJsAssets) {
                    return RVReservationSummarySrv.fetchInitialData();
                },
                activeCodes: function(RVReservationBaseSearchSrv, staycardJsAssets) {
                    return RVReservationBaseSearchSrv.getActivePromotions();
                },
                flyerPrograms: function(RVCompanyCardSrv, staycardJsAssets) {
                    return RVCompanyCardSrv.fetchHotelLoyaltiesFfp();
                },
                loyaltyPrograms: function(RVCompanyCardSrv, staycardJsAssets) {
                    return RVCompanyCardSrv.fetchHotelLoyaltiesHlps();
                }
            }
        });

        $stateProvider.state('rover.reservation.staycard', {
            abstract: true,
            url: '/reservation',
            templateUrl: '/assets/partials/reservation/rvMain.html',
            controller: 'staycardController',
            onExit: function($rootScope) {
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
            url: '/room-rates/:from_date/:to_date/:fromState/:view/:company_id/:travel_agent_id/:group_id/:borrow_for_groups/:allotment_id/:promotion_code/:disable_back_staycard/:adults/:children/:promotion_id/:room_type_id/:is_member',
            templateUrl: '/assets/partials/reservation/rvSelectRoomAndRate.html',
            controller: 'RVSelectRoomAndRateCtrl',
            onEnter: function($stateParams) {
                if (!$stateParams.view) {
                    $stateParams.view = "DEFAULT";
                }
                if (!$stateParams.company_id) {
                    $stateParams.company_id = null;
                }
                if (!$stateParams.travel_agent_id) {
                    $stateParams.travel_agent_id = null;
                }
                if (!$stateParams.group_id) {
                    $stateParams.group_id = null;
                }
                if ( !$stateParams.borrow_for_groups ) {
                    $stateParams.borrow_for_groups = false;
                }
                if (!$stateParams.allotment_id) {
                    $stateParams.allotment_id = null;
                }
                if (!$stateParams.promotion_code) {
                    $stateParams.promotion_code = null;
                }
                if(!$stateParams.room_type_id){
                    $stateParams.room_type_id = null;
                }
            },
            resolve: {
                areReservationAddonsAvailable: function(RVReservationBaseSearchSrv, $stateParams, staycardJsAssets) { //CICO-16874
                    return RVReservationBaseSearchSrv.hasAnyConfiguredAddons({
                        from_date: $stateParams.from_date,
                        to_date: $stateParams.to_date,
                        is_active: true
                    });
                },
                rates: function(RVRoomRatesSrv, $stateParams, staycardJsAssets) {
                    var params = {};
                        params.from_date = $stateParams.from_date;
                        params.to_date   = $stateParams.to_date;
                        params.override_restrictions =  $stateParams.override_restrictions;
                        params.adults  = $stateParams.adults;
                        params.children = $stateParams.children;
                    if($stateParams.company_id)
                        params.company_id = $stateParams.company_id;
                    if($stateParams.travel_agent_id)
                        params.travel_agent_id = $stateParams.travel_agent_id;
                    if($stateParams.group_id || $stateParams.allotment_id)
                        params.group_id = $stateParams.group_id || $stateParams.allotment_id;
                    if($stateParams.promotion_code)
                        params.promotion_code = $stateParams.promotion_code;
                    if($stateParams.promotion_id)
                        params.promotion_id = $stateParams.promotion_id;
                    if($stateParams.room_type_id)
                        params.room_type_id = $stateParams.room_type_id;
                    if($stateParams.is_member == "true")
                        params.is_member = $stateParams.is_member;
                    return RVRoomRatesSrv.fetchRatesInitial(params)
                },
                ratesMeta: function(RVReservationBaseSearchSrv, staycardJsAssets) {
                    return RVReservationBaseSearchSrv.fetchRatesMeta();
                },
                house: function(RVReservationBaseSearchSrv, $stateParams, staycardJsAssets) {
                    return RVReservationBaseSearchSrv.fetchHouseAvailability({
                        from_date: $stateParams.from_date,
                        to_date: $stateParams.to_date
                    });
                }
            }
        });

        $stateProvider.state('rover.reservation.staycard.mainCard.addons', {
            url: '/addons/:from_date/:to_date/:reservation/:from_screen',
            templateUrl: '/assets/partials/reservation/rvAddonsList.html',
            controller: 'RVReservationAddonsCtrl',
            onEnter: function($stateParams) {
                if (typeof $stateParams.reservation === "undefined" || $stateParams.reservation === null) {
                    $stateParams.reservation = "DAILY";
                }
            },
            resolve: {

                addonData: function(RVReservationAddonsSrv, $stateParams, staycardJsAssets) {
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
            url: '/summaryAndConfirm/:reservation/:mode',
            templateUrl: '/assets/partials/reservation/rvSummaryAndConfirm.html',
            controller: 'RVReservationSummaryCtrl',
            onEnter: function($stateParams) {
                if (typeof $stateParams.reservation === "undefined" || $stateParams.reservation === null) {
                    $stateParams.reservation = "DAILY";
                }
                if (typeof $stateParams.mode === "undefined" || $stateParams.mode === null) {
                    $stateParams.mode = "OTHER";
                }
            },
            resolve: {
                paymentMethods: function(RVReservationSummarySrv) {
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
            url: '/reservationdetails/:id/:confirmationId/:isrefresh/:justCreatedRes/:isFromCards/:isOnlineRoomMove/:isKeySystemAvailable',
            templateUrl: '/assets/partials/reservationCard/rvReservationDetails.html',
            controller: 'reservationDetailsController',
            resolve: {
                reservationListData: function(RVReservationCardSrv, $stateParams, staycardJsAssets) {
                    var data = {
                        "reservationId": $stateParams.id,
                        "isRefresh": $stateParams.isrefresh
                    };
                    return RVReservationCardSrv.fetch(data);
                },
                reservationDetails: function(RVReservationCardSrv, $stateParams, staycardJsAssets) {
                    var data = {
                        "confirmationNumber": $stateParams.confirmationId,
                        "isRefresh": $stateParams.isrefresh
                    };
                    return RVReservationCardSrv.fetchReservationDetails(data);
                },
                baseData: function(RVReservationSummarySrv, staycardJsAssets) {
                    return RVReservationSummarySrv.fetchInitialData();
                },
                paymentTypes: function(RVPaymentSrv, staycardJsAssets) {
                    return RVPaymentSrv.renderPaymentScreen();
                },
                reseravationDepositData: function(RVReservationCardSrv, $stateParams, $rootScope, staycardJsAssets) {
                    return $rootScope.isStandAlone ? RVReservationCardSrv.fetchDepositDetails($stateParams.id) : {};
                }
            }
        });

        $stateProvider.state('rover.reservation.staycard.billcard', {
            url: '/billcard/:reservationId/:clickedButton/:userId',
            templateUrl: '/assets/partials/bill/rvBillCard.html',
            controller: 'RVbillCardController',
            resolve: {
                billstaycardJsAssets: function(staycardJsAssets, jsMappings) {
                    return jsMappings.fetchAssets(['rover.reservation.staycard.billcard']);
                },
                reservationBillData: function(RVBillCardSrv, $stateParams, billstaycardJsAssets) {
                    return RVBillCardSrv.fetch($stateParams.reservationId);
                },
                chargeCodeData: function(RVBillCardSrv, billstaycardJsAssets) {
                    return RVBillCardSrv.fetchChargeCodes();
                }
            }
        });
        $stateProvider.state('rover.reservation.staycard.roomassignment', {
            url: '/roomassignment/:reservation_id/:room_type/:clickedButton/:upgrade_available',
            templateUrl: '/assets/partials/roomAssignment/rvRoomAssignment.html',
            controller: 'RVroomAssignmentController',
            resolve: {
                roomAssignmentJsAssets: function(jsMappings) {
                    return jsMappings.fetchAssets(['rover.reservation.staycard.roomassignment', 'directives']);
                },
                roomsList: function(RVRoomAssignmentSrv, $stateParams, roomAssignmentJsAssets) {

                    var params = {};
                    params.reservation_id = $stateParams.reservation_id;
                   // params.room_type = $stateParams.room_type;
                    return RVRoomAssignmentSrv.getRooms(params);
                },
                roomPreferences: function(RVRoomAssignmentSrv, $stateParams, roomAssignmentJsAssets) {
                    var params = {};
                    params.reservation_id = $stateParams.reservation_id;
                    return RVRoomAssignmentSrv.getPreferences(params);
                },
                roomUpgrades: function(RVUpgradesSrv, $stateParams, roomAssignmentJsAssets) {
                    //check if roomupgrade is available
                    if($stateParams.upgrade_available ==="true"){
                        var params = {};
                        params.reservation_id = $stateParams.reservation_id;
                        return RVUpgradesSrv.getAllUpgrades(params);
                    }
                    else{
                        return [];
                    }

                }
            }
        });
        $stateProvider.state('rover.reservation.staycard.upgrades', {
            url: '/upgrades/:reservation_id/:clickedButton',
            templateUrl: '/assets/partials/upgrades/rvUpgrades.html',
            controller: 'RVUpgradesController',
            resolve: {
                roomAssignmentJsAssets: function(jsMappings, mappingList) {
                    return jsMappings.fetchAssets(['rover.reservation.staycard.roomassignment', 'directives']);
                },
                roomsList: function(RVRoomAssignmentSrv, $stateParams, roomAssignmentJsAssets) {
                    var params = {};
                    params.reservation_id = $stateParams.reservation_id;
                    return RVRoomAssignmentSrv.getRooms(params);
                }

            }
        });

        //Change stay dates
        $stateProvider.state('rover.reservation.staycard.changestaydates', {
            url: '/changestaydates/:reservationId/:confirmNumber',
            templateUrl: '/assets/partials/changeStayDates/rvChangeStayDates.html',
            controller: 'RVchangeStayDatesController',
            resolve: {
                changeStayDatesJsAssets: function(jsMappings, mappingList) {
                    return jsMappings.fetchAssets(['changestaydates', 'directives'], ['ui.calendar']);
                },
                stayDateDetails: function(RVChangeStayDatesSrv, $stateParams, changeStayDatesJsAssets) {
                    return RVChangeStayDatesSrv.fetchInitialData($stateParams.reservationId);
                }
            }
        });

        $stateProvider.state('rover.reservation.staycard.billcard.details', {
            url: '/:billNo',
            templateUrl: "/assets/partials/bill_details.html",
            controller: 'billDetailsController'
        });

        $stateProvider.state('rover.reservation.staycard.activitylog', {
            url: '/activitylog/:id',
            templateUrl: "/assets/partials/activityLog/rvActivityLog.html",
            controller: 'RVActivityLogCtrl',
            resolve: {
                activityLogAssets: function(jsMappings, staycardJsAssets, mappingList) {
                    return jsMappings.fetchAssets(['rover.reservation.staycard.activitylog', 'directives']);
                },
                activityLogResponse: function(RVActivityLogSrv, $stateParams, activityLogAssets) {
                    if (!!RVActivityLogSrv) {
                        return RVActivityLogSrv.fetchActivityLog($stateParams.id);
                    } else {
                        return {};
                    }
                },
                activeUserList: function(RVActivityLogSrv, activityLogAssets) {
                    return RVActivityLogSrv.fetchActiveUsers();
                }
            }
        });

        $stateProvider.state('rover.actionsManager', {
            url: '/actions/:restore',
            templateUrl: "/assets/partials/actionsManager/rvActionsManager.html",
            controller: 'RVActionsManagerController',
            resolve: {
                actionsJsAssets: function(jsMappings, mappingList) {
                    return jsMappings.fetchAssets(['rover.actionsManager', 'directives']);
                },
                departments: function(rvActionTasksSrv, actionsJsAssets) {
                    return rvActionTasksSrv.fetchDepartments();
                }
            }
        });
    });