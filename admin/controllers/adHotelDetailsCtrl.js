admin.controller('ADHotelDetailsCtrl', ['$scope', 'ADHotelDetailsSrv', function($scope, ADHotelDetailsSrv){
	$scope.data = ADHotelDetailsSrv.fetch();
	$scope.World = "cntrl World";
	$scope.akhila = "cntrl akhila";
	$scope.foo = {name: "Umur"};


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
		console.log("clickedUserSetup");
	};
	
	$scope.clickedCancel = function(){
		console.log("clickedCancel");
	};

}]);