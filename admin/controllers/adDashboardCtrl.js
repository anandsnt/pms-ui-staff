admin.controller('ADDashboardCtrl',['$scope', '$state', '$stateParams', function($scope, $state, $stateParams){

	$scope.$emit("changedSelectedMenu", $stateParams.menu);
	if(typeof $scope.data !== 'undefined'){
		$scope.selectedMenu = $scope.data.menus[$stateParams.menu];
	}
}]);


