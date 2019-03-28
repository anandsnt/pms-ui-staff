sntZestStation.config(['$stateProvider',
    function($stateProvider) {
		// checkout reservation search
        $stateProvider.state('zest_station.checkOutReservationSearch', {
            url: '/checkoutReservationSearch/:mode/:isQuickJump/:quickJumpMode',
            templateUrl: '/assets/partials_v2/zsCheckoutReservationSearch.html',
            controller: 'zsPickupAndCheckoutReservationSearchCtrl',
            jumper: true,
            section: '',
            label: '',
            description: '',
            icon: 'checkout_search.png',
            modes: [{
                'name': 'CO_SEARCH',
                'label': 'Check-Out - Search by Name',
                'description': '',
                'icon': 'checkout_search.png'
            },{
                'name': 'CO_SEARCH_BY_ROOM',
                'label': 'Check-Out - Search by Room',
                'description': '',
                'icon': 'checkout_search.png'
            },{
                'name': 'PUK_SEARCH_BY_NAME',
                'label': 'Pickup Keys - Search by Name',
                'description': '',
                'icon': 'pickup_keys.png'
            },{
                'name': 'PUK_SEARCH_BY_ROOM',
                'label': 'Pickup Keys - Search by Room',
                'description': '',
                'icon': 'pickup_keys.png'
            }]
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
            }, {
                'name': 'READY',
                'label': 'Card Lookup Ready For User',
                'description': 'Ready for user to insert their key card',
                'icon': 'checkout_key_ready.png'
            }]
        });
		// checkout bill + checkout bill print
        $stateProvider.state('zest_station.checkoutReservationBill', {
            url: '/checkoutReservationBill/:from/:reservation_id/:email/:guest_detail_id/:has_cc/:first_name/:last_name/:days_of_stay/:is_checked_out/:hours_of_stay/:isQuickJump/:quickJumpMode/:dueBalancePaid',
            controller: 'zsReservationBillDetailsCtrl',
            templateUrl: '/assets/partials_v2/checkout/zsReservationBill.html',
            jumper: true,
            placeholderData: true,
            section: 'Checkout',
            label: 'Check-Out Bill',
            description: '',
            icon: 'checkout_search.png'
        });


        $stateProvider.state('zest_station.payment', {
            url: '/payment',
            templateUrl: '/assets/partials_v2/payment/paymentInitial.html',
            controller: 'zsCheckoutBalancePaymentCtrl',
            jumper: true,
            section: 'General',
            label: '',
            icon: 'home.png',
            tags: ['']
        });

		// send emaill bill
        $stateProvider.state('zest_station.emailBill', {
            url: '/emailBill/:printopted/:reservation_id/:email/:guest_detail_id/:isQuickJump/:quickJumpMode',
            templateUrl: '/assets/partials_v2/checkout/zsEmailBill.html',
            controller: 'zsEmailBillCtrl',
            jumper: true,
            section: 'Checkout',
            label: 'Check-Out Email Bill',
            description: '',
            icon: 'checkout_edit_email.png',
            modes: [{
                'name': 'EMAIL_BILL_GUEST_OPTIONS',
                'label': 'Check-Out - Email Bill Guest Options',
                'description': '',
                'icon': 'checkout_search.png'
            },{
                'name': 'EMAIL_BILL_EDIT_MODE',
                'label': 'Check-Out - Edit Email',
                'description': '',
                'icon': 'checkout_search.png'
            }]
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


        $stateProvider.state('zest_station.pickUpKeyReservationSearch', {
            url: '/pickUpKeyReservationSearch',
            templateUrl: '/assets/partials_v2/pickupKey/zsPickUpKeyReservationSearch.html',
            controller: 'zsPickupKeyFindReservationCtrl'
        });
    }
]);
