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
		        count: $scope.data.floors.length,    // count per page - Need to change when on pagination implemntation
		        sorting: {
		            description: 'asc'     // initial sorting
		        }
		    }, {
		        total: $scope.data.floors.length, // length of data
		        getData: function($defer, params) {
		            // use build-in angular filter
		            var orderedData = params.sorting() ?
		                                $filter('orderBy')($scope.data.floors, params.orderBy()) :
		                                $scope.data.floors;
		                              
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
	 	$scope.floorListData = $scope.orderedData[index]; 
	};
   
   /*
    * To get the template of edit screen
    * @param {int} index of the selected room type
    * @param {string} id of the room type
    */
	$scope.getTemplateUrl = function(index, id){
		// if(typeof index === "undefined" || typeof id === "undefined") return "";
		if(typeof index === "undefined" ) return "";
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
		var data = dclone($scope.floorListData, unwantedKeys);
		 
    	var successCallbackSave = function(data){
    		$scope.$emit('hideLoader');
    		//Since the list is ordered. Update the ordered data
    		$scope.orderedData[parseInt($scope.currentClickedElement)].name = $scope.floorListData.room_type_name;
    		$scope.orderedData[parseInt($scope.currentClickedElement)].code = $scope.floorListData.room_type_code;
    		$scope.currentClickedElement = -1;
    	};
    	$scope.invokeApi(ADFloorSetupSrv.updateFloor, data , successCallbackSave);
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

	 /*
    * To add new floor
    * 
    */		
	$scope.addNewFloor = function(){
		$scope.currentClickedElement = -1;
		$scope.isAddMode = $scope.isAddMode ? false : true;
		//reset data
		$scope.floorListData = {
				"name":1,
				"floor_number":"",
				"description":""
			}	
	};

	/*
    * To handle click event
    */	
	$scope.clickCancel = function(){
		if($scope.isAddMode)
			$scope.isAddMode =false;
		else
		    $scope.currentClickedElement = -1;
	};	
	var  addZeros = function(n) {
 			 return (n < 10)? '0' + n :'' + n;
	}

	$scope.floors = [];
	for(i=0;i<=100;i++){
		var floorData = {"value":i,"name":addZeros(i)};
		$scope.floors.push(floorData);
	};

}]);

