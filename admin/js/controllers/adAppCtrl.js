admin.controller('ADAppCtrl',['$scope', 'ADAppSrv', function($scope, ADAppSrv){

	ADAppSrv.fetch().then(function(data) {
		console.log("final success");
		//success
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
		}
	};

	
}]);

    