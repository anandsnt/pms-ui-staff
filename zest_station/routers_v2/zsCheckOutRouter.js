sntZestStation.config(['$stateProvider',
	function($stateProvider) {
		$stateProvider.state('zest_station.checkOutReservationSearch', {
			url: '/checkoutReservationSearch',
			templateUrl: '/assets/partials_v2/checkout/zsCheckoutReservationSearch.html',
			controller: 'zsCheckoutReservationSearchCtrl'
		}).state('zest_station.checkoutSearchOptions', {
			url: '/checkoutSearchOptions',
			controller: 'zsCheckOutOptionsCtrl',
			templateUrl: '/assets/partials_v2/checkout/zsCheckOutOptions.html'
		}).state('zest_station.checkoutKeyCardLookUp', {
             url: '/checkoutKeyCardLookUp', 
             controller: 'zsCheckoutKeyCardActionsCtrl',
             templateUrl: '/assets/partials_v2/checkout/zsCheckoutKeyCardActions.html'
         }).state('zest_station.checkoutReservationBill', {
             url: '/checkoutReservationBill/:from/:reservation_id/:email/:guest_detail_id/:has_cc/:first_name/:last_name/:days_of_stay/:is_checked_out/:hours_of_stay', 
             controller: 'zsReservationBillDetailsCtrl',
             templateUrl: '/assets/partials_v2/checkout/zsReservationBill.html'
         }).state('zest_station.reservationCheckedOut', {
            url        : '/reservation_checked_out',
            templateUrl: '/assets/partials_v2/checkout/zsCheckoutFinal.html',
            controller: 'zsCheckoutFinalCtrl'
         });
	}
]);