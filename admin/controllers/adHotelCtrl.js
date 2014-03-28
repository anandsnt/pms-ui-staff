admin.controller('ADHotelListCtrl',['$scope','$rootScope', '$state','$stateParams', 'ADHotelListSrv',  function($scope, $state,$rootScope, $stateParams, ADHotelListSrv){
	BaseCtrl.call(this, $scope);
	
	var fetchSuccess = function(data){
		$scope.data = data;
		$scope.$emit('hideLoader');
	};
	
	var fetchFailed = function(){
		console.log("fetchFailed");
		$scope.$emit('hideLoader');
	};
	
	$scope.invokeApi(ADHotelListSrv.fetch, {}, fetchSuccess, fetchFailed);
	
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
		};
		
		var postFailed = function(){
			console.log("fetchFailed");
		};
		
		$scope.invokeApi(ADHotelListSrv.postReservationImportToggle, data, postSuccess, postFailed);
	};
		

}]);