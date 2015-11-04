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

        $stateProvider.state('zest_station.home-admin', {
            url         : '/home/:isadmin',
            templateUrl : '/assets/partials/kiosk/home.html',
            controller  : 'zsHomeCtrl'
        });

        $stateProvider.state('zest_station.reservation_search', {
            url         : '/reservation_search/:mode',
            templateUrl : '/assets/partials/kiosk/reservation_search.html',
            controller  : 'zsReservationSearchCtrl'
        });

         $stateProvider.state('zest_station.speak_to_staff', {
            url         : '/speak_to_staff',
            templateUrl : '/assets/partials/kiosk/specific/speak-to-staff.html',
            controller  : 'zsReservationSearchCtrl'
        });
        

        
         // //check-out [ review_bill ]
         $stateProvider.state('zest_station.review_bill', {
            url        : '/review_bill/:res_id/:checked_out',
            templateUrl: '/assets/partials/kiosk/specific/reservation_bill.html',
            controller: 'zsReservationBillDetailsCtrl'
         });

         // //check-out [ review_bill ]
         $stateProvider.state('zest_station.reservation_checked_out', {
            url        : '/reservation_checked_out/:res_id/:email',
            templateUrl: '/assets/partials/kiosk/specific/reservation-checked-out.html',
            controller: 'zsReservationCheckedOutCtrl'
         });


        // //check-in [ reservation-details ]
         $stateProvider.state('zest_station.reservation_details', {
            url        : '/reservation_details/:mode',
            templateUrl: '/assets/partials/kiosk/specific/reservation-details.html',
            controller: 'zsReservationDetailsCtrl'
         });
         
        // //check-in [ terms conditions left ]
         $stateProvider.state('zest_station.terms_conditions', {
            url       : '/reservation_terms/:mode',
            controller: 'zsTermsConditionsCtrl',
            templateUrl: '/assets/partials/kiosk/generic/general-left.html'
         });
         
         
        // //check-in [ terms conditions left ]
         $stateProvider.state('zest_station.card_swipe', {
            url       : '/card_swipe/:mode',
            controller: 'zsCardSwipeCtrl',
            templateUrl: '/assets/partials/kiosk/generic/nav-2-options.html'
         });
         
         
         //check-in [ reservation credit card sign ]
         $stateProvider.state('zest_station.card_sign', {
             url: '/card_sign/:mode', 
             controller: 'zsCardSwipeCtrl',
             templateUrl: '/assets/partials/kiosk/specific/sign.html',
         });

         
        // //check-in [ select keys # ]
         $stateProvider.state('zest_station.check_in_keys', {
             url: '/select_keys/:mode', 
             controller: 'zsCheckInKeysCtrl',
             templateUrl: '/assets/partials/kiosk/specific/select-keys-after-checkin.html',
         });

      
         $stateProvider.state('zest_station.make_keys', {
             url: '/make_keys/:mode', 
             controller: 'zsCheckInKeysCtrl',
             templateUrl: '/assets/partials/kiosk/specific/make-key.html',
         });
      
      
         $stateProvider.state('zest_station.key_success', {
             url: '/key_success/:mode', 
             controller: 'zsCheckInKeysCtrl',
             templateUrl: '/assets/partials/kiosk/generic/modal.html'
         });
         
         $stateProvider.state('zest_station.talk_to_staff', {
             url: '/talk_to_staff/:mode', 
             controller: 'zsCommonCtrl',
             templateUrl: '/assets/partials/kiosk/generic/modal.html'
         });
         
         $stateProvider.state('zest_station.delivery_options', {
            url       : '/delivery_options/:mode',
            controller: 'zsPostCheckinCtrl',
            templateUrl: '/assets/partials/kiosk/generic/nav-2-options.html'
         });
         
         $stateProvider.state('zest_station.error', {
             url: '/error/:mode', 
             controller: 'zsPostCheckinCtrl',
             templateUrl: '/assets/partials/kiosk/generic/modal.html'
         });
         
         
        //  //check-in [ find-reservation main ]
         $stateProvider.state('zest_station.find_reservation', {
             url: '/find_reservation', 
             controller: 'zsFindReservationCtrl',
             templateUrl: '/assets/partials/kiosk/specific/find-reservation.html',
         });
         
         
        // //check-in [ find-by-date ]
         $stateProvider.state('zest_station.find_by_date', {
             url: '/find_reservation', 
             controller: 'zsFindReservationCtrl',
             templateUrl: '/assets/partials/kiosk/generic/input-date.html'
         });

         // //check-in [ find-by-email ]
         $stateProvider.state('zest_station.find_by_email', {
             url: '/find_reservation', 
             controller: 'zsFindReservationCtrl',
             templateUrl: '/assets/partials/kiosk/generic/input-text.html'
         });

        // //check-in [ find-by-confirmation ]
         $stateProvider.state('zest_station.find_by_confirmation', {
             url: '/find_reservation', 
             controller: 'zsFindReservationCtrl',
             templateUrl: '/assets/partials/kiosk/generic/input-text.html'
         });

         
        // //pick up key [ home screen ]
         $stateProvider.state('zest_station.find_reservation_input_last', {
             url: '/find_reservation', 
             controller: 'zsFindReservationCtrl',
             templateUrl: '/assets/partials/kiosk/generic/input-text.html'
         });
         
         
        // //check-in [ no-match ]
         $stateProvider.state('zest_station.find_reservation_no_match', {
             url: '/find_reservation', 
             controller: 'zsFindReservationCtrl',
             templateUrl: '/assets/partials/kiosk/specific/no-match.html',
         });

          // //check-in [ no-match ]
         $stateProvider.state('zest_station.admin', {
             url: '/find_reservation', 
             controller: 'zsAdminCtrl',
             templateUrl: '/assets/partials/kiosk/admin.html',
         });

         
         
         


        // //check-in [ reservation credit card sign Time Out]
        // $stateProvider.state('station.tab-kiosk-reservation-signature-time-out', {
        //     url: '/zest_station', controller: 'rvTabletCtrl',
        //     templateUrl: '/assets/partials/kiosk/specific/signature-time-out.html',
        // });
         
         
         
        // 
        // 
        // $stateProvider.state('zest_station_home', {
        //     url: '/zest_station_home',
        //     templateUrl: '/assets/partials/kiosk/specific/home.html',
        //     controller: 'rvTabletCtrl'
        // });


        // //check-in [ find-reservation main ]
        // $stateProvider.state('station.tab-kiosk-find-reservation', {
        //     url: '/zest_station1', controller: 'rvTabletCtrl',
        //     templateUrl: '/assets/partials/kiosk/specific/find-reservation.html',
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



        // //check-in [ select-reservation ]
        // $stateProvider.state('station.tab-kiosk-select-reservation', {
        //     url: '/zest_station', controller: 'rvTabletCtrl',
        //     templateUrl: '/assets/partials/kiosk/specific/select-reservation.html',
        // });






        // //pick up key [ home screen ]
        // $stateProvider.state('station.tab-kiosk-pickup-key', {
        //     url: '/zest_station', controller: 'rvTabletCtrl',
        //     templateUrl: '/assets/partials/kiosk/specific/select-keys-after-checkin.html',
        // });



    }]);