admin.controller('ADHotelListCtrl',['$scope','$rootScope', '$state','$stateParams', 'ADHotelListSrv',  function($scope, $state,$rootScope, $stateParams, ADHotelListSrv){
	BaseCtrl.call(this, $scope);
	
	var fetchSuccess = function(data){
		$scope.data = data;
		$scope.$emit('hideLoader');
	};
	
	$scope.invokeApi(ADHotelListSrv.fetch, {}, fetchSuccess);
	
	/**
    *   A post method to update ReservationImport for a hotel
    *   @param {String} index value for the hotel list item.
    */
   
	$scope.toggleClicked = function(index){
		var confirmForReservationImport = true;
      	// show confirm if it is going turn on stage
      	if($scope.data.hotels[index].is_res_import_on == 'false'){
          	confirmForReservationImport = confirm("Do NOT switch ON, until hotel mapping and setup is completed!, Do you want to proceed?");
      	}
      	// If pressed OK button proceed toggle action ON.
      	// Toggle OFF action perform without confirm box.
      	if(confirmForReservationImport){
	      	var isResImportOn = $scope.data.hotels[index].is_res_import_on == 'true' ? false : true;
	      	var data = {'hotel_id' :  $scope.data.hotels[index].id,  'is_res_import_on': isResImportOn };
	      	
	      	var postSuccess = function(){
	      		$scope.data.hotels[index].is_res_import_on = ($scope.data.hotels[index].is_res_import_on == 'true') ? 'false' : 'true';
				$scope.$emit('hideLoader');
			};
			$scope.invokeApi(ADHotelListSrv.postReservationImportToggle, data, postSuccess);
		}
	};
		

}]);