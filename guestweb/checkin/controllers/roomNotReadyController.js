(function() {
	var roomNotReadyController = function($scope, sntGuestWebSrv) {

		var screenIdentifier = "ECI-5"; //this value needs to set in admin(can be anything, but has to be same in both)
		var screenCMSDetails = sntGuestWebSrv.extractScreenDetails(screenIdentifier);
		screenCMSDetails.title = screenCMSDetails.title.length > 0 ? screenCMSDetails.title : "Sorry";
		screenCMSDetails.description = screenCMSDetails.description.length > 0 ?
			screenCMSDetails.description : "Your room is not ready for an Early Check In. Please contact the front desk.";
		$scope.screenDetails = screenCMSDetails;
	};

	var dependencies = [
		'$scope', 'sntGuestWebSrv',
		roomNotReadyController
	];

	sntGuestWeb.controller('roomNotReadyController', dependencies);
})();