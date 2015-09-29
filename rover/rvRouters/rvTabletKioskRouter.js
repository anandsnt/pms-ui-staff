angular.module('tabletKioskModule', []).config(['$stateProvider', '$urlRouterProvider', '$translateProvider', function ($stateProvider, $urlRouterProvider, $translateProvider) {

        //module specific routes for zest-station

        //check-in [ find-reservation main ]
        $stateProvider.state('station.tab-kiosk-find-reservation', {
            url: '/station', controller: 'rvTabletCtrl',
            templateUrl: '/assets/partials/zestStation/kiosk/specific/find-reservation.html',
        });

        //check-in [ find-by-date ]
        $stateProvider.state('station.tab-kiosk-find-reservation-by-date', {
            url: '/station', controller: 'rvTabletCtrl',
            templateUrl: '/assets/partials/zestStation/kiosk/generic/input-date.html',
        });

        //check-in [ find-by-confirmation ]
        $stateProvider.state('station.tab-kiosk-find-reservation-by-confirmation', {
            url: '/station', controller: 'rvTabletCtrl',
            templateUrl: '/assets/partials/zestStation/kiosk/generic/input-text.html',
        });

        //check-in [ find-by-email ]
        $stateProvider.state('station.tab-kiosk-find-by-email', {
            url: '/station', controller: 'rvTabletCtrl',
            templateUrl: '/assets/partials/zestStation/kiosk/generic/input-text.html',
        });
        //check-in [ find-by-email ]
        $stateProvider.state('station.tab-kiosk-input-email', {
            url: '/station', controller: 'rvTabletCtrl',
            templateUrl: '/assets/partials/zestStation/kiosk/generic/input-text.html',
        });



        // [ admin login screen [login/exit ]
        $stateProvider.state('station.tab-kiosk-admin-login-screen', {
            url: '/station', controller: 'rvTabletCtrl',
            templateUrl: '/assets/partials/zestStation/kiosk/generic/modal.html',
        });
        // [ admin login username ]
        $stateProvider.state('station.tab-kiosk-admin-login-username', {
            url: '/station', controller: 'rvTabletCtrl',
            templateUrl: '/assets/partials/zestStation/kiosk/generic/input-text.html',
        });
        // [ admin login password ]
        $stateProvider.state('station.tab-kiosk-admin-login-password', {
            url: '/station', controller: 'rvTabletCtrl',
            templateUrl: '/assets/partials/zestStation/kiosk/generic/input-text.html',
        });


        //check-in [ find-by-email ]
        $stateProvider.state('station.tab-kiosk-make-key', {
            url: '/station', controller: 'rvTabletCtrl',
            templateUrl: '/assets/partials/zestStation/kiosk/specific/make-key.html',
        });

        //check-in [ select-reservation ]
        $stateProvider.state('station.tab-kiosk-select-reservation', {
            url: '/station', controller: 'rvTabletCtrl',
            templateUrl: '/assets/partials/zestStation/kiosk/specific/select-reservation.html',
        });

        //check-in [ reservation-details ]
        $stateProvider.state('station.tab-kiosk-reservation-details', {
            url: '/station', controller: 'rvTabletCtrl',
            templateUrl: '/assets/partials/zestStation/kiosk/specific/reservation-details.html',
        });

        //check-in [ reservation credit card sign ]
        $stateProvider.state('station.tab-kiosk-reservation-sign', {
            url: '/station', controller: 'rvTabletCtrl',
            templateUrl: '/assets/partials/zestStation/kiosk/specific/sign.html',
        });

        //check-in [ reservation credit card sign Time Out]
        $stateProvider.state('station.tab-kiosk-reservation-signature-time-out', {
            url: '/station', controller: 'rvTabletCtrl',
            templateUrl: '/assets/partials/zestStation/kiosk/specific/signature-time-out.html',
        });

        //check-in [ no-match ]
        $stateProvider.state('station.tab-kiosk-no-match', {
            url: '/station', controller: 'rvTabletCtrl',
            templateUrl: '/assets/partials/zestStation/kiosk/specific/no-match.html',
        });

        //check-in [ terms conditions left ]
        $stateProvider.state('station.tab-kiosk-terms-conditions', {
            url: '/station', controller: 'rvTabletCtrl',
            templateUrl: '/assets/partials/zestStation/kiosk/generic/general-left.html',
        });

        //check-in [ select keys # ]
        $stateProvider.state('station.tab-kiosk-select-keys-after-checkin', {
            url: '/station', controller: 'rvTabletCtrl',
            templateUrl: '/assets/partials/zestStation/kiosk/specific/select-keys-after-checkin.html',
        });

        //pick up key [ home screen ]
        $stateProvider.state('station.tab-kiosk-pickup-key', {
            url: '/station', controller: 'rvTabletCtrl',
            templateUrl: '/assets/partials/zestStation/kiosk/specific/select-keys-after-checkin.html',
        });

        //pick up key [ home screen ]
        $stateProvider.state('station.tab-kiosk-input-last', {
            url: '/station', controller: 'rvTabletCtrl',
            templateUrl: '/assets/partials/zestStation/kiosk/generic/input-text.html',
        });


    }]);