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
                    return jsMappings.fetchAssets('rover.reservation');
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
            url: '/room-rates/:from_date/:to_date/:fromState:view/:company_id/:travel_agent_id/:group_id/:allotment_id/:promotion_code/:disable_back_staycard/:adults/:children/:promotion_id',
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
                if (!$stateParams.allotment_id) {
                    $stateParams.allotment_id = null;
                }
                if (!$stateParams.promotion_code) {
                    $stateParams.promotion_code = null;
                }
            },
            resolve: {
                sortOrder: function(RVReservationBaseSearchSrv) {
                    return RVReservationBaseSearchSrv.fetchSortPreferences();
                },
                areReservationAddonsAvailable: function(RVReservationBaseSearchSrv, $stateParams) { //CICO-16874
                    return RVReservationBaseSearchSrv.hasAnyConfiguredAddons({
                        from_date: $stateParams.from_date,
                        to_date: $stateParams.to_date,
                        is_active: true
                    });
                },
                rates: function(RVReservationBaseSearchSrv, $stateParams) {
                    return RVReservationBaseSearchSrv.fetchRates({
                        from_date: $stateParams.from_date,
                        to_date: $stateParams.to_date,
                        company_id: $stateParams.company_id,
                        travel_agent_id: $stateParams.travel_agent_id,
                        group_id: $stateParams.group_id,
                        allotment_id: $stateParams.allotment_id,
                        promotion_code: $stateParams.promotion_code,
                        adults: $stateParams.adults,
                        children: $stateParams.children,
                        promotion_id: $stateParams.promotion_id
                    })
                },
                ratesMeta: function(RVReservationBaseSearchSrv) {
                    return RVReservationBaseSearchSrv.fetchRatesMeta();
                },
                house: function(RVReservationBaseSearchSrv, $stateParams) {
                    return RVReservationBaseSearchSrv.fetchHouseAvailability({
                        from_date: $stateParams.from_date,
                        to_date: $stateParams.to_date
                    });
                },
                rateAddons: function($stateParams, RVReservationBaseSearchSrv) {
                    return RVReservationBaseSearchSrv.fetchAddonsForRates({
                        from_date: $stateParams.from_date,
                        to_date: $stateParams.to_date
                    });
                }
            }
        });

        $stateProvider.state('rover.reservation.staycard.mainCard.roomType', {
            url: '/roomType/:from_date/:to_date/:fromState:view/:company_id/:travel_agent_id/:group_id/:allotment_id/:promotion_code/:disable_back_staycard',
            templateUrl: '/assets/partials/reservation/rvRoomTypesList.html',
            controller: 'RVReservationRoomTypeCtrl',
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
                if (!$stateParams.allotment_id) {
                    $stateParams.allotment_id = null;
                }
                if (!$stateParams.promotion_code) {
                    $stateParams.promotion_code = null;
                }

            },
            resolve: {
                roomRates: function(RVReservationBaseSearchSrv, $stateParams, staycardJsAssets) {
                    var params = {};
                    params.from_date = $stateParams.from_date;
                    params.to_date = $stateParams.to_date;
                    params.company_id = $stateParams.company_id;
                    params.travel_agent_id = $stateParams.travel_agent_id;
                    params.group_id = $stateParams.group_id,
                        params.allotment_id = $stateParams.allotment_id,
                        params.promotion_code = $stateParams.promotion_code
                    return RVReservationBaseSearchSrv.fetchAvailability(params);
                },
                sortOrder: function(RVReservationBaseSearchSrv, staycardJsAssets) {
                    return RVReservationBaseSearchSrv.fetchSortPreferences();
                },
                rateAddons: function($stateParams, RVReservationBaseSearchSrv, staycardJsAssets) {
                    return RVReservationBaseSearchSrv.fetchAddonsForRates({
                        from_date: $stateParams.from_date,
                        to_date: $stateParams.to_date
                    });
                },
                isAddonsConfigured: function(RVReservationBaseSearchSrv, $stateParams, staycardJsAssets) { //CICO-16874

                    var params = {};
                    params.from_date = $stateParams.from_date;
                    params.to_date = $stateParams.to_date;
                    params.is_active = true;
                    return RVReservationBaseSearchSrv.hasAnyConfiguredAddons(params);
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
            url: '/reservationdetails/:id/:confirmationId/:isrefresh/:justCreatedRes/:isFromCards',
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
                    return jsMappings.fetchAssets('rover.reservation.staycard.billcard');
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
            url: '/roomassignment/:reservation_id/:room_type/:clickedButton',
            templateUrl: '/assets/partials/roomAssignment/rvRoomAssignment.html',
            controller: 'RVroomAssignmentController',
            resolve: {
                roomAssignmentJsAssets: function(jsMappings) {
                    return jsMappings.fetchAssets('rover.reservation.staycard.roomassignment');
                },
                roomsList: function(RVRoomAssignmentSrv, $stateParams, roomAssignmentJsAssets) {

                    var params = {};
                    params.reservation_id = $stateParams.reservation_id;
                    params.room_type = $stateParams.room_type;
                    return RVRoomAssignmentSrv.getRooms(params);
                },
                roomPreferences: function(RVRoomAssignmentSrv, $stateParams, roomAssignmentJsAssets) {
                    var params = {};
                    params.reservation_id = $stateParams.reservation_id;
                    return RVRoomAssignmentSrv.getPreferences(params);
                },
                roomUpgrades: function(RVUpgradesSrv, $stateParams, roomAssignmentJsAssets) {
                    var params = {};
                    params.reservation_id = $stateParams.reservation_id;
                    return RVUpgradesSrv.getAllUpgrades(params);
                }
            }
        });
        $stateProvider.state('rover.reservation.staycard.upgrades', {
            url: '/upgrades/:reservation_id/:clickedButton',
            templateUrl: '/assets/partials/upgrades/rvUpgrades.html',
            controller: 'RVUpgradesController',
            resolve: {
                roomAssignmentJsAssets: function(jsMappings) {
                    return jsMappings.fetchAssets('rover.reservation.staycard.roomassignment');
                }
            }
        });

        //Change stay dates
        $stateProvider.state('rover.reservation.staycard.changestaydates', {
            url: '/changestaydates/:reservationId/:confirmNumber',
            templateUrl: '/assets/partials/changeStayDates/rvChangeStayDates.html',
            controller: 'RVchangeStayDatesController',
            resolve: {
                changeStayDatesJsAssets: function(jsMappings) {
                    return jsMappings.fetchAssets('changestaydates', ['ui.calendar']);
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
                activityLogResponse: function(RVActivityLogSrv, $stateParams, staycardJsAssets) {
                    if (!!RVActivityLogSrv) {
                        return RVActivityLogSrv.fetchActivityLog($stateParams.id);
                    } else {
                        return {};
                    }
                },
                activeUserList: function(RVActivityLogSrv, staycardJsAssets) {
                    return RVActivityLogSrv.fetchActiveUsers();
                }
            }
        });

        $stateProvider.state('rover.actionsManager', {
            url: '/actions/:actions',
            templateUrl: "/assets/partials/actionsManager/rvActionsManager.html",
            controller: 'RVActionsManagerController'
        });
    });