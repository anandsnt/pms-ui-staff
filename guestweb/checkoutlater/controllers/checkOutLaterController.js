(function() {
	var checkOutLaterController = function($scope, LateCheckOutChargesService) {
		$scope.showBackButtonImage = true
		LateCheckOutChargesService.fetch().then(function(charges) {
			$scope.charges = charges;
			console.log(charges)
		});
	};

	var dependencies = [
		'$scope',
		'LateCheckOutChargesService',
		checkOutLaterController
	];

	snt.controller('checkOutLaterController', dependencies);
})();