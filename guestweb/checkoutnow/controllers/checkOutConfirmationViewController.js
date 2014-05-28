
(function() {
	var checkOutConfirmationController = function($scope,$rootScope,$location) {

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
			$scope.checkoutTimessage = $rootScope.checkoutTimessage ? $rootScope.checkoutTimessage:"Check out time is ";
			$scope.footerMessage1 = !$rootScope.isLateCheckoutAvailable ? 'Late check out is not available.' :'' ;
		}
	};

	var dependencies = [
	'$scope','$rootScope','$location',
	checkOutConfirmationController
	];

	snt.controller('checkOutConfirmationController', dependencies);
})();