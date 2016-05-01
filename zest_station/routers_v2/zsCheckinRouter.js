sntZestStation.config(['$stateProvider',
	function($stateProvider) {
		//checkin reservation search
		$stateProvider.state('zest_station.checkInReservationSearch', {
			url: '/checkInReservationSearch',
			templateUrl: '/assets/partials_v2/checkin/zscheckInReservationSearch.html',
			controller: 'zscheckInReservationSearchCtrl'
		});
	}
]);