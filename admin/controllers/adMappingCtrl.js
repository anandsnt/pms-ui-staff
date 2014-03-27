admin.controller('ADMappingCtrl', ['$scope', '$state', '$stateParams', 'ADMappingSrv',
function($scope, $state, $stateParams, ADMappingSrv) {
	
	console.log("$stateParams.hotel_id")
	console.log($stateParams.hotel_id);
	
	
	
	ADMappingSrv.fetch(hotel_id).then(function(data) {
	        $scope.data = data;
	        //$scope.$parent.myScroll['rooms'].refresh();
	}, function(){
		console.log("fetch failed");

	});	
	
	
		
	$scope.HotelCtrl = function(id, editstate){
		
		$scope.hotelId = id;
		console.log("$scope.hotelId")
		console.log($scope.hotelId )
	 	 // $state.go(editstate);
	 	 ADHotelListSrv.getHotelDetails(id).then(function(data) {
		        $scope.data = data;
		        console.log( $scope.data )
		        //$scope.$parent.myScroll['rooms'].refresh();
		}, function(){
			console.log("fetch failed");
	
		});	
	};
	
	

}]);
