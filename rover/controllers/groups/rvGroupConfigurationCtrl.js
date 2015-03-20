sntRover.controller('rvGroupConfigurationCtrl', ['$scope', '$rootScope', 'rvGroupSrv', '$filter', '$stateParams',
	function($scope, $rootScope, rvGroupSrv, $filter, $stateParams) {
		BaseCtrl.call(this, $scope);


		var title = $stateParams.id === "NEW_GROUP" ? $filter('translate')('NEW_GROUP') :$filter('translate')('GROUPS');
		$scope.setHeadingTitle(title);

		$scope.groupConfigState = {
			activeTab: $stateParams.activeTab // Possible values are SUMMARY, ROOM_BLOCK, ROOMING, ACCOUNT, TRANSACTIONS, ACTIVITY
		}

	}
]);