(function() {
	var checkOutLaterSuccessController = function($scope, $routeParams, $location, LateCheckOutChargesService) {
		var charges = LateCheckOutChargesService.charges;
		var id = $routeParams.id;

		console.log(id)

		// if no charges recorded (user tried to reload on success page)
		// get him back to checkout later page
		if (!charges.length) {
			$location.path('/checkOutLater');
			return;
		};

		$scope.lateCheckOut = _.find(charges, function(charge) {
			if (id === charge.id) {
				return charge;
			};
		});
	};

	var dependencies = [
		'$scope',
		'$routeParams',
		'$location',
		'LateCheckOutChargesService',
		checkOutLaterSuccessController
	];

	snt.controller('checkOutLaterSuccessController', dependencies);
})();