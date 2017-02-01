sntZestStation.config(['$stateProvider',
    function($stateProvider) {
		// checkin reservation search
        $stateProvider.state('zest_station.checkInReservationSearch', {
            url: '/checkInReservationSearch',
            templateUrl: '/assets/partials_v2/checkin/zscheckInReservationSearch.html',
            controller: 'zscheckInReservationSearchCtrl',
            jumper: true,
            label: 'Checkin | Reservation Search'
        });
                
        // checkin reservation details 
        $stateProvider.state('zest_station.checkInReservationDetails', {
            url: '/checkInReservationDetails/:pickup_key_mode',
            templateUrl: '/assets/partials_v2/checkin/zsCheckinReservationDetails.html',
            controller: 'zsCheckInReservationDetailsCtrl',
            jumper: false,
            label: 'Checkin | Reservation Details'
        });
		// select checkin reservation from array of reservations.
        $stateProvider.state('zest_station.selectReservationForCheckIn', {
            url: '/selectReservationForCheckIn',
            templateUrl: '/assets/partials_v2/checkin/zsSelectReservationForCheckIn.html',
            controller: 'zsSelectReservationForCheckInCtrl',
            jumper: false,
            label: 'Checkin | Select Reservation'
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
            label: 'Collect Nationality'
        });

        $stateProvider.state('zest_station.add_remove_guests', {
            url: '/checkInAddRemoveGuest/:pickup_key_mode',
            templateUrl: '/assets/partials_v2/checkin/zsCheckInAddRemoveGuest.html',
            controller: 'zsCheckInAddRemoveGuestCtrl',
            jumper: true,
            label: 'Checkin | Add/Remove Guest'
        });
		// checkin key dispense
        $stateProvider.state('zest_station.checkInKeyDispense', {
            url: '/checkInKeyDispense/:reservation_id/:room_no/:first_name/:guest_id/:email',
            templateUrl: '/assets/partials_v2/checkin/zsCheckinKey.html',
            controller: 'zsCheckinKeyDispenseCtrl',
            jumper: false,
            label: 'Checkin | Key Dispense'
        });
                
		// checking credit card swipe                 
        $stateProvider.state('zest_station.checkInCardSwipe', {
            url: '/checkInReservationCard/:mode/:first_name/:reservation_id/:guest_id/:swipe/:guest_email/:guest_email_blacklisted/:room_no/:room_status/:payment_type_id/:deposit_amount/:balance_amount/:pre_auth_amount_for_zest_station/:authorize_cc_at_checkin/:confirmation_number/:pickup_key_mode',
            templateUrl: '/assets/partials_v2/checkin/zsCheckinCCSwipe.html',
            controller: 'zsCheckinCCSwipeCtrl',
            jumper: false,
            label: 'Checkin | Card Swipe'
        });
		// terms and conditions                
      	$stateProvider.state('zest_station.checkInTerms', {
          url: '/checkInTermsAndConditions/:guest_id/:reservation_id/:payment_type_id/:deposit_amount/:guest_email/:guest_email_blacklisted/:room_no/:room_status/:first_name/:balance_amount/:pre_auth_amount_for_zest_station/:authorize_cc_at_checkin/:confirmation_number/:pickup_key_mode',
          templateUrl: '/assets/partials_v2/checkin/zsCheckinTermsConditions.html',
          controller: 'zsCheckInTermsConditionsCtrl',
          jumper: true,
          label: 'Checkin | Terms'
      });
		// reservation deposit                
      	$stateProvider.state('zest_station.checkInDeposit', {
          url: '/checkInReservationDeposit/:reservation_id/:mode/:payment_type_id/:deposit_amount/:guest_email/:guest_email_blacklisted/:room_no/:room_status/:guest_id/:balance_amount/:pre_auth_amount_for_zest_station/:authorize_cc_at_checkin/:confirmation_number/:first_name/:pickup_key_mode',
          templateUrl: '/assets/partials_v2/checkin/zsCheckinDeposit.html',
          controller: 'zsCheckinDepositCtrl',
          jumper: true,
          label: 'Checkin | Deposit'
      });
		// pickup key dispense
        $stateProvider.state('zest_station.checkinKeyDispense', {
            url: '/checkinKeyDispense/:reservation_id/:room_no/:first_name/:guest_id/:email',
            templateUrl: '/assets/partials_v2/checkin/zscheckinKeyDispense.html',
            controller: 'zsCheckinKeyDispenseCtrl',
            jumper: true,
            label: 'Checkin | Key Dispense'
        });
		// signature screen
        $stateProvider.state('zest_station.checkInSignature', {
            url: '/checkInReservationDeposit/:reservation_id/:email/:first_name/:room_no/:guest_id/:guest_email_blacklisted',
            templateUrl: '/assets/partials_v2/checkin/zsCheckinSignature.html',
            controller: 'zsCheckinSignatureCtrl',
            jumper: true,
            label: 'Checkin | Signature'
        });

		// email entry screen
        $stateProvider.state('zest_station.checkInEmailCollection', {
            url: '/checkInEmailCollection/:reservation_id/:first_name/:room_no/:guest_id',
            templateUrl: '/assets/partials_v2/checkin/zsCheckinEmailCollection.html',
            controller: 'zsCheckinEmailCollectionCtrl',
            jumper: true,
            label: 'Checkin | Collect Email'
        });

      	// email /print entry screen
      	$stateProvider.state('zest_station.zsCheckinBillDeliveryOptions', {
          url: '/checkinBillDeliveryOptions/:reservation_id/:email/:first_name/:room_no/:guest_id/:key_success',
          templateUrl: '/assets/partials_v2/checkin/zsCheckinRegCardDeliveryOptions.html',
          controller: 'zsCheckinRegCardDeliveryOptionsCtrl',
          jumper: true,
          label: 'Checkin | Registration Delivery Options'
      });

		// checkin final screen
      	$stateProvider.state('zest_station.zsCheckinFinal', {
          url: '/zsCheckinFinal/:print_opted/:email_opted/:print_status/:email_status/:key_success',
          templateUrl: '/assets/partials_v2/checkin/zsCheckinFinal.html',
          controller: 'zsCheckinFinalCtrl',
          jumper: true,
          label: 'Checkin | Final Screen'
      });
      	
      	// check-in room error
      	$stateProvider.state('zest_station.checkinRoomError', {
          url: '/checkinRoomError/:first_name/:early_checkin_unavailable',
          templateUrl: '/assets/partials_v2/checkin/zsCheckinRoomError.html',
          controller: 'zsRoomErrorCtrl',
          jumper: true,
          label: 'Checkin | Room Error'
      });
                
                
      	// early check-in
      	$stateProvider.state('zest_station.earlyCheckin', {
          url: '/checkinEarly/:early_checkin_data:/:early_charge_symbol/:selected_reservation',
          templateUrl: '/assets/partials_v2/checkin/zsCheckinEarly.html',
          controller: 'zsCheckinEarlyCtrl',
          jumper: false,
          label: 'Checkin | Early Checkin'
      });

        // early check-in
        $stateProvider.state('zest_station.checkinSuccess', {
            url: '/checkinSuccess/:guest_id/:reservation_id/:room_no/:email/:first_name/:guest_email_blacklisted',
            templateUrl: '/assets/partials_v2/checkin/zsCheckinSuccess.html',
            controller: 'zsCheckinSuccessCtrl',
            jumper: true,
            label: 'Checkin | Checkin Success'
        });

      // ows msgs
        $stateProvider.state('zest_station.owsMsgsPresent', {
            url: '/owsMsgPresent/:guest_id/:reservation_id/:room_no/:email/:first_name/:ows_msgs/:guest_email_blacklisted',
            templateUrl: '/assets/partials_v2/checkin/zsOwsMsgsPresent.html',
            controller: 'zsOwsMsgListingCtrl',
            jumper: false,
            label: 'Checkin | Guest Message'
        });

    // room upsells
        $stateProvider.state('zest_station.roomUpsell', {
            url: '/checkinRoomUpsell',
            templateUrl: '/assets/partials_v2/checkin/zsCheckinRoomUpsell.html',
            controller: 'zsCheckinRoomUpsellCtrl',
            jumper: false,
            label: 'Checkin | Room Upsell'
        });
      	
    }
]);