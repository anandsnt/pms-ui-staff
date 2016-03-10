(function() {
	var eciOffRoomNotReadyController = function($scope, sntGuestWebSrv) {

		var screenIdentifier = "ECI-6"; //this value needs to set in admin(can be anything, but has to be same in both)
		var screenCMSDetails = sntGuestWebSrv.extractScreenDetails(screenIdentifier);
		screenCMSDetails.title = screenCMSDetails.screen_title.length > 0 ? screenCMSDetails.screen_title : "Apologies";
		screenCMSDetails.description = screenCMSDetails.item_description.length > 0 ?
			screenCMSDetails.item_description : "Your room is not ready. Please contact the Front Desk.";
		$scope.screenDetails = screenCMSDetails;
	};

	var dependencies = [
		'$scope', 'sntGuestWebSrv',
		eciOffRoomNotReadyController
	];

	sntGuestWeb.controller('eciOffRoomNotReadyController', dependencies);
})();