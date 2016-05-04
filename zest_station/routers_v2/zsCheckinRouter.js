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

		//checkin key dispense
		$stateProvider.state('zest_station.checkInKeyDispense', {
			url: '/checkInKeyDispense',
			templateUrl: '/assets/partials_v2/checkin/zsCheckinKey.html',
			controller: 'zsCheckinKeyDispensCtrl'
		});
                
		//checking credit card swipe and deposit                
      	$stateProvider.state('zest_station.checkInCardDeposit', {
			url: '/checkInReservationDetails',
			templateUrl: '/assets/partials_v2/checkin/zsCheckinCCSwipe.html',
			controller: 'zsCheckinCCSwipeCtrl'
		});
	}
]);