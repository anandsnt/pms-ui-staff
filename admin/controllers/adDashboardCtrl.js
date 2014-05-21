admin.controller('ADDashboardCtrl',['$scope', '$state', '$stateParams', function($scope, $state, $stateParams){
	
	$scope.$emit("changedSelectedMenu", $stateParams.menu);
	if(typeof $scope.data !== 'undefined'){
		$scope.selectedMenu = $scope.data.menus[$stateParams.menu];		
	}
	if($scope.selectedMenu.menu_name == "Rooms" && $scope.selectedMenu.components[$scope.selectedMenu.components.length - 1].name != "Floor setup"){
		var array = $scope.selectedMenu.components;
		var submenu = {};
		submenu.name = "Floor setup";
		submenu.icon_class = array[array.length - 1].icon_class;
		submenu.is_bookmarked = array[array.length - 1].is_bookmarked;
		submenu.state = array[array.length - 1].state;
		submenu.action_path = array[array.length - 1].action_path;
		$scope.selectedMenu.components.push(submenu);
		}
}]);

    
