angular.module('stayCardModule', []).config(function($stateProvider, $urlRouterProvider, $translateProvider) {
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
            baseData: function(RVReservationSummarySrv) {
                return RVReservationSummarySrv.fetchInitialData();
            },
            baseSearchData: function(RVReservationBaseSearchSrv) {
                return RVReservationBaseSearchSrv.fetchBaseSearchData();
            }
        }
    });


    $stateProvider.state('rover.reservation.search', {
        url: '/search',
        templateUrl: '/assets/partials/reservation/rvBaseSearch.html',
        controller: 'RVReservationBaseSearchCtrl'
    });

    $stateProvider.state('rover.reservation.staycard', {
        abstract: true,
        url: '/reservation',
        templateUrl: '/assets/partials/reservation/rvMain.html',
        controller: 'staycardController'
    });



    $stateProvider.state('rover.reservation.staycard.mainCard', {
        abstract: true,
        url: '/mainCard',
        templateUrl: '/assets/partials/reservation/rvMainCard.html',
        controller: 'RVReservationMainCardCtrl'
    });

    $stateProvider.state('rover.reservation.staycard.mainCard.roomType', {
        url: '/roomType/:from_date/:to_date/:fromState:view/:company_id/:travel_agent_id',
        templateUrl: '/assets/partials/reservation/rvRoomTypesList.html',
        controller: 'RVReservationRoomTypeCtrl',
        onEnter: function($stateParams) {
            if (typeof $stateParams.view == "undefined" || $stateParams.view == null) {
                $stateParams.view = "DEFAULT";
            }if (typeof $stateParams.company_id == "undefined" || $stateParams.company_id == null) {
                $stateParams.company_id = null;
            }if (typeof $stateParams.travel_agent_id == "undefined" || $stateParams.travel_agent_id == null) {
                $stateParams.travel_agent_id = null;
            }
        },
        resolve: {
            roomRates: function(RVReservationBaseSearchSrv, $stateParams) {
                var params = {};
                params.from_date = $stateParams.from_date;
                params.to_date = $stateParams.to_date;
                params.company_id = $stateParams.company_id;
                params.travel_agent_id = $stateParams.travel_agent_id;
                return RVReservationBaseSearchSrv.fetchAvailability(params);
            }
        }
    });

    $stateProvider.state('rover.reservation.staycard.mainCard.addons', {
        url: '/addons/:from_date/:to_date',
        templateUrl: '/assets/partials/reservation/rvAddonsList.html',
        controller: 'RVReservationAddonsCtrl',
        resolve: {
            addonData: function(RVReservationAddonsSrv, $stateParams) {
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
        templateUrl: '/assets/partials/reservation/rvSummaryAndConfirm.html',
        controller: 'RVReservationSummaryCtrl'
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
        url: '/reservationdetails/:id/:confirmationId/:isrefresh',
        templateUrl: '/assets/partials/reservationCard/rvReservationDetails.html',
        controller: 'reservationDetailsController',
        resolve: {
            reservationListData: function(RVReservationCardSrv, $stateParams) {
            	 var data = {
                    "reservationId": $stateParams.id,
                    "isRefresh": $stateParams.isrefresh
                };
                return RVReservationCardSrv.fetch(data);
            },
            reservationDetails: function(RVReservationCardSrv, $stateParams) {
                var data = {
                    "confirmationNumber": $stateParams.confirmationId,
                    "isRefresh": $stateParams.isrefresh
                };
                return RVReservationCardSrv.fetchReservationDetails(data);
            }
        }
    });

    $stateProvider.state('rover.reservation.staycard.billcard', {
        url: '/billcard/:reservationId/:clickedButton',
        templateUrl: '/assets/partials/bill/rvBillCard.html',
        controller: 'RVbillCardController',
        resolve: {
            reservationBillData: function(RVBillCardSrv, $stateParams) {
                return RVBillCardSrv.fetch($stateParams.reservationId);
            },
            chargeCodeData: function(RVBillCardSrv){
                var a = "";
                try{
                   a = RVBillCardSrv.fetchChargeCodes()
                }catch(err){ alert(err)};
                return a;
            }
        }
    });
    $stateProvider.state('rover.reservation.staycard.roomassignment', {
        url: '/roomassignment/:reservation_id/:room_type/:clickedButton',
        templateUrl: '/assets/partials/roomAssignment/rvRoomAssignment.html',
        controller: 'RVroomAssignmentController',
        resolve: {
            roomsList: function(RVRoomAssignmentSrv, $stateParams) {

                var params = {};
                params.reservation_id = $stateParams.reservation_id;
                params.room_type = $stateParams.room_type;
                return RVRoomAssignmentSrv.getRooms(params);
            },
            roomPreferences: function(RVRoomAssignmentSrv, $stateParams) {
                var params = {};
                params.reservation_id = $stateParams.reservation_id;
                return RVRoomAssignmentSrv.getPreferences(params);
            },
            roomUpgrades: function(RVUpgradesSrv, $stateParams) {
                var params = {};
                params.reservation_id = $stateParams.reservation_id;
                return RVUpgradesSrv.getAllUpgrades(params);
            }
        }
    });
    $stateProvider.state('rover.reservation.staycard.upgrades', {
        url: '/upgrades/:reservation_id/:clickedButton',
        templateUrl: '/assets/partials/upgrades/rvUpgrades.html',
        controller: 'RVUpgradesController'
    });

    //Change stay dates
    $stateProvider.state('rover.reservation.staycard.changestaydates', {
        url: '/changestaydates/:reservationId/:confirmNumber',
        templateUrl: '/assets/partials/changeStayDates/rvChangeStayDates.html',
        controller: 'RVchangeStayDatesController',
        resolve: {
            stayDateDetails: function(RVChangeStayDatesSrv, $stateParams) {
                return RVChangeStayDatesSrv.fetchInitialData($stateParams.reservationId);
            }
        }
    });

    $stateProvider.state('rover.reservation.staycard.billcard.details', {
        url: '/:billNo',
        templateUrl: "/assets/partials/bill_details.html",
        controller: 'billDetailsController'
    });
});