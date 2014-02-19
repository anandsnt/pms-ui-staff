(function() {
	var checkOutLaterController = function($scope, LateCheckOutChargesService,$rootScope,$location) {

		if ($rootScope.isLateCheckoutAvailable === 'false') 
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