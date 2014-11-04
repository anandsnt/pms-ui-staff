sntRover.controller('RVDiaryAppCtrl', ['$scope', '$rootScope', '$state', 'rvDiarySrv', 'ngDialog',
	function($scope, $rootScope, $state, rvDiarySrv, ngDialog) {
		BaseCtrl.call(this, $scope);

		$scope.setTitle('Reservations');

		$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
			// Show a loading message until promises are not resolved
			$scope.$emit('showLoader');
		});

		$rootScope.$on('$stateChangeSuccess', function(e, curr, prev) {
			// Hide loading message
			$scope.$emit('hideLoader');
		});

	}]
);