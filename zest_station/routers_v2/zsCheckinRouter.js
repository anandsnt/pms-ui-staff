sntZestStation.config(['$stateProvider',
    function($stateProvider) {
        // checkin reservation search
        $stateProvider.state('zest_station.checkInReservationSearch', {
            url: '/checkInReservationSearch/:last_name',
            templateUrl: '/assets/partials_v2/checkin/zscheckInReservationSearch.html',
            controller: 'zscheckInReservationSearchCtrl',
            jumper: true,
            section: 'Checkin',
            description: 'Guest enters last name',
            label: 'Reservation Search',
            icon: 'checkin_res_search.png',
            tags: ['sign_screen']
        });

        // checkin reservation details 
        $stateProvider.state('zest_station.checkInReservationDetails', {
            url: '/checkInReservationDetails/:pickup_key_mode/:isQuickJump/:quickJumpMode/:previousState',
            templateUrl: '/assets/partials_v2/checkin/zsCheckinReservationDetails.html',
            controller: 'zsCheckInReservationDetailsCtrl',
            jumper: true,
            placeholderData: true,
            section: 'Checkin',
            description: 'Cost Details, Link to add/remove guests',
            icon: 'checkin_res_details.png',
            label: 'Reservation Details',
            modes: [
            {
                'name': 'TERMS_CONDITIONS',
                'label': 'Terms and Conditions',
                'description': 'After Reservation Details, Show Hotel Terms and Conditions',
                'icon': 'checkin_terms.png'
            }]
        });
        // select checkin reservation from array of reservations.
        $stateProvider.state('zest_station.selectReservationForCheckIn', {
            url: '/selectReservationForCheckIn',
            templateUrl: '/assets/partials_v2/checkin/zsSelectReservationForCheckIn.html',
            controller: 'zsSelectReservationForCheckInCtrl',
            jumper: false,
            section: 'Checkin',
            description: '',
            icon: 'checkin_res_select.png',
            label: 'Select Reservation'
        });
        // select nationality
        $stateProvider.state('zest_station.collectNationality', {
            url: '/collect_nationality/:pickup_key_mode/:reservation_id/:room_no/:first_name/:guest_id/:email',
            templateUrl: '/assets/partials_v2/checkin/zsCollectNationality.html',
            controller: 'zsCollectNationalityCtrl',
            resolve: {
                countryList: function(zsGeneralSrv) {
                    return zsGeneralSrv.fetchCountryList();
                },
                sortedCountryList: function(zsGeneralSrv) {
                    return zsGeneralSrv.fetchSortedCountryList();
                }
            },
            jumper: true,
            section: 'Checkin',
            icon: 'checkin_collect_nationality.png',
            description: 'Allows guest to add their nationality',
            label: 'Collect Nationality'
        });

        $stateProvider.state('zest_station.add_remove_guests', {
            url: '/checkInAddRemoveGuest/:pickup_key_mode',
            templateUrl: '/assets/partials_v2/checkin/zsCheckInAddRemoveGuest.html',
            controller: 'zsCheckInAddRemoveGuestCtrl',
            jumper: true,
            section: 'Checkin',
            description: 'Screen to add/remove guests to reservation',
            icon: 'checkin_add_remove.png',
            label: 'Add/Remove Guest'
        });

        // checking credit card swipe                 
        $stateProvider.state('zest_station.checkInCardSwipe', {
            url: '/checkInReservationCard/:isQuickJump/:mode/:first_name/:reservation_id/:guest_id/:swipe/:guest_email/:guest_email_blacklisted/:room_no/:room_status/:payment_type_id/:deposit_amount/:balance_amount/:pre_auth_amount_for_zest_station/:authorize_cc_at_checkin/:confirmation_number/:pickup_key_mode/:email',
            templateUrl: '/assets/partials_v2/checkin/zsCheckinCCSwipe.html',
            controller: 'zsCheckinCCSwipeCtrl',
            jumper: true,
            placeholderData: true,
            section: 'Checkin',
            icon: 'checkin_card_swipe.png',
            description: 'Credit Card Swipe',
            label: 'Card Swipe'
        });

        // terms and conditions                
        $stateProvider.state('zest_station.checkInTerms', {
            url: '/checkInTermsAndConditions/:guest_id/:reservation_id/:payment_type_id/:deposit_amount/:guest_email/:guest_email_blacklisted/:room_no/:room_status/:first_name/:balance_amount/:pre_auth_amount_for_zest_station/:authorize_cc_at_checkin/:confirmation_number/:pickup_key_mode/:is_from_room_upsell/:is_from_addons/:payment_method',
            templateUrl: '/assets/partials_v2/checkin/zsCheckinTermsConditions.html',
            controller: 'zsCheckInTermsConditionsCtrl',
            jumper: false,
            section: 'Checkin',
            icon: 'checkin_terms.png',
            description: 'Terms and Conditions',
            label: 'Terms'
        });
        // reservation deposit                
        $stateProvider.state('zest_station.checkInDeposit', {
            url: '/checkInReservationDeposit/:reservation_id/:mode/:payment_type_id/:deposit_amount/:guest_email/:guest_email_blacklisted/:room_no/:room_status/:guest_id/:balance_amount/:pre_auth_amount_for_zest_station/:authorize_cc_at_checkin/:confirmation_number/:first_name/:pickup_key_mode/:email',
            templateUrl: '/assets/partials_v2/checkin/zsCheckinDeposit.html',
            controller: 'zsCheckinDepositCtrl',
            jumper: true,
            section: 'Checkin',
            icon: 'checkin_deposit.png',
            description: 'Collect Reservation Deposit',
            label: 'Deposit'
        });
        // pickup key dispense

        $stateProvider.state('zest_station.checkinKeyDispense', {
            url: '/checkinKeyDispense/:reservation_id/:room_no/:first_name/:guest_id/:email',
            templateUrl: '/assets/partials_v2/checkin/zscheckinKeyDispense.html',
            controller: 'zsCheckinKeyDispenseCtrl',
            jumper: true,
            section: 'Checkin',
            icon: 'checkin_keys.png',
            description: 'Select how many keys the guest would like, starts key dispense',
            label: 'Key Dispense'
        });


        // pickup key dispense
        $stateProvider.state('zest_station.checkinKeySelection', {
            url: '/checkinKeyDispense/:reservation_id/:room_no/:first_name/:guest_id/:email/:for_demo/:isQuickJump/:quickJumpMode',
            templateUrl: '/assets/partials_v2/checkin/zscheckinKeyDispense.html',
            controller: 'zsCheckinKeyDispenseCtrl',
            jumper: true,
            section: 'Checkin',
            icon: 'checkin_key_select.png',
            description: 'Select what type of key to use',
            label: 'Check-In Key Types (Mobile Key)',
            modes: [{
                'name': 'MOBILE_OR_PHYSICAL_KEY_START',
                'label': 'Checked-In Success (Mobile or Physical Key)',
                'description': 'After Check-In, before Mobile Key selection screen',
                'icon': 'placeholder.png'
            }, {
                'name': 'MOBILE_KEY_SETUP_ACCOUNT',
                'label': 'Default: Mobile Key Setup Instructions',
                'description': 'Show user instructions on how to install the mobile app',
                'icon': 'placeholder.png'
            }, {
                'name': 'MOBILE_KEY_SENT_SUCCESS',
                'label': 'Default: Mobile Key Successfuly Sent',
                'description': 'Key was sent to the guest\'s phone',
                'icon': 'placeholder.png'
            }, {
                'name': 'MOBILE_KEY_ACCOUNT_NOT_CONNECTED',
                'label': 'Default: Mobile Key Not Connected',
                'description': 'Guest has a free early check-in',
                'icon': 'placeholder.png'
            }, {
                'name': 'THIRD_PARTY_SELECTION',
                'label': 'Third-Party: Mobile Key Selection',
                'description': 'Options to Get key, get instructions, or no thanks',
                'icon': 'placeholder.png'
            }, {
                'name': 'THIRD_PARTY_HAVE_IT_INFO',
                'label': 'Third-Party: Have it, What to do',
                'description': 'Instruct user on how to get or use the mobile key',
                'icon': 'placeholder.png'
            }, {
                'name': 'THIRD_PARTY_GET_IT_INFO',
                'label': 'Third-Party: Help get it, What to do',
                'description': 'Instruct user on how download and use the mobile key',
                'icon': 'placeholder.png'
            }, {
                'name': 'THIRD_PARTY_GET_IT_INFO_EMAIL_SENT',
                'label': 'Third-Party: Email Sent ',
                'description': 'Instructions in email for guest to get Mobile Key App',
                'icon': 'placeholder.png'
            }]


        });


        // signature screen
        $stateProvider.state('zest_station.checkInSignature', {
            url: '/checkInReservationDeposit/:reservation_id/:email/:first_name/:room_no/:guest_id/:guest_email_blacklisted/:passports_scanned',
            templateUrl: '/assets/partials_v2/checkin/zsCheckinSignature.html',
            controller: 'zsCheckinSignatureCtrl',
            jumper: true,
            section: 'Checkin',
            icon: 'checkin_signature.png',
            description: 'Reservation Signature to Check-In the guest',
            label: 'Signature'
        });

        // passport scanning flow
        $stateProvider.state('zest_station.checkInScanPassport', {
            url: '/checkInScanPassport/:reservation_id/:email/:first_name/:room_no/:guest_id/:guest_email_blacklisted/:signature/:passports_scanned/:quickJumpMode/:isQuickJump/:from_pickup_key',
            templateUrl: '/assets/partials_v2/checkin/zsCheckinScanPassport.html',
            controller: 'zsCheckinScanPassportCtrl',
            jumper: true,
            sntOnly: false,
            section: 'Checkin',
            icon: 'checkin_scan_passport.png',
            // description: 'To Continue Checking-In, Guests Will Scan Passports',
            label: 'Scan Guest IDs',

            modes: [{
                'name': 'SCAN_PASSPORT',
                'label': 'Scan ID Start',
                'sntOnly': false,
                'description': 'Start ID Scanning, initial page after signature',
                'icon': ''
            }, {
                'name': 'SCANNING_IN_PROGRESS',
                'sntOnly': false,
                'label': 'Scanning in progress page',
                'description': 'User has started the scanner, scanning in progress',
                'icon': ''
            }, {
                'name': 'SCAN_FAILURE',
                'label': 'Scan Failed',
                'sntOnly': false,
                'description': 'Scanning of the ID failed',
                'icon': ''
            }, {
                'name': 'SCAN_RESULTS',
                'sntOnly': false,
                'label': 'ID Scan Results',
                'description': 'Results of ID scans for guests on reservation',
                'icon': ''
            }, {
                'name': 'WAIT_FOR_STAFF',
                'sntOnly': false,
                'label': 'Wait for staff to verify passports',
                'description': 'Guest must wait until a staff member to continue',
                'icon': ''
            }, {
                'name': 'ADMIN_LOGIN_ID',
                'sntOnly': false,
                'label': 'Staff Verify ID, admin Login ID',
                'description': '',
                'icon': ''
            }, {
                'name': 'ADMIN_LOGIN_PWD',
                'sntOnly': false,
                'label': 'Staff Verify ID, admin Login Password',
                'description': '',
                'icon': ''
            }, {
                'name': 'ADMIN_VERIFY_PASSPORTS',
                'sntOnly': false,
                'label': 'Staff Verify Passports - List View',
                'description': '',
                'icon': ''
            }, {
                'name': 'ADMIN_VERIFY_PASSPORT_VIEW',
                'sntOnly': false,
                'label': 'Verify Passport (Selected View)',
                'description': '',
                'icon': ''
            }]


        });


        // email entry screen
        $stateProvider.state('zest_station.checkInEmailCollection', {
            url: '/checkInEmailCollection/:reservation_id/:first_name/:room_no/:guest_id',
            templateUrl: '/assets/partials_v2/checkin/zsCheckinEmailCollection.html',
            controller: 'zsCheckinEmailCollectionCtrl',
            jumper: true,
            section: 'Checkin',
            icon: 'checkin_collect_email.png',
            label: 'Collect Email',
            description: 'Email collection screen, text-input with email validation'

        });

        // email /print entry screen
        $stateProvider.state('zest_station.zsCheckinBillDeliveryOptions', {
            url: '/checkinBillDeliveryOptions/:reservation_id/:email/:first_name/:room_no/:guest_id/:key_success/:key_type',
            templateUrl: '/assets/partials_v2/checkin/zsCheckinRegCardDeliveryOptions.html',
            controller: 'zsCheckinRegCardDeliveryOptionsCtrl',
            jumper: true,
            section: 'Checkin',
            icon: 'checkin_reg_delivery.png',
            description: 'Select how registration should be delivered',
            label: 'Registration Delivery Options'
        });

        // checkin final screen
        $stateProvider.state('zest_station.zsCheckinFinal', {
            url: '/zsCheckinFinal/:print_opted/:email_opted/:print_status/:email_status/:key_success/:key_type',
            templateUrl: '/assets/partials_v2/checkin/zsCheckinFinal.html',
            controller: 'zsCheckinFinalCtrl',
            jumper: true,
            section: 'Checkin',
            icon: 'checkin_final.png',
            description: 'Last screen in the Check-In flow',
            label: 'Final Screen'
        });

        // check-in room error
        $stateProvider.state('zest_station.checkinRoomError', {
            url: '/checkinRoomError/:first_name/:early_checkin_unavailable',
            templateUrl: '/assets/partials_v2/checkin/zsCheckinRoomError.html',
            controller: 'zsRoomErrorCtrl',
            jumper: true,
            section: 'Checkin',
            label: 'Room Error',
            icon: 'checkin_room_error.png',
            description: 'Error screen if room or early check-in is unavailable',
            tags: ['oops']
        });


        // early check-in
        $stateProvider.state('zest_station.earlyCheckin', {
            url: '/checkinEarly/:early_checkin_data:/:early_charge_symbol/:selected_reservation/:isQuickJump/:quickJumpMode',
            templateUrl: '/assets/partials_v2/checkin/zsCheckinEarly.html',
            controller: 'zsCheckinEarlyCtrl',
            // These are for navigating directly to a screen
            // for editing text quickly / debugging / demos /etc
            jumper: true,
            section: 'Checkin',
            label: 'Early Checkin',
            // Views With modes only show modes + mode descriptions
            modes: [{
                'name': 'EARLY_CHECKIN_SELECT',
                'label': 'Purchase Early Checkin',
                'description': 'Select to purchase early checkin or to check-in later',
                'icon': 'eci_purchase.png'
            }, {
                'name': 'EARLY_CHECKIN_PREPAID',
                'label': 'Prepaid Early Checkin',
                'description': 'User has prepaid for the early check-in, or it was part of a bundle/add-on',
                'icon': 'eci_prepaid.png'
            }, {
                'name': 'EARLY_CHECKIN_FREE',
                'label': 'FREE Early Checkin',
                'description': 'Guest has a free early check-in',
                'icon': 'eci_free.png'
            }]
        });

        // early check-in
        $stateProvider.state('zest_station.checkinSuccess', {
            url: '/checkinSuccess/:guest_id/:reservation_id/:room_no/:email/:first_name/:guest_email_blacklisted',
            templateUrl: '/assets/partials_v2/checkin/zsCheckinSuccess.html',
            controller: 'zsCheckinSuccessCtrl',
            jumper: true,
            section: 'Checkin',
            icon: 'checkin_success.png',
            description: 'Success screen after check-in',
            label: 'Checkin Success'
        });

        // ows msgs
        $stateProvider.state('zest_station.owsMsgsPresent', {
            url: '/owsMsgPresent/:guest_id/:reservation_id/:room_no/:email/:first_name/:ows_msgs/:guest_email_blacklisted',
            templateUrl: '/assets/partials_v2/checkin/zsOwsMsgsPresent.html',
            controller: 'zsOwsMsgListingCtrl',
            jumper: false,
            section: 'Checkin',
            description: '',
            label: 'Guest Message'
        });

        // room upsells
        $stateProvider.state('zest_station.roomUpsell', {
            url: '/checkinRoomUpsell/:isQuickJump/:quickJumpMode',
            templateUrl: '/assets/partials_v2/checkin/zsCheckinRoomUpsell.html',
            controller: 'zsCheckinRoomUpsellCtrl',
            jumper: false,
            placeholderData: true,
            section: 'Checkin',
            description: '',
            label: 'Room Upsell'
        });

         // addon upsells
        $stateProvider.state('zest_station.addOnUpsell', {
            url: '/checkinAddon/:is_from_room_upsell/:isQuickJump/:quickJumpMode',
            templateUrl: '/assets/partials_v2/checkin/zsCheckinAddon.html',
            controller: 'zsCheckinAddonCtrl',
            jumper: false,
            section: 'Checkin',
            description: 'Check-In Add-on Upsell',
            placeholderData: true,
            label: 'Addon'
        });

        $stateProvider.state('zest_station.checkInMLIAndCBACCCollection', {
            url: '/checkInMLIAndCBACCCollection/:params',
            templateUrl: '/assets/partials_v2/checkin/zsCheckInMLIAndCBACCCollection.html',
            controller: 'zsCheckInMLIAndCBACCCollectionCtrl'
        });

        $stateProvider.state('zest_station.noCCPresentForCheckin', {
            url: '/checkInMLIAndCBACCCollection/:params',
            templateUrl: '/assets/partials_v2/checkin/zsCheckInNoCCAvailable.html'
        });

        $stateProvider.state('zest_station.checkInIdVerification', {
            url: '/checkInIdVerification/:params',
            templateUrl: '/assets/partials_v2/checkin/zsCheckinVerifyId.html',
            controller: 'zsCheckinVerifyIdCtrl'
        });

        $stateProvider.state('zest_station.collectGuestAddress', {
            url: '/collectGuestAddress',
            templateUrl: '/assets/partials_v2/checkin/zsCheckinGuestAddress.html',
            controller: 'zsCheckinGuestAddressCtrl',
            resolve: {
                guestAddress: function(zsCheckinSrv) {
                    return zsCheckinSrv.fetchReservationAddress(zsCheckinSrv.getSelectedCheckInReservation().id);
                },
                countryList: function(zsGeneralSrv) {
                    return zsGeneralSrv.fetchCountryList();
                }
            }
        });

        $stateProvider.state('zest_station.findReservationFromId', {
            url: '/findReservationFromId',
            controller: 'zsCheckinfindReservationFromIdCtrl',
            templateUrl: '/assets/partials_v2/checkin/zsFindReservationUsingId.html'
        });

        $stateProvider.state('zest_station.walkInReservation', {
            url: '/walkInReservation',
            controller: 'zsWalkInCtrl',
            templateUrl: '/assets/partials_v2/walkin/zsWakinReservationMain.html',
            resolve: {
                bussinessDateData: function(zsGeneralSrv) {
                    return zsGeneralSrv.fetchHotelBusinessDate();
                }
            }
        });
    
    }
]);
