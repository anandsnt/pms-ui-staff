/*
	Checkin options Ctrl 
	There are two options 1) checkin now 2)  checkin later
*/

(function() {
	var checkinOptionsController = function($scope, $rootScope, $state) {
		$rootScope.checkinOptionShown = true;

		var earlyCheckinOn = true;
		var isInEarlyCheckinWindow = true;
		var offerEci = true;


		var assignRoom = function(type) {
			var onFailre = function() {

			};
			var onSuccess = function() {
				if (earlyCheckinOn && isInEarlyCheckinWindow) {
					if (offerEci) {
						$state.go('earlyCheckinOptions', {
							'time': '02:00 PM',
							'charge': '$20',
							'id': 2,
							'isFromCheckinNow': 'true'
						});
					} else {
						console.log('noEci');
					}
				} else {
					console.log('earlyCheckinOff');
				}
			};
			onSuccess();
		};



		$scope.checkinNow = function() {
			assignRoom();
		};

		$scope.checkinLater = function() {
			$state.go('checkinArrival');
		};
	};

	var dependencies = [
		'$scope', '$rootScope', '$state',
		checkinOptionsController
	];

	sntGuestWeb.controller('checkinOptionsController', dependencies);
})();