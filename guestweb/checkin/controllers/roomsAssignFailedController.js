(function() {
	var roomAssignFailedController = function($scope, sntGuestWebSrv) {

		var screenIdentifier = "ECI-5"; //this value needs to set in admin(can be anything, but has to be same in both)
		var screenCMSDetails = sntGuestWebSrv.extractScreenDetails(screenIdentifier);
		screenCMSDetails.title = screenCMSDetails.title.length > 0 ? screenCMSDetails.title : "Early Check In";
		screenCMSDetails.description = screenCMSDetails.description.length > 0 ?
			screenCMSDetails.description : "Sorry, we don't have any rooms available for an Early Check In. Please contact the Front Desk";
		$scope.screenDetails = screenCMSDetails;
	};

	var dependencies = [
		'$scope', 'sntGuestWebSrv',
		roomAssignFailedController
	];

	sntGuestWeb.controller('roomAssignFailedController', dependencies);
})();