admin.controller('ADStationaryCtrl',['$scope','ADStationarySrv',function($scope,ADStationarySrv){

	BaseCtrl.call(this, $scope);

	$scope.data = {};
	$scope.data.show_hotel_address = false;

	
	$scope.toggleShowHotelAddress = function(){
		$scope.data.show_hotel_address = !$scope.data.show_hotel_address;
	};


}]);