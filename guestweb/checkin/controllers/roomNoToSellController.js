(function() {
	var roomNotToSellController = function($scope, sntGuestWebSrv) {

		var screenIdentifier = "ECI-5"; //this value needs to set in admin(can be anything, but has to be same in both)
		var screenCMSDetails = sntGuestWebSrv.extractScreenDetails(screenIdentifier);
		screenCMSDetails.title = screenCMSDetails.screen_title.length > 0 ? screenCMSDetails.screen_title : "Arrival Details";
		screenCMSDetails.description = screenCMSDetails.item_description.length > 0 ?
			screenCMSDetails.item_description : "We don’t have any rooms available for an Early Check In. Select continue to select a new arrival time.";
		$scope.screenDetails = screenCMSDetails;
	};

	var dependencies = [
		'$scope', 'sntGuestWebSrv',
		roomNotToSellController
	];

	sntGuestWeb.controller('roomNotToSellController', dependencies);
})();