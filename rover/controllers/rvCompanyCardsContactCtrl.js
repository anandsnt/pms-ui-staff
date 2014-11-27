sntRover.controller('companyCardDetailsContactCtrl', ['$scope', 'RVCompanyCardSrv', '$state', '$stateParams',
	function($scope, RVCompanyCardSrv, $state, $stateParams) {
		BaseCtrl.call(this, $scope);

		$scope.setScroller('companyCardDetailsContactCtrl');

		$scope.$on("contactTabActive", function() {
			refreshScroller();
		});

		$scope.routesCount = 5;

		$scope.$on("setCardContactErrorMessage", function($event, errorMessage) {
			$scope.errorMessage = errorMessage;
		});

		$scope.$on("clearCardContactErrorMessage", function() {
			$scope.errorMessage = "";
		});

		var refreshScroller = function() {
			$scope.refreshScroller('companyCardDetailsContactCtrl');
		};

	}
]);