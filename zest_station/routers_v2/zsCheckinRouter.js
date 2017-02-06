sntZestStation.config(['$stateProvider',
    function($stateProvider) {
		// checkin reservation search
        $stateProvider.state('zest_station.checkInReservationSearch', {
            url: '/checkInReservationSearch',
            templateUrl: '/assets/partials_v2/checkin/zscheckInReservationSearch.html',
            controller: 'zscheckInReservationSearchCtrl',
            jumper: true,
            section: 'Checkin',
            label: 'Reservation Search',
            tags: ['sign_screen']
        });
                
        // checkin reservation details 
        $stateProvider.state('zest_station.checkInReservationDetails', {
            url: '/checkInReservationDetails/:pickup_key_mode',
            templateUrl: '/assets/partials_v2/checkin/zsCheckinReservationDetails.html',
            controller: 'zsCheckInReservationDetailsCtrl',
            jumper: false,
            section: 'Checkin',
            label: 'Reservation Details'
        });
		// select checkin reservation from array of reservations.
        $stateProvider.state('zest_station.selectReservationForCheckIn', {
            url: '/selectReservationForCheckIn',
            templateUrl: '/assets/partials_v2/checkin/zsSelectReservationForCheckIn.html',
            controller: 'zsSelectReservationForCheckInCtrl',
            jumper: false,
            section: 'Checkin',
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
            label: 'Collect Nationality'
        });

        $stateProvider.state('zest_station.add_remove_guests', {
            url: '/checkInAddRemoveGuest/:pickup_key_mode',
            templateUrl: '/assets/partials_v2/checkin/zsCheckInAddRemoveGuest.html',
            controller: 'zsCheckInAddRemoveGuestCtrl',
            jumper: true,
            section: 'Checkin',
            label: 'Add/Remove Guest'
        });
		// checkin key dispense
        $stateProvider.state('zest_station.checkInKeyDispense', {
            url: '/checkInKeyDispense/:reservation_id/:room_no/:first_name/:guest_id/:email',
            templateUrl: '/assets/partials_v2/checkin/zsCheckinKey.html',
            controller: 'zsCheckinKeyDispenseCtrl',
            jumper: false,
            section: 'Checkin',
            label: 'Key Dispense'
        });
                
		// checking credit card swipe                 
        $stateProvider.state('zest_station.checkInCardSwipe', {
            url: '/checkInReservationCard/:mode/:first_name/:reservation_id/:guest_id/:swipe/:guest_email/:guest_email_blacklisted/:room_no/:room_status/:payment_type_id/:deposit_amount/:balance_amount/:pre_auth_amount_for_zest_station/:authorize_cc_at_checkin/:confirmation_number/:pickup_key_mode',
            templateUrl: '/assets/partials_v2/checkin/zsCheckinCCSwipe.html',
            controller: 'zsCheckinCCSwipeCtrl',
            jumper: false,
            section: 'Checkin',
            label: 'Card Swipe'
        });
		// terms and conditions                
      	$stateProvider.state('zest_station.checkInTerms', {
          url: '/checkInTermsAndConditions/:guest_id/:reservation_id/:payment_type_id/:deposit_amount/:guest_email/:guest_email_blacklisted/:room_no/:room_status/:first_name/:balance_amount/:pre_auth_amount_for_zest_station/:authorize_cc_at_checkin/:confirmation_number/:pickup_key_mode/:is_from_room_upsell',
          templateUrl: '/assets/partials_v2/checkin/zsCheckinTermsConditions.html',
          controller: 'zsCheckInTermsConditionsCtrl',
          jumper: true,
          section: 'Checkin',
          label: 'Terms'
      });
		// reservation deposit                
      	$stateProvider.state('zest_station.checkInDeposit', {
          url: '/checkInReservationDeposit/:reservation_id/:mode/:payment_type_id/:deposit_amount/:guest_email/:guest_email_blacklisted/:room_no/:room_status/:guest_id/:balance_amount/:pre_auth_amount_for_zest_station/:authorize_cc_at_checkin/:confirmation_number/:first_name/:pickup_key_mode',
          templateUrl: '/assets/partials_v2/checkin/zsCheckinDeposit.html',
          controller: 'zsCheckinDepositCtrl',
          jumper: true,
          section: 'Checkin',
          label: 'Deposit'
      });
		// pickup key dispense
        $stateProvider.state('zest_station.checkinKeyDispense', {
            url: '/checkinKeyDispense/:reservation_id/:room_no/:first_name/:guest_id/:email',
            templateUrl: '/assets/partials_v2/checkin/zscheckinKeyDispense.html',
            controller: 'zsCheckinKeyDispenseCtrl',
            jumper: true,
            section: 'Checkin',
            label: 'Key Dispense'
        });
		// signature screen
        $stateProvider.state('zest_station.checkInSignature', {
            url: '/checkInReservationDeposit/:reservation_id/:email/:first_name/:room_no/:guest_id/:guest_email_blacklisted',
            templateUrl: '/assets/partials_v2/checkin/zsCheckinSignature.html',
            controller: 'zsCheckinSignatureCtrl',
            jumper: true,
            section: 'Checkin',
            label: 'Signature'
        });

		// email entry screen
        $stateProvider.state('zest_station.checkInEmailCollection', {
            url: '/checkInEmailCollection/:reservation_id/:first_name/:room_no/:guest_id',
            templateUrl: '/assets/partials_v2/checkin/zsCheckinEmailCollection.html',
            controller: 'zsCheckinEmailCollectionCtrl',
            jumper: true,
            section: 'Checkin',
            label: 'Collect Email'
        });

      	// email /print entry screen
      	$stateProvider.state('zest_station.zsCheckinBillDeliveryOptions', {
          url: '/checkinBillDeliveryOptions/:reservation_id/:email/:first_name/:room_no/:guest_id/:key_success',
          templateUrl: '/assets/partials_v2/checkin/zsCheckinRegCardDeliveryOptions.html',
          controller: 'zsCheckinRegCardDeliveryOptionsCtrl',
          jumper: true,
          section: 'Checkin',
          label: 'Registration Delivery Options'
      });

		// checkin final screen
      	$stateProvider.state('zest_station.zsCheckinFinal', {
          url: '/zsCheckinFinal/:print_opted/:email_opted/:print_status/:email_status/:key_success',
          templateUrl: '/assets/partials_v2/checkin/zsCheckinFinal.html',
          controller: 'zsCheckinFinalCtrl',
          jumper: true,
          section: 'Checkin',
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
          modes: [
              {
                  'name': 'EARLY_CHECKIN_SELECT',
                  'label': 'Purchase Early Checkin'
              }, {
                  'name': 'EARLY_CHECKIN_PREPAID',
                  'label': 'Prepaid Early Checkin'
              }, {
                  'name': 'EARLY_CHECKIN_FREE',
                  'label': 'FREE Early Checkin'
              }]
      });

        // early check-in
        $stateProvider.state('zest_station.checkinSuccess', {
            url: '/checkinSuccess/:guest_id/:reservation_id/:room_no/:email/:first_name/:guest_email_blacklisted',
            templateUrl: '/assets/partials_v2/checkin/zsCheckinSuccess.html',
            controller: 'zsCheckinSuccessCtrl',
            jumper: true,
            section: 'Checkin',
            label: 'Checkin Success'
        });

      // ows msgs
        $stateProvider.state('zest_station.owsMsgsPresent', {
            url: '/owsMsgPresent/:guest_id/:reservation_id/:room_no/:email/:first_name/:ows_msgs/:guest_email_blacklisted',
            templateUrl: '/assets/partials_v2/checkin/zsOwsMsgsPresent.html',
            controller: 'zsOwsMsgListingCtrl',
            jumper: false,
            section: 'Checkin',
            label: 'Guest Message'
        });

    // room upsells
        $stateProvider.state('zest_station.roomUpsell', {
            url: '/checkinRoomUpsell',
            templateUrl: '/assets/partials_v2/checkin/zsCheckinRoomUpsell.html',
            controller: 'zsCheckinRoomUpsellCtrl',
            jumper: false,
            section: 'Checkin',
            label: 'Room Upsell'
        });
      	
    }
]);