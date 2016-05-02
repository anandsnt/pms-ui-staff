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
			templateUrl: '/assets/partials_v2/checkin/zsCheckInReservationDetails.html',
			controller: 'zsCheckInReservationDetailsCtrl'
		});

		//checkin key dispense
		$stateProvider.state('zest_station.checkInKeyDispense', {
			url: '/checkInKeyDispense',
			templateUrl: '/assets/partials_v2/checkin/zsCheckinKey.html',
			controller: 'zsCheckinKeyDispensCtrl'
		});
	}
]);