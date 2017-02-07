sntZestStation.config(['$stateProvider',
	function($stateProvider) {
		// checkout reservation search
		$stateProvider.state('zest_station.checkOutReservationSearch', {
			url: '/checkoutReservationSearch/:mode',
			templateUrl: '/assets/partials_v2/zsCheckoutReservationSearch.html',
			controller: 'zsPickupAndCheckoutReservationSearchCtrl',
            jumper: true,
            section: 'Checkout',
            label: 'Check-Out Search',
            description: '',
            icon: 'checkout_search.png'
		});
		// checkout options
		$stateProvider.state('zest_station.checkoutSearchOptions', {
			url: '/checkoutSearchOptions',
			controller: 'zsCheckOutOptionsCtrl',
			templateUrl: '/assets/partials_v2/checkout/zsCheckOutOptions.html',
            jumper: true,
            section: 'Checkout',
            label: 'Check-Out Search Options',
            description: 'Guest can select Key Card lookup or by Name',
            icon: 'checkout_search_options.png'
		});
		// checkout keycard lookup
		$stateProvider.state('zest_station.checkoutKeyCardLookUp', {
			url: '/checkoutKeyCardLookUp/:isQuickJump/:quickJumpMode',
			controller: 'zsCheckoutKeyCardActionsCtrl',
			templateUrl: '/assets/partials_v2/checkout/zsCheckoutKeyCardActions.html',
            jumper: true,
            section: 'Checkout',
            label: 'Check-Out Card Lookup',
            description: '',
            modes: [{
                  'name': 'FAILED',
                  'label': 'Card Lookup Failed',
                  'description': 'Show Failed Message to User for Retry',
                  'icon': 'checkout_key_failed.png'
              },
              {
                  'name': 'IN_PROGRESS',
                  'label': 'Card Lookup In-Progress',
                  'description': 'Waiting Message for User, Card Lookup In-Progress',
                  'icon': 'checkout_key_progress.png'
              },  {
                  'name': 'READY',
                  'label': 'Card Lookup Ready For User',
                  'description': 'Ready for user to insert their key card',
                  'icon': 'checkout_key_ready.png'
              }]
		});
		// checkout bill + checkout bill print
		$stateProvider.state('zest_station.checkoutReservationBill', {
			url: '/checkoutReservationBill/:from/:reservation_id/:email/:guest_detail_id/:has_cc/:first_name/:last_name/:days_of_stay/:is_checked_out/:hours_of_stay/:isQuickJump/:quickJumpMode',
			controller: 'zsReservationBillDetailsCtrl',
			templateUrl: '/assets/partials_v2/checkout/zsReservationBill.html',
            jumper: true,
            placeholderData: true,
            section: 'Checkout',
            label: 'Check-Out Bill',
            description: '',
            icon: 'checkout_search.png'
		});
		// send emaill bill
		$stateProvider.state('zest_station.emailBill', {
			url: '/emailBill/:printopted/:reservation_id/:email/:guest_detail_id',
			templateUrl: '/assets/partials_v2/checkout/zsEmailBill.html',
			controller: 'zsEmailBillCtrl',
            jumper: true,
            section: 'Checkout',
            label: 'Check-Out Email Bill',
            description: '',
            icon: 'checkout_edit_email.png'
		});
		// checkout final
		$stateProvider.state('zest_station.reservationCheckedOut', {
			url: '/reservationCheckedOut/:printopted/:email_sent/:email_failed',
			templateUrl: '/assets/partials_v2/checkout/zsCheckoutFinal.html',
			controller: 'zsCheckoutFinalCtrl',
            jumper: true,
            section: 'Checkout',
            label: 'Check-Out Final',
            description: '',
            icon: 'checkout_final.png'
		});
	}
]);