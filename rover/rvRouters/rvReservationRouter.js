angular.module('reservationModule', []).config(function($stateProvider, $urlRouterProvider, $translateProvider){
  //define module-specific routes here
        // Reservation state actions - START
        
        $stateProvider.state('rover.reservation', {
            abstract : true,
            url: '/reservation',
            templateUrl: '/assets/partials/reservation/rvMain.html',
            controller: 'RVReservationMainCtrl',
            resolve: {
                baseData: function(RVReservationSummarySrv){
                    return RVReservationSummarySrv.fetchInitialData();
                }
            }
        });

        $stateProvider.state('rover.reservation.search', {
            url: '/search',
            templateUrl: '/assets/partials/reservation/rvBaseSearch.html',
            controller: 'RVReservationBaseSearchCtrl',
            resolve: {
                baseSearchData: function(RVReservationBaseSearchSrv) {
                    return RVReservationBaseSearchSrv.fetchBaseSearchData();
                }
            }
        });

        $stateProvider.state('rover.reservation.mainCard', {
            abstract: true,
            url: '/mainCard',
            templateUrl: '/assets/partials/reservation/rvMainCard.html',
            controller: 'RVReservationMainCardCtrl'
        });

        $stateProvider.state('rover.reservation.mainCard.roomType', {
            url: '/roomType',
            templateUrl: '/assets/partials/reservation/rvRoomTypesList.html',
            controller: 'RVReservationRoomTypeCtrl',
            resolve: {
               roomRates : function(RVReservationBaseSearchSrv) {
                    return RVReservationBaseSearchSrv.fetchRoomRates();
                }
            }
        });

        $stateProvider.state('rover.reservation.mainCard.addons', {
            url: '/addons',
            templateUrl: '/assets/partials/reservation/rvAddonsList.html',
            controller: 'RVReservationAddonsCtrl',
            resolve: {
                addonData: function(RVReservationAddonsSrv) {
                    return RVReservationAddonsSrv.fetchAddonData();
                }
            }
        });

        $stateProvider.state('rover.reservation.mainCard.summaryAndConfirm', {
            url: '/summaryAndConfirm',
            templateUrl: '/assets/partials/reservation/rvSummaryAndConfirm.html',
            controller: 'RVReservationSummaryAndConfirmCtrl'
        });

        // Reservation state actions - END
});