(function() {
	var unableToChecknCtrl = function($scope, $stateParams) {
		$scope.reasonForFailure = $stateParams.reason ? $stateParams.reason : '';
	};

	var dependencies = [
		'$scope', '$stateParams',
		unableToChecknCtrl
	];

	sntGuestWeb.controller('unableToChecknCtrl', dependencies);
})();