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
			url: '/checkInKeyDispense/:guest_id',
			templateUrl: '/assets/partials_v2/checkin/zsCheckinKey.html',
			controller: 'zsCheckinKeyDispensCtrl'
		});
                
		//checking credit card swipe                 
      	$stateProvider.state('zest_station.checkInCardSwipe', {
			url: '/checkInReservationCard/:mode/:id/:guest_id/:swipe/:guest_email/:guest_email_blacklisted/:room_no/:room_status',
			templateUrl: '/assets/partials_v2/checkin/zsCheckinCCSwipe.html',
			controller: 'zsCheckinCCSwipeCtrl'
		});
		//terms and conditions                
      	$stateProvider.state('zest_station.checkInTerms', {
			url: '/checkInTermsAndConditions/:guest_id/:reservation_id/:payment_type_id/:deposit_amount/:guest_email/:guest_email_blacklisted/:room_no/:room_status/:first_name',
			templateUrl: '/assets/partials_v2/checkin/zsCheckinTermsConditions.html',
			controller: 'zsCheckInTermsConditionsCtrl'
		});
		//reservation deposit                
      	$stateProvider.state('zest_station.checkInDeposit', {
			url: '/checkInReservationDeposit/:id/:mode/:payment_type_id/:deposit_amount/:guest_email/:guest_email_blacklisted/:room_no/:room_status/:guest_id',
			templateUrl: '/assets/partials_v2/checkin/zsCheckinDeposit.html',
			controller: 'zsCheckinCCSwipeCtrl'
		});
		//pickup key dispense
		$stateProvider.state('zest_station.checkinKeyDispense', {
			url: '/checkinKeyDispense/:reservation_id/:room_no/:first_name/:guest_id',
			templateUrl: '/assets/partials_v2/pickupKey/zscheckinKeyDispense.html',
			controller: 'zsPickupKeyDispenseCtrl'
		});
		// signature screen
      	$stateProvider.state('zest_station.checkInSignature', {
			url: '/checkInReservationDeposit/:reservation_id/:email/:first_name/:room_no/:guest_id',
			templateUrl: '/assets/partials_v2/checkin/zsCheckinSignature.html',
			controller: 'zsCheckinSignatureCtrl'
		});

		// email entry screen
      	$stateProvider.state('zest_station.checkInEmailCollection', {
			url: '/checkInEmailCollection/:reservation_id/:email/:first_name/:room_no/:from/:guest_id',
			templateUrl: '/assets/partials_v2/checkin/zsCheckinEmailCollection.html',
			controller: 'zsCheckinEmailCollectionCtrl'
		});

      	// email /print entry screen
      	$stateProvider.state('zest_station.zsCheckinBillDeliveryOptions', {
			url: '/checkinBillDeliveryOptions/:reservation_id/:email/:first_name/:room_no/:from/:guest_id',
			templateUrl: '/assets/partials_v2/checkin/zsCheckinRegCardDeliveryOptions.html',
			controller: 'zsCheckinRegCardDeliveryOptionsCtrl'
		});
      	
	}
]);