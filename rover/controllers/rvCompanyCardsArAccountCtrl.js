
sntRover.controller('companyCardArAccountCtrl', ['$scope', '$state', '$stateParams',
	function($scope, $state, $stateParams) {
		BaseCtrl.call(this, $scope);
		
		$scope.setScroller('companyCardArAccountCtrl');

		$scope.$on("arAccountTabActive", function() {
			setTimeout(function() {
				refreshScroller();
			}, 500);
		});

		var refreshScroller = function() {
			$scope.refreshScroller('companyCardArAccountCtrl');
		};


		$scope.useMainContact = true;
		$scope.useMainAdrress = true;

	}
]);
