(function() {
	var checkOutLaterController = function($scope, LateCheckOutChargesService,$rootScope,$location) {

		//if chekout is already done
		
 		if ($rootScope.isCheckedout) 
		$location.path('/checkOutNowSuccess')

	// if checkout later in unavailable
		else if (!$rootScope.isLateCheckoutAvailable) 
		 $location.path('/checkOutNow')
	

		$scope.showBackButtonImage = true
		LateCheckOutChargesService.fetch().then(function(charges) {
			$scope.charges = charges;
			console.log(charges)
		});
	};

	var dependencies = [
		'$scope',
		'LateCheckOutChargesService','$rootScope','$location',
		checkOutLaterController
	];

	snt.controller('checkOutLaterController', dependencies);
})();