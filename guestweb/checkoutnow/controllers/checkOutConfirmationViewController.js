
(function() {
	var checkOutConfirmationController = function($scope, confirmationService,$rootScope,$location) {
		

		//if checkout is already done

 		if ($rootScope.isCheckedout) 
		$location.path('/checkOutNowSuccess')


		$rootScope.netWorkError = false;

		// fecth text details to display
		
		$scope.isPosting = true;
		confirmationService.fetch().then(function(details) {
			$scope.details = details;
			$scope.isPosting = false;
			$rootScope.netWorkError =false;
			
		});

		$rootScope.$watch('netWorkError',function(){

			if($rootScope.netWorkError)
				$scope.isPosting = false;
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