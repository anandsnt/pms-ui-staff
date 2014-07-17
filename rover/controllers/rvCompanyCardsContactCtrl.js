sntRover.controller('companyCardDetailsContactCtrl', ['$scope', 'RVCompanyCardSrv', '$state', '$stateParams',
	function($scope, RVCompanyCardSrv, $state, $stateParams) {
		BaseCtrl.call(this, $scope);
		
		// since CICO-7766 is breaking for desktops
		$scope.setScroller('companyCardDetailsContactCtrl', {
			disableMouse: true
		});

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
