
(function() {
	var checkOutConfirmationController = function($scope,$rootScope,$state) {
		
		$scope.pageValid = true;
		//TO DO: Navigations		

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