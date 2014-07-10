sntRover.controller('companyCardDetailsContactCtrl', ['$scope', 'RVCompanyCardSrv', '$state', '$stateParams',
	function($scope, RVCompanyCardSrv, $state, $stateParams) {
		BaseCtrl.call(this, $scope);
		$scope.setScroller('companyCardDetailsContactCtrl');

		$scope.$on("contactTabActive", function() {
			setTimeout(function() {
				refreshScroller();
			}, 500);
		});

		var refreshScroller = function() {
			$scope.refreshScroller('companyCardDetailsContactCtrl');
		};

	}
]);
