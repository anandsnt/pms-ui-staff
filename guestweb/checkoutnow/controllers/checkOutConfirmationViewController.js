
(function() {
	var checkOutConfirmationController = function($scope,$rootScope,$state) {

		if($rootScope.isCheckedout)	{
			$state.go('checkOutStatus');
			$scope.pageValid = false;	
		}
		else{
			$scope.pageValid = true;
		};			

		if($scope.pageValid){
			$scope.checkoutTimessage = $rootScope.checkoutTimessage ? $rootScope.checkoutTimessage:"Check out time is ";
			$scope.footerMessage1 = !$rootScope.isLateCheckoutAvailable ? 'Late check out is not available.' :'' ;
		}
	};

	var dependencies = [
	'$scope','$rootScope','$state',
	checkOutConfirmationController
	];

	snt.controller('checkOutConfirmationController', dependencies);
})();