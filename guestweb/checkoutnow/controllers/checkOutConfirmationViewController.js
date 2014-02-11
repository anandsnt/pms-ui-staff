
(function() {
	var checkOutConfirmationController = function($scope, confirmationService) {
	

		confirmationService.fetch().then(function(details) {
			$scope.details = details;
		
		});

	};

	var dependencies = [
		'$scope',
		'confirmationService',
		checkOutConfirmationController
	];

	snt.controller('checkOutConfirmationController', dependencies);
})();