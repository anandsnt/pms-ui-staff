
(function() {
	var checkOutConfirmationController = function($scope, confirmationService,$rootScope,$location) {
		

		//if checkout is already done

 		if ($rootScope.isCheckedout) 
		$location.path('/checkOutNowSuccess')


		$rootScope.netWorkError = false;

		// fecth text details to display
		
		$scope.isFetching = true;
		confirmationService.fetch().then(function(details) {
			$scope.details = details;
			$scope.isFetching = false;
			$rootScope.netWorkError =false;
			
		});

		$rootScope.$watch('netWorkError',function(){

			if($rootScope.netWorkError)
				$scope.isFetching = false;
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