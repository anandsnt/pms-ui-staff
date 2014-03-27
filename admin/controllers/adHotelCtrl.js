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
	
	$scope.toggleClicked = function(index){
		
		// checkedStatus will be true, if it checked
      	// show confirm if it is going turn on stage
      	if(is_res_import_on == 'false'){
          	var confirmForReservationImport = confirm("Do NOT switch ON, until hotel mapping and setup is completed!, Do you want to proceed?");
      	}	
      	var is_res_import_on = $scope.data.hotels[index].is_res_import_on == 'true' ? false : true;
      	var data = {'hotel_id' :  $scope.data.hotels[index].id,  'is_res_import_on': is_res_import_on };
      	
      	var fetchSuccess = function(){
      		$scope.data.hotels[index].is_res_import_on = ($scope.data.hotels[index].is_res_import_on == 'true') ? 'false' : 'true';
		};
		
		var fetchFailed = function(){
			console.log("fetchFailed");
		};
		
		ADHotelListSrv.postReservationImportToggle(data).then(fetchSuccess, fetchFailed);
	};
		

}]);