/**
 *	CC addition
 */
sntGuestWeb.controller('GwCheckoutCCAdditionController', ['$scope', '$state', '$controller', '$stateParams',
	function($scope, $state, $controller, $stateParams) {
		$controller('gwBaseCCCollectionController', {
			$scope: $scope
		});

		$scope.$on('NAVIGATE_TO_NEXT_PAGE', function() {
			if ($stateParams.isFrom === "CHECK_OUT_NOW") {
				$state.go('checkOutFinal');
			} else {
				$state.go('checkOutLaterFinal', {
					time: $stateParams.time,
					ap: $stateParams.ap,
					amount: $stateParams.amount
				});
			}
		});
	}
]);