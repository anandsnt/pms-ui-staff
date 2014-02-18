
(function() {
	var checkOutConfirmationController = function($scope, confirmationService,$window) {
		
		confirmationService.fetch().then(function(details) {
			$scope.details = details;
		
		});
		

	};

	var dependencies = [
		'$scope',
		'confirmationService','$window',
		checkOutConfirmationController
	];

	snt.controller('checkOutConfirmationController', dependencies);
})();