sntZestStation.config(['$stateProvider', '$urlRouterProvider', '$translateProvider', function ($stateProvider, $urlRouterProvider, $translateProvider) {

        
        $urlRouterProvider.otherwise('/zest_station/home');
        
        $stateProvider.state('zest_station', {
            abstract    : true,
            url         : '/zest_station',
            templateUrl : '/assets/partials/kiosk/zestRoot.html',
            controller  : 'zsRootCtrl'
        });

        $stateProvider.state('zest_station.home', {
            url         : '/home',
            templateUrl : '/assets/partials/kiosk/home.html',
            controller  : 'zsHomeCtrl'
        });

        $stateProvider.state('zest_station.reservation_search', {
            url         : '/reservation_search/:mode',
            templateUrl : '/assets/partials/kiosk/reservation_search.html',
            controller  : 'zsReservationSearchCtrl'
        });

        // $stateProvider.state('zest_station_home', {
        //     url: '/zest_station_home',
        //     templateUrl: '/assets/partials/kiosk/specific/home.html',
        //     controller: 'rvTabletCtrl'
        // });

        //  //check-in [ find-reservation main ]
        // $stateProvider.state('station.tab-kiosk-find-reservation', {
        //     url: '/', controller: 'rvTabletCtrl',
        //     templateUrl: '/assets/partials/kiosk/specific/find-reservation.html',
        // });

        // //check-in [ find-reservation main ]
        // $stateProvider.state('station.tab-kiosk-find-reservation', {
        //     url: '/zest_station1', controller: 'rvTabletCtrl',
        //     templateUrl: '/assets/partials/kiosk/specific/find-reservation.html',
        // });

        // //check-in [ find-by-date ]
        // $stateProvider.state('station.tab-kiosk-find-reservation-by-date', {
        //     url: '/zest_station', controller: 'rvTabletCtrl',
        //     templateUrl: '/assets/partials/kiosk/generic/input-date.html',
        // });

        // //check-in [ find-by-confirmation ]
        // $stateProvider.state('station.tab-kiosk-find-reservation-by-confirmation', {
        //     url: '/zest_station', controller: 'rvTabletCtrl',
        //     templateUrl: '/assets/partials/kiosk/generic/input-text.html',
        // });

        // //check-in [ find-by-email ]
        // $stateProvider.state('station.tab-kiosk-find-by-email', {
        //     url: '/zest_station', controller: 'rvTabletCtrl',
        //     templateUrl: '/assets/partials/kiosk/generic/input-text.html',
        // });
        // //check-in [ find-by-email ]
        // $stateProvider.state('station.tab-kiosk-input-email', {
        //     url: '/zest_station', controller: 'rvTabletCtrl',
        //     templateUrl: '/assets/partials/kiosk/generic/input-text.html',
        // });



        // // [ admin login screen [login/exit ]
        // $stateProvider.state('station.tab-kiosk-admin-login-screen', {
        //     url: '/zest_station', controller: 'rvTabletCtrl',
        //     templateUrl: '/assets/partials/kiosk/generic/modal.html',
        // });
        // // [ admin login username ]
        // $stateProvider.state('station.tab-kiosk-admin-login-username', {
        //     url: '/zest_station', controller: 'rvTabletCtrl',
        //     templateUrl: '/assets/partials/kiosk/generic/input-text.html',
        // });
        // // [ admin login password ]
        // $stateProvider.state('station.tab-kiosk-admin-login-password', {
        //     url: '/zest_station', controller: 'rvTabletCtrl',
        //     templateUrl: '/assets/partials/kiosk/generic/input-text.html',
        // });


        // //check-in [ find-by-email ]
        // $stateProvider.state('station.tab-kiosk-make-key', {
        //     url: '/zest_station', controller: 'rvTabletCtrl',
        //     templateUrl: '/assets/partials/kiosk/specific/make-key.html',
        // });

        // //check-in [ select-reservation ]
        // $stateProvider.state('station.tab-kiosk-select-reservation', {
        //     url: '/zest_station', controller: 'rvTabletCtrl',
        //     templateUrl: '/assets/partials/kiosk/specific/select-reservation.html',
        // });

        // //check-in [ reservation-details ]
        // $stateProvider.state('station.tab-kiosk-reservation-details', {
        //     url: '/zest_station', controller: 'rvTabletCtrl',
        //     templateUrl: '/assets/partials/kiosk/specific/reservation-details.html',
        // });

        // //check-in [ reservation credit card sign ]
        // $stateProvider.state('station.tab-kiosk-reservation-sign', {
        //     url: '/zest_station', controller: 'rvTabletCtrl',
        //     templateUrl: '/assets/partials/kiosk/specific/sign.html',
        // });

        // //check-in [ reservation credit card sign Time Out]
        // $stateProvider.state('station.tab-kiosk-reservation-signature-time-out', {
        //     url: '/zest_station', controller: 'rvTabletCtrl',
        //     templateUrl: '/assets/partials/kiosk/specific/signature-time-out.html',
        // });

        // //check-in [ no-match ]
        // $stateProvider.state('station.tab-kiosk-no-match', {
        //     url: '/zest_station', controller: 'rvTabletCtrl',
        //     templateUrl: '/assets/partials/kiosk/specific/no-match.html',
        // });

        // //check-in [ terms conditions left ]
        // $stateProvider.state('station.tab-kiosk-terms-conditions', {
        //     url: '/zest_station', controller: 'rvTabletCtrl',
        //     templateUrl: '/assets/partials/kiosk/generic/general-left.html',
        // });

        // //check-in [ select keys # ]
        // $stateProvider.state('station.tab-kiosk-select-keys-after-checkin', {
        //     url: '/zest_station', controller: 'rvTabletCtrl',
        //     templateUrl: '/assets/partials/kiosk/specific/select-keys-after-checkin.html',
        // });

        // //pick up key [ home screen ]
        // $stateProvider.state('station.tab-kiosk-pickup-key', {
        //     url: '/zest_station', controller: 'rvTabletCtrl',
        //     templateUrl: '/assets/partials/kiosk/specific/select-keys-after-checkin.html',
        // });

        // //pick up key [ home screen ]
        // $stateProvider.state('station.tab-kiosk-input-last', {
        //     url: '/zest_station', controller: 'rvTabletCtrl',
        //     templateUrl: '/assets/partials/kiosk/generic/input-text.html',
        // });


    }]);