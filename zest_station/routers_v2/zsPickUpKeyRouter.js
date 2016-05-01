sntZestStation.config(['$stateProvider',
	function($stateProvider) {
		//checkin reservation search
		$stateProvider.state('zest_station.qrPickupKey', {
			url: '/qrPickupKey',
			templateUrl: '/assets/partials_v2/pickupKey/zsQRPickupKey.html',
			controller: 'zsQrPickupKeyCtrl'
		});

		//pickup key dispense
		$stateProvider.state('zest_station.pickUpKeyDispense', {
			url: '/pickUpKeyDispense',
			templateUrl: '/assets/partials_v2/checkin/zsPickupKeyDispense.html',
			controller: 'zsKeyDispenseCtrl'
		});
	}
]);
