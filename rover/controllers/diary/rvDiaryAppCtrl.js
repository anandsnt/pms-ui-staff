sntRover.controller('RVDiaryAppCtrl', 
	['$scope', 
	 '$rootScope', 
	 '$state', 
	 '$stateParams', 
	 'rvDiarySrv', 
	 'rvDiaryFilterSrv',
	 'rvDiaryModelSrv',
	 'rvDiaryUtilSrv',
	 'ngDialog',
	function($scope, $rootScope, $state, $stateParams, rvDiarySrv, rvDiaryFilterSrv, rvDiaryModelFactory, rvDiaryUtilSrv, ngDialog) {
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