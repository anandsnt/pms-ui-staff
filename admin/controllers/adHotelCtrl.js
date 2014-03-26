admin.controller('ADHotelListCtrl',['$scope', '$state','$stateParams', 'ADHotelListSrv',  function($scope, $state, $stateParams, ADHotelListSrv){
	
	ADHotelListSrv.fetch().then(function(data) {
	        $scope.data = data;
	        //$scope.$parent.myScroll['rooms'].refresh();
	}, function(){
		console.log("fetch failed");

	});	
	
	
		
	$scope.HotelCtrl = function(id, editstate){
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