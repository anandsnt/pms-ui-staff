
(function() {
	var checkOutConfirmationController = function($scope, confirmationService,$rootScope) {
		
		// fecth text details to display
		
		confirmationService.fetch().then(function(details) {
			$scope.details = details;
			
		});
		
		$scope.footerMessage1 = $rootScope.isLateCheckoutAvailable ? 'Late check-out is not available.' :'' 

	};

	var dependencies = [
	'$scope',
	'confirmationService','$rootScope',
	checkOutConfirmationController
	];

	snt.controller('checkOutConfirmationController', dependencies);
})();