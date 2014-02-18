
(function() {
	var checkOutStatusController = function($scope, baseWebService) {
//to be deleted
	$scope.finalMessage = "Thank You for staying with us!"

	// baseWebService.post().then(function() {
	// 		$scope.finalMessage = "Thank You for staying with us!"
	// 	});
	// };
};
	var dependencies = [
		'$scope',
		'baseWebService',
		checkOutStatusController
	];

	snt.controller('checkOutStatusController', dependencies);
})();