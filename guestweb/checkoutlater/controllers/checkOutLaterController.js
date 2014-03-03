(function() {
	var checkOutLaterController = function($scope, LateCheckOutChargesService,$rootScope,$location) {

	//if chekout is already done
		
 		if ($rootScope.isCheckedout) 
		 $location.path('/checkOutNowSuccess');

	// if checkout later in unavailable
		else if (!$rootScope.isLateCheckoutAvailable) 
		 $location.path('/checkOutNow');
	

		$scope.showBackButtonImage = true;
		$rootScope.netWorkError = false;
		$rootScope.isFetching = true;


	//watch for any network errors

		$rootScope.$watch('netWorkError',function(){

			if($rootScope.netWorkError)
				$scope.isFetching = false;
		});

    // fetch details

		LateCheckOutChargesService.fetch().then(function(charges) {
			$scope.charges = charges;
			$rootScope.netWorkError = false;
			$scope.isFetching = false;


			if($scope.charges.length > 0)
				$scope.optionsAvailable = true;
			else
				$location.path('/serverError');

		});
		

	};

	var dependencies = [
		'$scope',
		'LateCheckOutChargesService','$rootScope','$location',
		checkOutLaterController
	];

	snt.controller('checkOutLaterController', dependencies);
})();