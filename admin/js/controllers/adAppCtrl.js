
admin.controller('ADAppCtrl',['$scope', '$rootScope','ADAppSrv', function($scope, $rootScope, ADAppSrv){

	if($rootScope.admin_role == "hotel-admin" ){
		$scope.isAdmin =  true;
	}	
	else{
		$scope.isAdmin =  false;
	}

	ADAppSrv.fetch().then(function(data) {
		$scope.currentIndex = 0;
		$scope.data = data;
		$scope.selectedMenu = $scope.data.menus[0];

	},function(){
		console.log("error controller");
	});	

	
	//function to change the selected menu
	//index is the array position
	$scope.setSelectedMenu = function(index)	{
		if(index < $scope.data.menus.length){
			$scope.selectedMenu = $scope.data.menus[index];
			$scope.currentIndex = index;
		}
	};
 
}]);

    