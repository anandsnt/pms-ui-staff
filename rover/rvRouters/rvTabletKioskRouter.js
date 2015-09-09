angular.module('tabletKioskModule', [])
.config([
    '$stateProvider',
    '$urlRouterProvider',
    '$translateProvider',
    function($stateProvider, $urlRouterProvider, $translateProvider){
        
        //home
        $stateProvider.state('rover.kiosk', {
            url: '/kiosk',
            templateUrl: '/assets/partials/tablet/kiosk/specific/home.html',
            controller: 'rvTabletCtrl'
        });
        
        //check-in [ find-reservation main ]
        $stateProvider.state('rover.tab-kiosk-find-reservation', {
            url: '/kiosk',
            templateUrl: '/assets/partials/tablet/kiosk/specific/find-reservation.html',
        });
        
        //check-in [ find-by-date ]
        $stateProvider.state('rover.tab-kiosk-find-reservation-by-date', {
            url: '/kiosk',
            templateUrl: '/assets/partials/tablet/kiosk/generic/input-date.html',
        });
        
        //check-in [ find-by-confirmation ]
        $stateProvider.state('rover.tab-kiosk-find-reservation-by-confirmation', {
            url: '/kiosk',
            templateUrl: '/assets/partials/tablet/kiosk/generic/input-text.html',
        });
        
        //check-in [ find-by-email ]
        $stateProvider.state('rover.tab-kiosk-find-by-email', {
            url: '/kiosk',
            templateUrl: '/assets/partials/tablet/kiosk/generic/input-text.html',
        });
        //check-in [ find-by-email ]
        $stateProvider.state('rover.tab-kiosk-input-email', {
            url: '/kiosk',
            templateUrl: '/assets/partials/tablet/kiosk/generic/input-text.html',
        });
        
        
        
        // [ admin login screen [login/exit ]
        $stateProvider.state('rover.tab-kiosk-admin-login-screen', {
            url: '/kiosk',
            templateUrl: '/assets/partials/tablet/kiosk/generic/modal.html',
        });
        // [ admin login username ]
        $stateProvider.state('rover.tab-kiosk-admin-login-username', {
            url: '/kiosk',
            templateUrl: '/assets/partials/tablet/kiosk/generic/input-text.html',
        });
        // [ admin login password ]
        $stateProvider.state('rover.tab-kiosk-admin-login-password', {
            url: '/kiosk',
            templateUrl: '/assets/partials/tablet/kiosk/generic/input-text.html',
        });
        
        
        
        
        //check-in [ find-by-email ]
        $stateProvider.state('rover.tab-kiosk-make-key', {
            url: '/kiosk',
            templateUrl: '/assets/partials/tablet/kiosk/specific/make-key.html',
        });
        
        //check-in [ select-reservation ]
        $stateProvider.state('rover.tab-kiosk-select-reservation', {
            url: '/kiosk',
            templateUrl: '/assets/partials/tablet/kiosk/specific/select-reservation.html',
        });
        
        //check-in [ reservation-details ]
        $stateProvider.state('rover.tab-kiosk-reservation-details', {
            url: '/kiosk',
            templateUrl: '/assets/partials/tablet/kiosk/specific/reservation-details.html',
        });
        
        //check-in [ reservation credit card sign ]
        $stateProvider.state('rover.tab-kiosk-reservation-sign', {
            url: '/kiosk',
            templateUrl: '/assets/partials/tablet/kiosk/specific/sign.html',
        });
        
        //check-in [ reservation credit card sign Time Out]
        $stateProvider.state('rover.tab-kiosk-reservation-signature-time-out', {
            url: '/kiosk',
            templateUrl: '/assets/partials/tablet/kiosk/specific/signature-time-out.html',
        });
        
        //check-in [ no-match ]
        $stateProvider.state('rover.tab-kiosk-no-match', {
            url: '/kiosk',
            templateUrl: '/assets/partials/tablet/kiosk/specific/no-match.html',
        });
        
        //check-in [ terms conditions left ]
        $stateProvider.state('rover.tab-kiosk-terms-conditions', {
            url: '/kiosk',
            templateUrl: '/assets/partials/tablet/kiosk/generic/general-left.html',
        });
        
        //check-in [ select keys # ]
        $stateProvider.state('rover.tab-kiosk-select-keys-after-checkin', {
            url: '/kiosk',
            templateUrl: '/assets/partials/tablet/kiosk/specific/select-keys-after-checkin.html',
        });
        
        
        
        
        /*
        //check-in find reservation
        $stateProvider.state('rover.kiosk.reservation', {
            url: '/tabletview',
            templateUrl: '/assets/partials/tablet/kiosk/specific/find-reservation.html',
            controller: 'rvTabletCtrl'
        });
        //kiosk-admin
        $stateProvider.state('rover.tab-kiosk-admin', {
            url: '/tabletview',
            templateUrl: '/assets/partials/tablet/kiosk/specific/login.html',
            controller: 'rvTabletCtrl'
        });
        
        
        //check-in [ email ]
        $stateProvider.state('rover.tab-kiosk-checkin-email', {
            url: '/tabletview',
            templateUrl: '/assets/partials/tablet/kiosk/specific/find-reservation.html',
            controller: 'rvTabletCtrl'
        });
        //check-in [ confirmation ]
        $stateProvider.state('rover.tab-kiosk-checkin-confirmation', {
            url: '/tabletview',
            templateUrl: '/assets/partials/tablet/kiosk/specific/find-reservation.html',
            controller: 'rvTabletCtrl'
        });
        
        */
}]);