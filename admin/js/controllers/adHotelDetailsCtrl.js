admin.controller('ADHotelDetailsCtrl', ['$scope', 'ADHotelDetailsSrv', function($scope, ADHotelDetailsSrv){
	$scope.data = ADHotelDetailsSrv.fetch();
	$scope.World = "cntrl World";
	$scope.akhila = "cntrl akhila";
	$scope.foo = {name: "Umur"};

	$scope.callSave = function(){
		console.log("callSave");
		console.log($scope.data.hotel_name);
	}

}]);