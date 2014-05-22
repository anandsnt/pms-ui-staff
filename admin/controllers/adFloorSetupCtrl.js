admin.controller('ADFloorSetupCtrl',['$scope', '$state', 'ADFloorSetupSrv', 'ngTableParams','$filter',  function($scope, $state, ADFloorSetupSrv, ngTableParams, $filter){
	
	$scope.errorMessage = '';
	BaseCtrl.call(this, $scope);
	$scope.floorListData = {};
	

   /*
    * To fetch list of room types
    */
	$scope.listFloorTypes = function(){
		console.log("upto list floors");
		var successCallbackFetch = function(data){
			$scope.$emit('hideLoader');
			$scope.data = data;
			$scope.currentClickedElement = -1;
			console.log($scope.data);
			// REMEMBER - ADDED A hidden class in ng-table angular module js. Search for hidde or pull-right
		    $scope.tableParams = new ngTableParams({
		        page: 1,            // show first page
		        count: $scope.data.length,    // count per page - Need to change when on pagination implemntation
		        sorting: {
		            name: 'asc'     // initial sorting
		        }
		    }, {
		        total: $scope.data.length, // length of data
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
	$scope.editFloor = function(index, id)	{
		$scope.departmentData={};
		$scope.currentClickedElement = index;
	 	var successCallbackRender = function(data){	
	 		$scope.$emit('hideLoader');
	 		$scope.floorListData = data;
	 		if($scope.floorListData.is_pseudo_room_type == "true" || $scope.floorListData.is_pseudo_room_type == true){
	 			$scope.floorListData.is_pseudo_room_type = true;
	 		}
	 		else{
	 			$scope.floorListData.is_pseudo_room_type = false;
	 		}
	 		if($scope.floorListData.is_suite == "true" || $scope.floorListData.is_suite == true){
	 			$scope.floorListData.is_suite = true;
	 		}
	 		else{
	 			$scope.floorListData.is_suite = false;
	 		}
	 	};
	 	var data = {"id":id };
	 	$scope.invokeApi(ADFloorSetupSrv.getRoomTypeDetails, data , successCallbackRender);    
	};
   
   /*
    * To get the template of edit screen
    * @param {int} index of the selected room type
    * @param {string} id of the room type
    */
	$scope.getTemplateUrl = function(index, id){
		if(typeof index === "undefined" || typeof id === "undefined") return "";
		if($scope.currentClickedElement == index){ 
			 	return "/assets/partials/floorSetups/adFloorDetails.html";
		}
	};
  /*
   * To save/update room type details
   */
   $scope.saveFloor = function(){
		
		var unwantedKeys = [];
		console.log($scope.floorListData);
		if($scope.floorListData.image_of_room_type.indexOf("data:")!= -1){
		} else {
			unwantedKeys = ["image_of_room_type"];
		}
		 var data = dclone($scope.floorListData, unwantedKeys);
		 
    	var successCallbackSave = function(data){
    		$scope.$emit('hideLoader');
    		//Since the list is ordered. Update the ordered data
    		$scope.orderedData[parseInt($scope.currentClickedElement)].name = $scope.floorListData.room_type_name;
    		$scope.orderedData[parseInt($scope.currentClickedElement)].code = $scope.floorListData.room_type_code;
    		$scope.currentClickedElement = -1;
    	};
    	$scope.invokeApi(ADFloorSetupSrv.updateRoomTypes, data , successCallbackSave);
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
		$scope.invokeApi(ADFloorSetupSrv.importFromPms, '' , successCallbackImport);
	};
}]);

