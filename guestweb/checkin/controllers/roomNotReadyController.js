(function() {
	var roomNotReadyController = function($scope, sntGuestWebSrv) {

		var screenIdentifier = "ECI-3"; //this value needs to set in admin(can be anything, but has to be same in both)
		var screenCMSDetails = sntGuestWebSrv.extractScreenDetails(screenIdentifier);
		screenCMSDetails.title = screenCMSDetails.screen_title.length > 0 ? screenCMSDetails.screen_title : "Early Check In";
		screenCMSDetails.description = screenCMSDetails.item_description.length > 0 ?
			screenCMSDetails.item_description : "Your room is not ready for an Early Check In. Please contact the front desk.";
		$scope.screenDetails = screenCMSDetails;
	};

	var dependencies = [
		'$scope', 'sntGuestWebSrv',
		roomNotReadyController
	];

	sntGuestWeb.controller('roomNotReadyController', dependencies);
})();