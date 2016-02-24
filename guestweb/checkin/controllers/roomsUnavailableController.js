(function() {
	var roomsUnavailableController = function($scope, sntGuestWebSrv) {

		var screenIdentifier = "32435"; //this value needs to set in admin(can be anything, but has to be same in both)
		var screenCMSDetails = sntGuestWebSrv.extractScreenDetails(screenIdentifier);
		screenCMSDetails.title = screenCMSDetails.title.length > 0 ? screenCMSDetails.title : "Early Check In.";
		screenCMSDetails.description = screenCMSDetails.description.length > 0 ?
			screenCMSDetails.description : "Something went room while assigning room. Please click continue to checkin later.";
		$scope.screenDetails = screenCMSDetails;
	};

	var dependencies = [
		'$scope', 'sntGuestWebSrv',
		roomsUnavailableController
	];

	sntGuestWeb.controller('roomsUnavailableController', dependencies);
})();