
(function() {
	var checkOutConfirmationController = function($scope, confirmationService,$rootScope,$location) {
		

		//if checkout is already done

 		if ($rootScope.isCheckedout) 
		$location.path('/checkOutNowSuccess')

		// fecth text details to display
		
		confirmationService.fetch().then(function(details) {
			$scope.details = details;
			
		});

		$scope.footerMessage1 = !$rootScope.isLateCheckoutAvailable ? 'Late check-out is not available.' :'' 

	};

	var dependencies = [
	'$scope',
	'confirmationService','$rootScope','$location',
	checkOutConfirmationController
	];

	snt.controller('checkOutConfirmationController', dependencies);
})();