sntZestStation.config(['$stateProvider',
	function($stateProvider) {
		$stateProvider.state('zest_station.checkOutReservationSearch', {
			url: '/checkoutReservationSearch',
			templateUrl: '/assets/partials_v2/checkout/zsCheckoutReservationSearch.html',
			controller: 'zsCheckoutReservationSearchCtrl'
		});


		$stateProvider.state('zest_station.checkoutSearchOptions', {
			url: '/checkoutSearchOptions',
			controller: 'zsCheckOutOptionsCtrl',
			templateUrl: '/assets/partials_v2/checkout/zsCheckOutOptions.html'
		});

	}
]);