sntZestStation.config(['$stateProvider',
	function($stateProvider) {
		//checkin reservation search
		$stateProvider.state('zest_station.qrPickupKey', {
			url: '/qrPickupKey',
			templateUrl: '/assets/partials_v2/pickupKey/zsQRPickupKey.html',
			controller: 'zsQrPickupKeyCtrl'
		});
	}
]);
