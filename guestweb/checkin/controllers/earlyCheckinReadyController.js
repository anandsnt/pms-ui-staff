(function() {
	var earlyCheckinReadyController = function($scope, sntGuestWebSrv) {

		var screenIdentifier = "ECI-4"; //this value needs to set in admin(can be anything, but has to be same in both)
		var screenCMSDetails = sntGuestWebSrv.extractScreenDetails(screenIdentifier);
		screenCMSDetails.title = screenCMSDetails.screen_title.length > 0 ? screenCMSDetails.screen_title : "Early Check In.";
		screenCMSDetails.description = screenCMSDetails.item_description.length > 0 ?
			screenCMSDetails.item_description : "Your early check in is ready!.";
		$scope.screenDetails = screenCMSDetails;
	};

	var dependencies = [
		'$scope', 'sntGuestWebSrv',
		earlyCheckinReadyController
	];

	sntGuestWeb.controller('earlyCheckinReadyController', dependencies);
})();