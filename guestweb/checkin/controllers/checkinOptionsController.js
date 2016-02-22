/*
	Checkin options Ctrl 
	There are two options 1) checkin now 2)  checkin later
*/

(function() {
	var checkinOptionsController = function($scope, $rootScope, $state, $modal) {
		$rootScope.checkinOptionShown = true;

		var earlyCheckinOn = true;
		var isInEarlyCheckinWindow = true;
		var offerEci = true;


		var showRoomAssigErrorPopup = function() {
			$scope.errorOpts = {
				backdrop: true,
				backdropClick: true,
				templateUrl: '/assets/checkin/partials/commonErrorModal.html',
				controller: 'roomAssignErrorPopupCtrl',
				resolve: {
					errorMessage: function() {
						return "Something went room while assigning room.Please click continue to checkin later.";
					}
				}
			};
			$modal.open($scope.errorOpts);
		};

		var assignRoom = function(type) {
			console.log("assignRoom");
			var onFailre = function() {
				if (earlyCheckinOn && isInEarlyCheckinWindow) {
					if (offerEci) {
					// Early checkin is  on and offer available now
						showRoomAssigErrorPopup();
					} else {
					// Early checkin is  on and offer unavailable now
						// to do
					}
				} else {
					// Early checkin is not on
					showRoomAssigErrorPopup();
				};
			};
			var onSuccess = function() {
				if (earlyCheckinOn && isInEarlyCheckinWindow) {
					// Early checkin is  on and offer available now
					if (offerEci) {
						$state.go('earlyCheckinOptions', {
							'time': '02:00 PM',
							'charge': '$20',
							'id': 2,
							'isFromCheckinNow': 'true'
						});
					} else {
					// Early checkin is  on but no offer available now
						console.log('noEci'); // to do
					}
				} else {
					// Early checkin is not on
					$state.go('checkinKeys');
				}
			};
			onFailre();
		};
		$scope.checkinNow = function() {
			assignRoom();
		};
		$scope.checkinLater = function() {
			$state.go('checkinArrival');
		};
	};

	var dependencies = [
		'$scope', '$rootScope', '$state', '$modal',
		checkinOptionsController
	];

	sntGuestWeb.controller('checkinOptionsController', dependencies);
})();

// controller for the modal

var roomAssignErrorPopupCtrl = function($scope, $modalInstance, $state, errorMessage) {

	$scope.errorMessage = errorMessage;
	$scope.closeDialog = function() {
		$modalInstance.dismiss('cancel');
		$state.go('checkinArrival');
	};
};