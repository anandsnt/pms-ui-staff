sntZestStation.config(['$stateProvider',
	function($stateProvider) {
		//checkout reservation search
		$stateProvider.state('zest_station.checkOutReservationSearch', {
			url: '/checkoutReservationSearch',
			templateUrl: '/assets/partials_v2/checkout/zsCheckoutReservationSearch.html',
			controller: 'zsCheckoutReservationSearchCtrl'
		});
		//checkout options
		$stateProvider.state('zest_station.checkoutSearchOptions', {
			url: '/checkoutSearchOptions',
			controller: 'zsCheckOutOptionsCtrl',
			templateUrl: '/assets/partials_v2/checkout/zsCheckOutOptions.html'
		});
		//checkout keycard lookup
		$stateProvider.state('zest_station.checkoutKeyCardLookUp', {
			url: '/checkoutKeyCardLookUp',
			controller: 'zsCheckoutKeyCardActionsCtrl',
			templateUrl: '/assets/partials_v2/checkout/zsCheckoutKeyCardActions.html'
		});
		//checkout bill + checkout bill print
		$stateProvider.state('zest_station.checkoutReservationBill', {
			url: '/checkoutReservationBill/:from/:reservation_id/:email/:guest_detail_id/:has_cc/:first_name/:last_name/:days_of_stay/:is_checked_out/:hours_of_stay',
			controller: 'zsReservationBillDetailsCtrl',
			templateUrl: '/assets/partials_v2/checkout/zsReservationBill.html'
		});
		//send emaill bill
		$stateProvider.state('zest_station.emailBill', {
			url: '/emailBill/:printopted/:email/:guest_detail_id/:reservation_id',
			templateUrl: '/assets/partials_v2/checkout/zsEmailBill.html',
			controller: 'zsEmailBillCtrl'
		});
		//checkout final
		$stateProvider.state('zest_station.reservationCheckedOut', {
			url: '/reservationCheckedOut/:printopted',
			templateUrl: '/assets/partials_v2/checkout/zsCheckoutFinal.html',
			controller: 'zsCheckoutFinalCtrl'
		});
	}
]);