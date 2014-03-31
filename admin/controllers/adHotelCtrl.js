admin.controller('ADHotelListCtrl',['$scope','$rootScope', '$state','$stateParams', 'ADHotelListSrv',  function($scope, $state,$rootScope, $stateParams, ADHotelListSrv){
	BaseCtrl.call(this, $scope);
	$scope.errorMessage = '';
	
	var fetchSuccess = function(data){
		$scope.data = data;
		$scope.$emit('hideLoader');
	};
	
	var fetchFailed = function(errorMessage){
		$scope.$emit('hideLoader');
		$scope.errorMessage = errorMessage ;
	};
	
	$scope.invokeApi(ADHotelListSrv.fetch, {}, fetchSuccess, fetchFailed);
	
	/**
    *   A post method to update ReservationImport for a hotel
    *   @param {String} index value for the hotel list item.
    */
   
	$scope.toggleClicked = function(index){
		
		// checkedStatus will be true, if it checked
      	// show confirm if it is going turn on stage
      	if(is_res_import_on == 'false'){
          	var confirmForReservationImport = confirm("Do NOT switch ON, until hotel mapping and setup is completed!, Do you want to proceed?");
      	}	
      	var is_res_import_on = $scope.data.hotels[index].is_res_import_on == 'true' ? false : true;
      	var data = {'hotel_id' :  $scope.data.hotels[index].id,  'is_res_import_on': is_res_import_on };
      	
      	var postSuccess = function(){
      		$scope.data.hotels[index].is_res_import_on = ($scope.data.hotels[index].is_res_import_on == 'true') ? 'false' : 'true';
			$scope.$emit('hideLoader');
		};
		
		var postFailed = function(errorMessage){
			$scope.$emit('hideLoader');
			$scope.errorMessage = errorMessage ;
		};
		
		$scope.invokeApi(ADHotelListSrv.postReservationImportToggle, data, postSuccess, postFailed);
	};
		

}]);