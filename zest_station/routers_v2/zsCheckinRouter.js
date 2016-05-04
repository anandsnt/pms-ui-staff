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
            url         : '/collect_nationality/:guestId',
            templateUrl : '/assets/partials_v2/checkin/zsCollectNationality.html',
            controller  : 'zsCollectNationalityCtrl',
            resolve: {
                countryList: function(zsGeneralSrv){
                    return zsGeneralSrv.fetchCountryList();
                }
            }
        });

		//checkin key dispense
		$stateProvider.state('zest_station.checkInKeyDispense', {
			url: '/checkInKeyDispense',
			templateUrl: '/assets/partials_v2/checkin/zsCheckinKey.html',
			controller: 'zsCheckinKeyDispensCtrl'
		});
                
		//checking credit card swipe                 
      	$stateProvider.state('zest_station.checkInCardSwipe', {
			url: '/checkInReservationCard',
			templateUrl: '/assets/partials_v2/checkin/zsCheckinCCSwipe.html',
			controller: 'zsCheckinCCSwipeCtrl'
		});
		//terms and conditions                
      	$stateProvider.state('zest_station.checkInTerms', {
			url: '/checkInTermsAndConditions/:id/:payment_type_id/:deposit_amount',
			templateUrl: '/assets/partials_v2/checkin/zsCheckinTermsConditions.html',
			controller: 'zsCheckInTermsConditionsCtrl'
		});
		//reservation deposit                
      	$stateProvider.state('zest_station.checkInDeposit', {
			url: '/checkInReservationDeposit/:id/:mode/:payment_type_id/:deposit_amount',
			templateUrl: '/assets/partials_v2/checkin/zsCheckinDeposit.html',
			controller: 'zsCheckinCCSwipeCtrl'
		});
	}
]);