
(function() {
	var checkOutConfirmationController = function($scope, confirmationService,$rootScope,$location) {
		

		
		

		if($rootScope.isCheckedin){
			$scope.pageSuccess = false;
			$location.path('/checkinSuccess');
		}
		else if($rootScope.isCheckin){
			$scope.pageSuccess = false;
			$location.path('/checkinConfirmation');
		}
		else if($rootScope.isCheckedout){
			$scope.pageSuccess = false;
			$location.path('/checkOutNowSuccess');

		}
		else
			$scope.pageSuccess = true;


		if($scope.pageSuccess){


		$rootScope.netWorkError = false;

		// fecth text details to display
		
		$scope.isFetching = true;
		confirmationService.fetch().then(function(details) {
			$scope.details = details;
			$scope.isFetching = false;
			$rootScope.netWorkError =false;
			
		});

		//watch for any network errors

		$rootScope.$watch('netWorkError',function(){

			if($rootScope.netWorkError)
				$scope.isFetching = false;
		});

		$scope.footerMessage1 = !$rootScope.isLateCheckoutAvailable ? 'Late check-out is not available.' :'' ;

	    }
	};

	var dependencies = [
	'$scope',
	'confirmationService','$rootScope','$location',
	checkOutConfirmationController
	];

	snt.controller('checkOutConfirmationController', dependencies);
})();