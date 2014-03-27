admin.controller('ADHotelDetailsCtrl', ['$state', '$rootScope', '$scope', 'ADHotelDetailsSrv', function($state, $rootScope, $scope, ADHotelDetailsSrv){
	$scope.data = ADHotelDetailsSrv.fetch();
	$scope.isAdminSnt = false;
	
	$scope.World = "cntrl World";
	$scope.akhila = "cntrl akhila";
	$scope.foo = {name: "Umur"};

	console.log($rootScope.adminRole);
	
	if($rootScope.adminRole == "snt-admin"){
		$scope.isAdminSnt = true;
	}

	$scope.clickedTestMliConnectivity = function(){
		console.log("clickedTestMliConnectivity");
	};
	
	$scope.clickedSave = function(){
		console.log("clickedSave");
	};
	
	$scope.clickedExternalMapping = function(){
		console.log("clickedExternalMapping");
	};
	
	$scope.clickedUserSetup = function(){
		$state.go("admin.users");
	};
	
	$scope.clickedCancel = function(){
		console.log("clickedCancel");
	};

}]);