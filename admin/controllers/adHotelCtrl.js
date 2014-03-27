admin.controller('ADHotelListCtrl',['$scope','$rootScope', '$state','$stateParams', 'ADHotelListSrv',  function($scope, $state,$rootScope, $stateParams, ADHotelListSrv){
	
	ADHotelListSrv.fetch().then(function(data) {
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
	
	$scope.toggleClicked = function(index, hotelId, is_res_import_on){
		
		// checkedStatus will be true, if it checked
      	// show confirm if it is going turn on stage
      	if(is_res_import_on == 'false'){
          	var confirmForReservationImport = confirm("Do NOT switch ON, until hotel mapping and setup is completed!, Do you want to proceed?");
      	}	
      	var data = {'hotel_id' :  hotelId,  'is_res_import_on': is_res_import_on};
      	
      	var fetchSuccess = function(){
			if(is_res_import_on == "true"){
				$scope.data.hotels[index].is_res_import_on = 'false';
			}
			else{
				$scope.data.hotels[index].is_res_import_on = 'true';
			}
		};
		
		var fetchFailed = function(){
			console.log("fetchFailed");
		};
		
		ADHotelListSrv.postReservationImportToggle(data).then(fetchSuccess, fetchFailed);
	};
		

}]);