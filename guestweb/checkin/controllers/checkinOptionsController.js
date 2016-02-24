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
		var is_room_already_assigned =true;
		var is_room_ready = false;
		var is_donot_move_room_marked = true;

		//popup data with default texts
		// it can be overrided using the admin settings
		var setUpPopDataOfferEci = function() {
			var screenIdentifier = "ECI-1"; //this value needs to set in admin(can be anything, but has to be same in both)
			var screenCMSDetails = sntGuestWebSrv.extractScreenDetails(screenIdentifier);
			screenCMSDetails.title = screenCMSDetails.title.length > 0 ? screenCMSDetails.title : "Early Check In.";
			screenCMSDetails.description = screenCMSDetails.description.length > 0 ?
				screenCMSDetails.description : "Something went room while assigning room. Please click continue to checkin later.";
			return screenCMSDetails;
		};
		//popup data with default texts
		// it can be overrided using the admin settings
		var setUpPopDataNoEci = function() {
			var screenIdentifier = "ECI-2"; //this value needs to set in admin(can be anything, but has to be same in both)
			var screenCMSDetails = sntGuestWebSrv.extractScreenDetails(screenIdentifier);
			screenCMSDetails.title = screenCMSDetails.title.length > 0 ? screenCMSDetails.title : "Sorry";
			screenCMSDetails.description = screenCMSDetails.description.length > 0 ?
				screenCMSDetails.description : "Something went room while assigning room. Please click continue to checkin later.";
			return screenCMSDetails;
		};

		var showRoomAssigErrorPopup = function() {
			var screenDetails = (earlyCheckinOn && isInEarlyCheckinWindow) ? setUpPopDataOfferEci() : setUpPopDataNoEci();
			var errorOpts = {
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
			$modal.open(errorOpts);
		};

		var finalNavigations = function() {
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

		var assignRoom = function(type) {
			console.log("assignRoom");
			var onFailure = function() {
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
				finalNavigations();
			};
			onFailure();
		};
		$scope.checkinNow = function() {
			//to do for already assigned
			if(is_room_already_assigned && is_room_ready){
				finalNavigations();
			}
			else if(is_room_already_assigned && !is_room_ready){
				if(is_donot_move_room_marked){
					$state.go('roomsNotReady');
				}
				else{
					assignRoom();
				}
			}
			else{
				assignRoom();
			}
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