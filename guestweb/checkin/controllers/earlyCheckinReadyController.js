(function() {
	var earlyCheckinReadyController = function($scope, sntGuestWebSrv) {

		var screenIdentifier = "32436"; //this value needs to set in admin(can be anything, but has to be same in both)
		var screenCMSDetails = sntGuestWebSrv.extractScreenDetails(screenIdentifier);
		screenCMSDetails.title = screenCMSDetails.title.length > 0 ? screenCMSDetails.title : "Early Check In.";
		screenCMSDetails.description = screenCMSDetails.description.length > 0 ?
			screenCMSDetails.description : "Your early check in is ready!.";
		$scope.screenDetails = screenCMSDetails;
	};

	var dependencies = [
		'$scope', 'sntGuestWebSrv',
		earlyCheckinReadyController
	];

	sntGuestWeb.controller('earlyCheckinReadyController', dependencies);
})();