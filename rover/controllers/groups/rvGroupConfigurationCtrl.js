sntRover.controller('rvGroupConfigurationCtrl', ['$scope', '$rootScope', 'rvGroupSrv', '$filter',
	function($scope, $rootScope, rvGroupSrv, $filter) {
		BaseCtrl.call(this, $scope);


		var title = $filter('translate')('GROUPS');
		$scope.setHeadingTitle(title);

	}
]);