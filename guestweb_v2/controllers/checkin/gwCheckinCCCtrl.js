/**
 *	CC addition
 */
sntGuestWeb.controller('GwCheckinCCAdditionController', ['$scope', '$state', '$controller', '$stateParams',
	function($scope, $state, $controller, $stateParams) {
		$controller('gwBaseCCCollectionController', {
			$scope: $scope
		});

		$scope.$on('NAVIGATE_TO_NEXT_PAGE', function() {
			$state.go('autoCheckinFinal');
		});
	}
]);