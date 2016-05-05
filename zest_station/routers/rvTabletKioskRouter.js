sntZestStation.config(['$stateProvider', '$urlRouterProvider', '$translateProvider', function($stateProvider, $urlRouterProvider, $translateProvider) {


    $urlRouterProvider.otherwise('/zest_station/home');

    $stateProvider.state('zest_station', {
        abstract: true,
        url: '/zest_station',
        templateUrl: '/assets/partials/kiosk/zestRoot.html',
        controller: 'zsRootCtrl',
        resolve: {
            cssMappings: function(zsCSSMappings) {
                return zsCSSMappings.fetchCSSMappingList();
            },
            zestStationSettings: function(zsTabletSrv) {
                return zsTabletSrv.fetchSettings();
            },
            //fetch language files in the starting itself
            //so as to speeden the process laterwards
            fetchTranslations: function(zsHotelDetailsSrv) {

                    zsHotelDetailsSrv.fetchTranslationData('en').then(function(translations) {
                        $translateProvider.translations('en', translations);
                    });
                    zsHotelDetailsSrv.fetchTranslationData('fr').then(function(translations) {
                        $translateProvider.translations('fr', translations);
                    });
                    zsHotelDetailsSrv.fetchTranslationData('es').then(function(translations) {
                        $translateProvider.translations('es', translations);
                    });
                    zsHotelDetailsSrv.fetchTranslationData('de').then(function(translations) {
                        $translateProvider.translations('de', translations);
                    });
                    zsHotelDetailsSrv.fetchTranslationData('cl').then(function(translations) {
                        $translateProvider.translations('cl', translations);
                    });
                    zsHotelDetailsSrv.fetchTranslationData('it').then(function(translations) {
                        $translateProvider.translations('it', translations);
                    });
                    zsHotelDetailsSrv.fetchTranslationData('nl').then(function(translations) {
                        $translateProvider.translations('nl', translations);
                    });
            }
        }
    });

    $stateProvider.state('zest_station.home', {
        url: '/home',
        templateUrl: '/assets/partials/kiosk/home.html',
        controller: 'zsHomeCtrl',
        resolve: {
            waitforParentDependencies: function (cssMappings, zestStationSettings, $q) {
                var deferred = $q.defer();

                setTimeout(function () {
                    deferred.resolve();
                }, 10);
                return deferred.promise;
            }
        }
        });
        $stateProvider.state('zest_station.collect_nationality', {
            url         : '/collect_nationality/:guestId',
            templateUrl : '/assets/partials/kiosk/specific/zsCollectNationality.html',
            controller  : 'zsCollectNationalityCtrl',
            resolve: {
                countryList: function(zsHotelDetailsSrv){
                    return zsHotelDetailsSrv.fetchCountryList();
                }
            }
        });

        $stateProvider.state('zest_station.home-admin', {
            url         : '/home/:isadmin',
            templateUrl : '/assets/partials/kiosk/home.html',
            controller  : 'zsHomeCtrl'
            
        });
        $stateProvider.state('zest_station.admin-screen', {
            url         : '/home/:isadmin',
            templateUrl : '/assets/partials/rvAdminPopup.html',
            controller  : 'zsHomeCtrl'
            
        });

        $stateProvider.state('zest_station.oos', {
            url         : '/oos',
            templateUrl : '/assets/partials/kiosk/specific/oos.html',
            controller  : 'zsHomeCtrl'
        });

        $stateProvider.state('zest_station.reservation_search', {
            url         : '/reservation_search/:mode',
            templateUrl : '/assets/partials/kiosk/reservation_search.html',
            controller  : 'zsReservationSearchCtrl'
        });
        $stateProvider.state('zest_station.reservation_search_qrcode', {
            url         : '/reservation_search/:mode',
            templateUrl : '/assets/partials/kiosk/reservation_search.html',
            controller  : 'zsReservationSearchCtrl'
        });

        $stateProvider.state('zest_station.speak_to_staff', {
            url         : '/speak_to_staff',
            templateUrl : '/assets/partials/kiosk/specific/speak-to-staff.html'
        });
        $stateProvider.state('zest_station.error_page', {
            url         : '/speak_to_staff',
            templateUrl : '/assets/partials/kiosk/specific/error-page.html'
        });
        

        
         // //check-out [ review_bill ]
         $stateProvider.state('zest_station.review_bill', {
            url        : '/review_bill',
            templateUrl: '/assets/partials/kiosk/specific/reservation_bill.html',
            controller: 'zsReservationBillDetailsCtrl'
         });

         // //check-out [ review_bill ]
         $stateProvider.state('zest_station.reservation_checked_out', {
            url        : '/reservation_checked_out',
            templateUrl: '/assets/partials/kiosk/specific/reservation-checked-out.html',
            controller: 'zsReservationCheckedOutCtrl'
         });


        // //check-in [ reservation-details ]
         $stateProvider.state('zest_station.reservation_details', {
            url        : '/reservation_details/:mode',
            templateUrl: '/assets/partials/kiosk/specific/reservation-details.html',
            controller: 'zsReservationDetailsCtrl'
         });
         
         // //check-in [ reservation-details ]
         $stateProvider.state('zest_station.early_checkin_upsell', {
            url        : '/reservation_details/:mode/:early_checkin_offer_id',
            templateUrl: '/assets/partials/kiosk/specific/reservation-details.html',
            controller: 'zsEarlyCheckinCtrl'
         });
         
         
        // //early-check-in unavailable [ reservation-details ]
         $stateProvider.state('zest_station.early_checkin_unavailable', {
            url        : '/reservation_details/:mode/:early_checkin_offer_id',
            templateUrl: '/assets/partials/kiosk/specific/early-unavailable.html',
            controller: 'zsEarlyCheckinCtrl'
            
         });
        // //early-check-in unavailable [ reservation-details ]
         $stateProvider.state('zest_station.early_checkin_prepaid', {
            url        : '/reservation_details/:mode/:early_checkin_offer_id',
            templateUrl: '/assets/partials/kiosk/specific/early-prepaid.html',
            controller: 'zsEarlyCheckinCtrl'
         });
        // //early-check-in selection nav [ reservation-details ]
         $stateProvider.state('zest_station.early_checkin_nav', {
            url        : '/reservation_details/:mode/:early_checkin_offer_id',
            templateUrl: '/assets/partials/kiosk/specific/early-available.html',
            controller: 'zsEarlyCheckinCtrl'
         });
         
         
         
         
        // //check-in [ reservation-details ]
         $stateProvider.state('zest_station.add_remove_guests', {
            url        : '/reservation_details/:mode',
            templateUrl: '/assets/partials/kiosk/specific/additional-guests.html',
            controller: 'zsReservationDetailsCtrl'
         });
        // //check-in [ reservation-details ]
         $stateProvider.state('zest_station.add_guest_first', {
            url        : '/reservation_details/:mode',
            templateUrl: '/assets/partials/kiosk/generic/input-text.html',
            controller: 'zsReservationDetailsCtrl'
         });
         $stateProvider.state('zest_station.add_guest_last', {
            url        : '/reservation_details/:mode',
            templateUrl: '/assets/partials/kiosk/generic/input-text.html',
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
         
        // //check-in [ terms conditions left ]
         $stateProvider.state('zest_station.deposit_agree', {
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
         
         $stateProvider.state('zest_station.pickup_keys', {
             url: '/make_keys/:mode', 
             controller: 'zsCheckInKeysCtrl',
             templateUrl: '/assets/partials/kiosk/specific/select-keys-after-checkin.html',
         });
      
      
         $stateProvider.state('zest_station.last_confirm', {
             url: '/key_success/:mode', 
             controller: 'zsPostCheckinCtrl',
             templateUrl: '/assets/partials/kiosk/generic/modal.html'
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
         
         $stateProvider.state('zest_station.bill_delivery_options', {
            url       : '/delivery_options/:mode',
            controller: 'zsReservationCheckedOutCtrl',
            templateUrl: '/assets/partials/kiosk/generic/nav-2-options.html'
         });
         
         $stateProvider.state('zest_station.error', {
             url: '/error/:mode', 
             controller: 'zsPostCheckinCtrl',
             templateUrl: '/assets/partials/kiosk/generic/modal.html'
         });
         
         $stateProvider.state('zest_station.room_error', {
             url: '/error/:mode', 
             controller: 'zsPostCheckinCtrl',
             templateUrl: '/assets/partials/kiosk/generic/modal.html'
         });
         
         
        //  //check-in [ find-reservation main ]
         $stateProvider.state('zest_station.find_reservation', {
             url: '/find_reservation', 
             controller: 'zsFindReservationCtrl',
             templateUrl: '/assets/partials/kiosk/specific/zsFindReservation.html'
         });
         
         
        // //check-in [ find-by-date ]
         $stateProvider.state('zest_station.find_by_date', {
             url: '/find_reservation', 
             controller: 'zsFindReservationCtrl',
             templateUrl: '/assets/partials/kiosk/generic/input-date.html'
         });

    $stateProvider.state('zest_station.find_by_no_of_nights', {
        url: '/find_reservation',
        controller: 'zsFindByNoOfNightsCtrl',
        templateUrl: '/assets/partials/kiosk/generic/zsFindByNoOfNights.html'
    });
         // //check-in [ find-by-email ]
         $stateProvider.state('zest_station.find_by_email', {
             url: '/find_reservation', 
             controller: 'zsFindReservationCtrl',
             templateUrl: '/assets/partials/kiosk/generic/input-text.html'
         });

         // //check-in [ find-by-email ]
         $stateProvider.state('zest_station.invalid_email_retry', {
             url: '/find_reservation', 
             controller: 'zsPostCheckinCtrl',
             templateUrl: '/assets/partials/kiosk/generic/input-text.html'
         });
         // //check-in [ find-by-email ]
         $stateProvider.state('zest_station.edit_registration_email', {
             url: '/find_reservation', 
             controller: 'zsPostCheckinCtrl',
             templateUrl: '/assets/partials/kiosk/generic/input-text.html'
         });
         // //check-in [ find-by-email ]
         $stateProvider.state('zest_station.checking_in_guest', {
             url: '/find_reservation', 
             controller: 'zsFindReservationCtrl',
             templateUrl: '/assets/partials/kiosk/generic/input-text.html'
         });
         
         $stateProvider.state('zest_station.key_error', {
             url: '/error/:mode', 
             controller: 'zsPostCheckinCtrl',
             templateUrl: '/assets/partials/kiosk/generic/nav-2-options.html'
         });
         
         $stateProvider.state('zest_station.swipe_pay_error', {
             url: '/error/:mode', 
             controller: 'zsPostCheckinCtrl',
             templateUrl: '/assets/partials/kiosk/generic/nav-2-options.html'
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
             templateUrl: '/assets/partials/kiosk/specific/zsNoMatch.html',
         });

          // //check-in [ admin-popup ]
         $stateProvider.state('zest_station.admin', {
             url: '/find_reservation', 
             controller: 'zsAdminCtrl',
             templateUrl: '/assets/partials/kiosk/specific/zsAdminSettings.html',
         });

         
        // //check-in [ find-by-email ]
         $stateProvider.state('zest_station.input_reservation_email_after_swipe', {
             url: '/zest_station', 
             controller: 'zsPostCheckinCtrl',
             templateUrl: '/assets/partials/kiosk/generic/input-text.html',
         });
         
        // //check-in [ find-by-email ]
         $stateProvider.state('zest_station.registration_printed', {
             url: '/zest_station', 
             controller: 'zsPostCheckinCtrl',
             templateUrl: '/assets/partials/kiosk/generic/input-text.html'
         });

         //check-in [ reservation credit card sign Time Out]
         $stateProvider.state('zest_station.tab-kiosk-reservation-signature-time-out', {
             url: '/zest_station', 
             controller: 'zsPostCheckinCtrl',
             templateUrl: '/assets/partials/kiosk/specific/signature-time-out.html'
         });

        //check-out[ reservation checkout options]
         $stateProvider.state('zest_station.checkout_options', {
             url: '/zest_station', 
             controller: 'zsCheckOutOptionsCtrl',
             templateUrl: '/assets/partials/kiosk/specific/zsCheckOutOptions.html'
         });

        //check-out[ reservation checkout option key card look up]
         $stateProvider.state('zest_station.checkout_key_card_look_up', {
             url: '/zest_station', 
             controller: 'zsCheckoutKeyCardActionsCtrl',
             templateUrl: '/assets/partials/kiosk/specific/zsCheckoutKeyCardActions.html'
         });



    }]);
