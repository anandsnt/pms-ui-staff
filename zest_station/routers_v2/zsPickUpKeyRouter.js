sntZestStation.config(['$stateProvider',
	function($stateProvider) {
		// checkin reservation search
		$stateProvider.state('zest_station.qrPickupKey', {
			url: '/qrPickupKey',
			templateUrl: '/assets/partials_v2/pickupKey/zsQRPickupKey.html',
			controller: 'zsQrPickupKeyCtrl',
            jumper: true,
            section: 'Pickup',
            label: 'Pickup Key'
		});

		// pickup key dispense
		$stateProvider.state('zest_station.pickUpKeyDispense', {
			url: '/pickUpKeyDispense/:reservation_id/:room_no/:first_name',
			templateUrl: '/assets/partials_v2/pickupKey/zsPickupKeyDispense.html',
			controller: 'zsPickupKeyDispenseCtrl',
            jumper: true,
            section: 'Pickup',
            label: 'Key Dispense'
		});

		// pickup key reg card print
		$stateProvider.state('zest_station.pickUpKeyDispenseRegistrationCardPrint', {
			url: '/pickUpKeyDispenseRegistrationCardPrint/:reservation_id/:key_created',
			templateUrl: '/assets/partials_v2/pickupKey/zsPickupKeyRegistartionCardPrint.html',
			controller: 'zsPickupKeyRegistartionCardPrintCtrl',
            jumper: true,
            section: 'Pickup',
            label: 'Pickup Registration Print'
		});
	}
]);
