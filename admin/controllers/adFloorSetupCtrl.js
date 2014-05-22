admin.controller('ADFloorSetupCtrl',['$scope', '$state', 'ADFloorSetupSrv', 'ngTableParams','$filter',  function($scope, $state, ADFloorSetupSrv, ngTableParams, $filter){
	
	$scope.errorMessage = '';
	BaseCtrl.call(this, $scope);
	$scope.roomTypeData = {};
	

   /*
    * To fetch list of room types
    */
	$scope.listFloorTypes = function(){
		console.log("upto list room type");
		var successCallbackFetch = function(data){
			$scope.$emit('hideLoader');
			$scope.data = data;
			$scope.currentClickedElement = -1;
			console.log($scope.data);
			// REMEMBER - ADDED A hidden class in ng-table angular module js. Search for hidde or pull-right
		    $scope.tableParams = new ngTableParams({
		        page: 1,            // show first page
		        count: $scope.data.room_types.length,    // count per page - Need to change when on pagination implemntation
		        sorting: {
		            name: 'asc'     // initial sorting
		        }
		    }, {
		        total: $scope.data.room_types.length, // length of data
		        getData: function($defer, params) {
		            // use build-in angular filter
		            var orderedData = params.sorting() ?
		                                $filter('orderBy')($scope.data.room_types, params.orderBy()) :
		                                $scope.data.room_types;
		                              
		            $scope.orderedData =  orderedData;
		            // console.log($scope.orderedData);
		                       
		            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
		        }
		    });
		};
		$scope.invokeApi(ADFloorSetupSrv.fetch, {} , successCallbackFetch);	
	};
	//To list room types
	$scope.listFloorTypes(); 
   /*
    * To render edit room types screen
    * @param {index} index of selected room type
    * @param {id} id of the room type
    */	
	$scope.editFloorypes = function(index, id)	{
		$scope.departmentData={};
		$scope.currentClickedElement = index;
	 	var successCallbackRender = function(data){	
	 		$scope.$emit('hideLoader');
	 		$scope.roomTypeData = data;
	 		if($scope.roomTypeData.is_pseudo_room_type == "true" || $scope.roomTypeData.is_pseudo_room_type == true){
	 			$scope.roomTypeData.is_pseudo_room_type = true;
	 		}
	 		else{
	 			$scope.roomTypeData.is_pseudo_room_type = false;
	 		}
	 		if($scope.roomTypeData.is_suite == "true" || $scope.roomTypeData.is_suite == true){
	 			$scope.roomTypeData.is_suite = true;
	 		}
	 		else{
	 			$scope.roomTypeData.is_suite = false;
	 		}
	 	};
	 	var data = {"id":id };
	 	$scope.invokeApi(ADRoomTypesSrv.getRoomTypeDetails, data , successCallbackRender);    
	};
   
   /*
    * To get the template of edit screen
    * @param {int} index of the selected room type
    * @param {string} id of the room type
    */
	$scope.getTemplateUrl = function(index, id){
		if(typeof index === "undefined" || typeof id === "undefined") return "";
		if($scope.currentClickedElement == index){ 
			 	return "/assets/partials/roomTypes/adRoomTypesDetails.html";
		}
	};
  /*
   * To save/update room type details
   */
   $scope.saveRoomTypes = function(){
		
		var unwantedKeys = [];
		console.log($scope.roomTypeData);
		if($scope.roomTypeData.image_of_room_type.indexOf("data:")!= -1){
		} else {
			unwantedKeys = ["image_of_room_type"];
		}
		 var data = dclone($scope.roomTypeData, unwantedKeys);
		 
    	var successCallbackSave = function(data){
    		$scope.$emit('hideLoader');
    		//Since the list is ordered. Update the ordered data
    		$scope.orderedData[parseInt($scope.currentClickedElement)].name = $scope.roomTypeData.room_type_name;
    		$scope.orderedData[parseInt($scope.currentClickedElement)].code = $scope.roomTypeData.room_type_code;
    		$scope.currentClickedElement = -1;
    	};
    	$scope.invokeApi(ADRoomTypesSrv.updateRoomTypes, data , successCallbackSave);
    };
   /*
    * To handle click event
    */	
	$scope.clickCancel = function(){
		$scope.currentClickedElement = -1;
	};	
   /*
    * To delete department
    * @param {int} index of the selected department
    * @param {string} id of the selected department
    */		
	$scope.importFromPms = function(){
		var successCallbackImport = function(data){	
	 		$scope.$emit('hideLoader');
	 		$scope.listRoomTypes();
	 		// $scope.data.departments.splice(index, 1);
	 	};
		$scope.invokeApi(ADRoomTypesSrv.importFromPms, '' , successCallbackImport);
	};
}]);

