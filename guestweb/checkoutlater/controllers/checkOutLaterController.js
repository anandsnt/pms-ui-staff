(function() {
	var checkOutLaterController = function($scope, LateCheckOutChargesService) {
		LateCheckOutChargesService.fetch().then(function(charges) {
			$scope.charges = charges;
		});
	};

	var dependencies = [
		'$scope',
		'LateCheckOutChargesService',
		checkOutLaterController
	];

	snt.controller('checkOutLaterController', dependencies);
})();