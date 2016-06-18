sntZestStation.config(['$stateProvider',
	function($stateProvider) {
		//checkin reservation search
		$stateProvider.state('zest_station.checkInReservationSearch', {
			url: '/checkInReservationSearch',
			templateUrl: '/assets/partials_v2/checkin/zscheckInReservationSearch.html',
			controller: 'zscheckInReservationSearchCtrl'
		});
                
        //checkin reservation details 
        $stateProvider.state('zest_station.checkInReservationDetails', {
			url: '/checkInReservationDetails',
			templateUrl: '/assets/partials_v2/checkin/zsCheckinReservationDetails.html',
			controller: 'zsCheckInReservationDetailsCtrl'
		});
		//select checkin reservation from array of reservations.
		$stateProvider.state('zest_station.selectReservationForCheckIn', {
			url: '/selectReservationForCheckIn',
			templateUrl: '/assets/partials_v2/checkin/zsSelectReservationForCheckIn.html',
			controller: 'zsSelectReservationForCheckInCtrl'
		});
		//select nationality
		$stateProvider.state('zest_station.collectNationality', {
            url         : '/collect_nationality/:guestId/',
            templateUrl : '/assets/partials_v2/checkin/zsCollectNationality.html',
            controller  : 'zsCollectNationalityCtrl',
            resolve: {
                countryList: function(zsGeneralSrv){
                    return zsGeneralSrv.fetchCountryList();
                },
                sortedCountryList: function(zsGeneralSrv){
                     return zsGeneralSrv.fetchSortedCountryList();
                }
            }
        });

		$stateProvider.state('zest_station.add_remove_guests', {
			url: '/checkInAddRemoveGuest',
			templateUrl: '/assets/partials_v2/checkin/zsCheckInAddRemoveGuest.html',
			controller: 'zsCheckInAddRemoveGuestCtrl'
		});
		//checkin key dispense
		$stateProvider.state('zest_station.checkInKeyDispense', {
			url: '/checkInKeyDispense/:reservation_id/:room_no/:first_name/:guest_id/:email',
			templateUrl: '/assets/partials_v2/checkin/zsCheckinKey.html',
			controller: 'zsCheckinKeyDispenseCtrl'
		});
                
		//checking credit card swipe                 
      	$stateProvider.state('zest_station.checkInCardSwipe', {
			url: '/checkInReservationCard/:mode/:reservation_id/:guest_id/:swipe/:guest_email/:guest_email_blacklisted/:room_no/:room_status/:payment_type_id/:deposit_amount/:balance_amount/:pre_auth_amount_at_checkin/:authorize_cc_at_checkin/:confirmation_number',
			templateUrl: '/assets/partials_v2/checkin/zsCheckinCCSwipe.html',
			controller: 'zsCheckinCCSwipeCtrl'
		});
		//terms and conditions                
      	$stateProvider.state('zest_station.checkInTerms', {
			url: '/checkInTermsAndConditions/:guest_id/:reservation_id/:payment_type_id/:deposit_amount/:guest_email/:guest_email_blacklisted/:room_no/:room_status/:first_name/:balance_amount/:pre_auth_amount_at_checkin/:authorize_cc_at_checkin/:confirmation_number',
			templateUrl: '/assets/partials_v2/checkin/zsCheckinTermsConditions.html',
			controller: 'zsCheckInTermsConditionsCtrl'
		});
		//reservation deposit                
      	$stateProvider.state('zest_station.checkInDeposit', {
			url: '/checkInReservationDeposit/:reservation_id/:mode/:payment_type_id/:deposit_amount/:guest_email/:guest_email_blacklisted/:room_no/:room_status/:guest_id/:balance_amount/:pre_auth_amount_at_checkin/:authorize_cc_at_checkin/:confirmation_number',
			templateUrl: '/assets/partials_v2/checkin/zsCheckinDeposit.html',
			controller: 'zsCheckinDepositCtrl'
		});
		//pickup key dispense
		$stateProvider.state('zest_station.checkinKeyDispense', {
			url: '/checkinKeyDispense/:reservation_id/:room_no/:first_name/:guest_id/:email',
			templateUrl: '/assets/partials_v2/checkin/zscheckinKeyDispense.html',
			controller: 'zsCheckinKeyDispenseCtrl'
		});
		// signature screen
      	$stateProvider.state('zest_station.checkInSignature', {
			url: '/checkInReservationDeposit/:reservation_id/:email/:first_name/:room_no/:guest_id/:guest_email_blacklisted',
			templateUrl: '/assets/partials_v2/checkin/zsCheckinSignature.html',
			controller: 'zsCheckinSignatureCtrl'
		});

		// email entry screen
      	$stateProvider.state('zest_station.checkInEmailCollection', {
			url: '/checkInEmailCollection/:reservation_id/:first_name/:room_no/:guest_id',
			templateUrl: '/assets/partials_v2/checkin/zsCheckinEmailCollection.html',
			controller: 'zsCheckinEmailCollectionCtrl'
		});

      	// email /print entry screen
      	$stateProvider.state('zest_station.zsCheckinBillDeliveryOptions', {
			url: '/checkinBillDeliveryOptions/:reservation_id/:email/:first_name/:room_no/:guest_id/:key_success',
			templateUrl: '/assets/partials_v2/checkin/zsCheckinRegCardDeliveryOptions.html',
			controller: 'zsCheckinRegCardDeliveryOptionsCtrl'
		});

		// checkin final screen
      	$stateProvider.state('zest_station.zsCheckinFinal', {
			url: '/zsCheckinFinal/:print_opted/:email_opted/:print_status/:email_status/:key_success',
			templateUrl: '/assets/partials_v2/checkin/zsCheckinFinal.html',
			controller: 'zsCheckinFinalCtrl'
		});
      	
      	// check-in room error
      	$stateProvider.state('zest_station.checkinRoomError', {
			url: '/checkinRoomError/:first_name',
			templateUrl: '/assets/partials_v2/checkin/zsCheckinRoomError.html',
			controller: 'zsRoomErrorCtrl'
		});
                
                
      	// early check-in
      	$stateProvider.state('zest_station.earlyCheckin', {
			url: '/checkinEarly/:early_checkin_data:/:early_charge_symbol',
			templateUrl: '/assets/partials_v2/checkin/zsCheckinEarly.html',
			controller: 'zsCheckinEarlyCtrl'
		});
      	
	}
]);