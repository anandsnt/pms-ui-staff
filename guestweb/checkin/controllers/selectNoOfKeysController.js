(function() {
	var selectNoOfkeysController = function($scope, sntGuestWebSrv) {

		var screenCMSDetails ={};
		screenCMSDetails.title ="No of keys?";
		screenCMSDetails.description = "how much keys you want?.";
		screenCMSDetails.errorMessage = "Something went wrong";
		$scope.screenDetails = screenCMSDetails;

		var maxKeys = 5;

		$scope.noOfKeys = 1;
		$scope.keysArray = [];

		for(i=1;i<=5;i++){
			$scope.keysArray.push(i);
		};

	};

	var dependencies = [
		'$scope', 'sntGuestWebSrv',
		selectNoOfkeysController
	];

	sntGuestWeb.controller('selectNoOfkeysController', dependencies);
})();