(function() {
	var roomsroomsNotReadyController = function($scope, sntGuestWebSrv) {

		var screenIdentifier = "ECI-5"; //this value needs to set in admin(can be anything, but has to be same in both)
		var screenCMSDetails = sntGuestWebSrv.extractScreenDetails(screenIdentifier);
		screenCMSDetails.title = screenCMSDetails.title.length > 0 ? screenCMSDetails.title : "Sorry";
		screenCMSDetails.description = screenCMSDetails.description.length > 0 ?
			screenCMSDetails.description : "Your room is not ready.";
		$scope.screenDetails = screenCMSDetails;
	};

	var dependencies = [
		'$scope', 'sntGuestWebSrv',
		roomsroomsNotReadyController
	];

	sntGuestWeb.controller('roomsroomsNotReadyController', dependencies);
})();