/*
	Checkin options Ctrl 
	There are two options 1) checkin now 2)  checkin later
*/

(function() {
	var checkinOptionsController = function($scope, $rootScope, $state, $modal, sntGuestWebSrv) {
		$rootScope.checkinOptionShown = true;

		var earlyCheckinOn = true;
		var isInEarlyCheckinWindow = true;
		var offerEci = true;

		//popup data with default texts
		// it can be overrided using the admin settings
		var setUpPopDataOfferEci = function() {
			var screenIdentifier = "32433";
			var screenCMSDetails = sntGuestWebSrv.extractScreenDetails(screenIdentifier);
			screenCMSDetails.title = screenCMSDetails.title.length > 0 ? screenCMSDetails.title : "Early Check in";
			screenCMSDetails.description = screenCMSDetails.description.length > 0 ?
				screenCMSDetails.description : "Something went room while assigning room. Please click continue to checkin later.";
			return screenCMSDetails;
		};

		var showRoomAssigErrorPopup = function() {
			var screenDetails = setUpPopDataOfferEci();
			$scope.errorOpts = {
				backdrop: true,
				backdropClick: true,
				templateUrl: '/assets/checkin/partials/commonErrorModal.html',
				controller: 'roomAssignErrorPopupCtrl',
				resolve: {
					screenDetails: function() {
						return screenDetails;
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
						$state.go('roomsUnavailable');
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
						$state.go('earlyCheckinReady');
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
		'$scope', '$rootScope', '$state', '$modal', 'sntGuestWebSrv',
		checkinOptionsController
	];

	sntGuestWeb.controller('checkinOptionsController', dependencies);
})();

// controller for the modal

var roomAssignErrorPopupCtrl = function($scope, $modalInstance, $state, screenDetails) {

	$scope.screenDetails = screenDetails;
	$scope.closeDialog = function() {
		$modalInstance.dismiss('cancel');
		$state.go('checkinArrival');
	};
};