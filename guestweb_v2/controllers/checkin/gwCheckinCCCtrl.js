/**
 *	CC addition
 */
sntGuestWeb.controller('GwCheckinCCAdditionController', ['$scope', '$state', '$controller',
	function($scope, $state, $controller) {
		$controller('gwBaseCCCollectionController', {
			$scope: $scope
		});

		$scope.$on('NAVIGATE_TO_NEXT_PAGE', function() {
			$state.go('autoCheckinFinal');
		});
	}
]);