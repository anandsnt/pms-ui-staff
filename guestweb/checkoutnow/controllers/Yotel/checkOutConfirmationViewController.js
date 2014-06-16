
(function() {
	var checkOutConfirmationController = function($scope,$rootScope,$location) {

		if($rootScope.isCheckedout)	{
			$state.go('checkOutNow.checkOutStatus');
			$scope.pageSuccess = false;	
		}
		else{
			$scope.pageSuccess = true;
		};			

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