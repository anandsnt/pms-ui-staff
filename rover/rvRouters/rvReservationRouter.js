angular.module('reservationModule', []).config(function($stateProvider, $urlRouterProvider, $translateProvider){
  //define module-specific routes here
        // Reservation state actions - START
        
        // $stateProvider.state('rover.reservation', {
        //     abstract : true,
        //     url: '/reservation',
        //     templateUrl: '/assets/partials/reservation/rvMain.html',
        //     controller: 'RVReservationMainCtrl',
        //     resolve: {
        //         baseData: function(RVReservationSummarySrv){
        //             return RVReservationSummarySrv.fetchInitialData();
        //         }
        //     }
        // });

        // $stateProvider.state('rover.reservation.search', {
        //     url: '/search',
        //     templateUrl: '/assets/partials/reservation/rvBaseSearch.html',
        //     controller: 'RVReservationBaseSearchCtrl',
        //     resolve: {
        //         baseSearchData: function(RVReservationBaseSearchSrv) {
        //             return RVReservationBaseSearchSrv.fetchBaseSearchData();
        //         }
        //     }
        // });

        // $stateProvider.state('rover.reservation.mainCard', {
        //     abstract: true,
        //     url: '/mainCard',
        //     templateUrl: '/assets/partials/reservation/rvMainCard.html',
        //     controller: 'RVReservationMainCardCtrl'
        // });

        // $stateProvider.state('rover.reservation.mainCard.roomType', {
        //     url: '/roomType',
        //     templateUrl: '/assets/partials/reservation/rvRoomTypesList.html',
        //     controller: 'RVReservationRoomTypeCtrl',
        //     resolve: {
        //        roomRates : function(RVReservationBaseSearchSrv) {
        //             return RVReservationBaseSearchSrv.fetchRoomRates();
        //         }
        //     }
        // });

        // $stateProvider.state('rover.reservation.mainCard.addons', {
        //     url: '/addons/:from_date/:to_date',
        //     templateUrl: '/assets/partials/reservation/rvAddonsList.html',
        //     controller: 'RVReservationAddonsCtrl',
        //     resolve: {
        //         addonData: function(RVReservationAddonsSrv, $stateParams) {
        //             var params = {};
        //             params.from_date = $stateParams.from_date;
        //             params.to_date = $stateParams.to_date;
        //             params.is_active = true;
        //             params.is_not_rate_only = true;
        //             return RVReservationAddonsSrv.fetchAddonData(params);
        //         }
        //     }
        // });

        // $stateProvider.state('rover.reservation.mainCard.summaryAndConfirm', {
        //     url: '/summaryAndConfirm',
        //     templateUrl: '/assets/partials/reservation/rvSummaryAndConfirm.html',
        //     controller: 'RVReservationSummaryCtrl'
        // });

        // $stateProvider.state('rover.reservation.mainCard.reservationConfirm', {
        //     url: '/reservationConfirm',
        //     templateUrl: '/assets/partials/reservation/rvReservationConfirm.html',
        //     controller: 'RVReservationConfirmCtrl'
        // });

        // Reservation state actions - END
});