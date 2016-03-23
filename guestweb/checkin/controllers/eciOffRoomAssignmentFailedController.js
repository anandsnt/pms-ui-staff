(function() {
	var eciOffRoomAssignmentFailedController = function($scope, sntGuestWebSrv) {

		var screenIdentifier = "ECI-1"; //this value needs to set in admin(can be anything, but has to be same in both)
		var screenCMSDetails = sntGuestWebSrv.extractScreenDetails(screenIdentifier);
		screenCMSDetails.title = screenCMSDetails.screen_title.length > 0 ? screenCMSDetails.screen_title : "Apologies";
		screenCMSDetails.description = screenCMSDetails.item_description.length > 0 ?
			screenCMSDetails.item_description : "We don’t have any rooms available at this moment. Please speak to a staff member of the front desk or select Continue to set an arrival time.";
		$scope.screenDetails = screenCMSDetails;
	};

	var dependencies = [
		'$scope', 'sntGuestWebSrv',
		eciOffRoomAssignmentFailedController
	];

	sntGuestWeb.controller('eciOffRoomAssignmentFailedController', dependencies);
})();