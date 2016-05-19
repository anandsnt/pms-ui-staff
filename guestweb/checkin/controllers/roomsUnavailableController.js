(function() {
	var roomsUnavailableController = function($scope, sntGuestWebSrv) {

		var screenIdentifier = "ECI-1"; //this value needs to set in admin(can be anything, but has to be same in both)
		var screenCMSDetails = sntGuestWebSrv.extractScreenDetails(screenIdentifier);
		screenCMSDetails.title = screenCMSDetails.screen_title.length > 0 ? screenCMSDetails.screen_title : "Early Check In";
		screenCMSDetails.description = screenCMSDetails.item_description.length > 0 ?
			screenCMSDetails.item_description : "Something went room while assigning room. Please click continue to checkin later.";
		$scope.screenDetails = screenCMSDetails;
	};

	var dependencies = [
		'$scope', 'sntGuestWebSrv',
		roomsUnavailableController
	];

	sntGuestWeb.controller('roomsUnavailableController', dependencies);
})();