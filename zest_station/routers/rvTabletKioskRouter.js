sntZestStation.config(['$stateProvider', '$urlRouterProvider', '$translateProvider', function ($stateProvider, $urlRouterProvider, $translateProvider) {

        
        $urlRouterProvider.otherwise('/zest_station_home');

        $stateProvider.state('zest_station_home', {
            url: '/zest_station_home',
            templateUrl: '/assets/partials/zestStation/kiosk/specific/home.html',
            controller: 'rvTabletCtrl'
        });

         //check-in [ find-reservation main ]
        $stateProvider.state('station.tab-kiosk-find-reservation', {
            url: '/', controller: 'rvTabletCtrl',
            templateUrl: '/assets/partials/zestStation/kiosk/specific/find-reservation.html',
        });

        //check-in [ find-reservation main ]
        $stateProvider.state('station.tab-kiosk-find-reservation', {
            url: '/zest_station1', controller: 'rvTabletCtrl',
            templateUrl: '/assets/partials/zestStation/kiosk/specific/find-reservation.html',
        });

        //check-in [ find-by-date ]
        $stateProvider.state('station.tab-kiosk-find-reservation-by-date', {
            url: '/zest_station', controller: 'rvTabletCtrl',
            templateUrl: '/assets/partials/zestStation/kiosk/generic/input-date.html',
        });

        //check-in [ find-by-confirmation ]
        $stateProvider.state('station.tab-kiosk-find-reservation-by-confirmation', {
            url: '/zest_station', controller: 'rvTabletCtrl',
            templateUrl: '/assets/partials/zestStation/kiosk/generic/input-text.html',
        });

        //check-in [ find-by-email ]
        $stateProvider.state('station.tab-kiosk-find-by-email', {
            url: '/zest_station', controller: 'rvTabletCtrl',
            templateUrl: '/assets/partials/zestStation/kiosk/generic/input-text.html',
        });
        //check-in [ find-by-email ]
        $stateProvider.state('station.tab-kiosk-input-email', {
            url: '/zest_station', controller: 'rvTabletCtrl',
            templateUrl: '/assets/partials/zestStation/kiosk/generic/input-text.html',
        });



        // [ admin login screen [login/exit ]
        $stateProvider.state('station.tab-kiosk-admin-login-screen', {
            url: '/zest_station', controller: 'rvTabletCtrl',
            templateUrl: '/assets/partials/zestStation/kiosk/generic/modal.html',
        });
        // [ admin login username ]
        $stateProvider.state('station.tab-kiosk-admin-login-username', {
            url: '/zest_station', controller: 'rvTabletCtrl',
            templateUrl: '/assets/partials/zestStation/kiosk/generic/input-text.html',
        });
        // [ admin login password ]
        $stateProvider.state('station.tab-kiosk-admin-login-password', {
            url: '/zest_station', controller: 'rvTabletCtrl',
            templateUrl: '/assets/partials/zestStation/kiosk/generic/input-text.html',
        });


        //check-in [ find-by-email ]
        $stateProvider.state('station.tab-kiosk-make-key', {
            url: '/zest_station', controller: 'rvTabletCtrl',
            templateUrl: '/assets/partials/zestStation/kiosk/specific/make-key.html',
        });

        //check-in [ select-reservation ]
        $stateProvider.state('station.tab-kiosk-select-reservation', {
            url: '/zest_station', controller: 'rvTabletCtrl',
            templateUrl: '/assets/partials/zestStation/kiosk/specific/select-reservation.html',
        });

        //check-in [ reservation-details ]
        $stateProvider.state('station.tab-kiosk-reservation-details', {
            url: '/zest_station', controller: 'rvTabletCtrl',
            templateUrl: '/assets/partials/zestStation/kiosk/specific/reservation-details.html',
        });

        //check-in [ reservation credit card sign ]
        $stateProvider.state('station.tab-kiosk-reservation-sign', {
            url: '/zest_station', controller: 'rvTabletCtrl',
            templateUrl: '/assets/partials/zestStation/kiosk/specific/sign.html',
        });

        //check-in [ reservation credit card sign Time Out]
        $stateProvider.state('station.tab-kiosk-reservation-signature-time-out', {
            url: '/zest_station', controller: 'rvTabletCtrl',
            templateUrl: '/assets/partials/zestStation/kiosk/specific/signature-time-out.html',
        });

        //check-in [ no-match ]
        $stateProvider.state('station.tab-kiosk-no-match', {
            url: '/zest_station', controller: 'rvTabletCtrl',
            templateUrl: '/assets/partials/zestStation/kiosk/specific/no-match.html',
        });

        //check-in [ terms conditions left ]
        $stateProvider.state('station.tab-kiosk-terms-conditions', {
            url: '/zest_station', controller: 'rvTabletCtrl',
            templateUrl: '/assets/partials/zestStation/kiosk/generic/general-left.html',
        });

        //check-in [ select keys # ]
        $stateProvider.state('station.tab-kiosk-select-keys-after-checkin', {
            url: '/zest_station', controller: 'rvTabletCtrl',
            templateUrl: '/assets/partials/zestStation/kiosk/specific/select-keys-after-checkin.html',
        });

        //pick up key [ home screen ]
        $stateProvider.state('station.tab-kiosk-pickup-key', {
            url: '/zest_station', controller: 'rvTabletCtrl',
            templateUrl: '/assets/partials/zestStation/kiosk/specific/select-keys-after-checkin.html',
        });

        //pick up key [ home screen ]
        $stateProvider.state('station.tab-kiosk-input-last', {
            url: '/zest_station', controller: 'rvTabletCtrl',
            templateUrl: '/assets/partials/zestStation/kiosk/generic/input-text.html',
        });


    }]);