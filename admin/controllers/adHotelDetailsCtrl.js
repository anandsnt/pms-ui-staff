admin.controller('ADHotelDetailsCtrl', ['$scope', 'ADHotelDetailsSrv',   function($scope, ADHotelDetailsSrv){

	
	$scope.data = ADHotelDetailsSrv.fetch();	
	$scope.callSave = function(){
		console.log("callSave");
		console.log($scope.data.hotel_name);
	}

}]);