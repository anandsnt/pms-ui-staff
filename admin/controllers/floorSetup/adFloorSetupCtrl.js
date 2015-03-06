admin.controller('ADFloorSetupCtrl',['$scope', '$state', 'ADFloorSetupSrv', 'ngTableParams','$filter', '$anchorScroll', '$timeout',  '$location', 
 function($scope, $state, ADFloorSetupSrv, ngTableParams, $filter, $anchorScroll, $timeout, $location){
	
	$scope.errorMessage = '';
	BaseCtrl.call(this, $scope);

	/**
	* set of initial settings
	*/
	var initializeMe = function() {
		$scope.floorData = {};

		//list of unassigned rooms
		$scope.unassignedRooms = [];

		//list of assigned rooms
		$scope.assignedRooms = [];	

		//To list room types
		$scope.listFloorTypes(); 
	};	

   /*
    * To fetch list of room types
    */
	$scope.listFloorTypes = function(){
		var successCallbackFetch = function(data){
			$scope.$emit('hideLoader');
			$scope.data = data;
			$scope.currentClickedElement = -1;
			
			// REMEMBER - ADDED A hidden class in ng-table angular module js. Search for hidde or pull-right
		    $scope.tableParams = new ngTableParams({
		       page: 1,            // show first page
		       	count: 100,    // count per page - Need to change when on pagination implemntation
		        sorting: { floor_number: 'asc'     // initial sorting 
		        }
		    }, {
		     
		        getData: function($defer, params) {
		            // use build-in angular filter
		            var orderedData = params.sorting() ?
		                                $filter('orderBy')($scope.data.floors, params.orderBy()) :
		                                $scope.data.floors;
		                              
		            $scope.orderedData =  orderedData;
		                                 
		            $defer.resolve(orderedData);
		        }
		    });
		};
	   $scope.invokeApi(ADFloorSetupSrv.fetch, {} , successCallbackFetch);	
	};

   /*
    * To render edit room types screen
    * @param {index} index of selected room type
    * @param {id} id of the room type
    */	
	$scope.editFloor = function(index, id)	{
		
		$scope.currentClickedElement = index;
	 	$scope.floorData = $scope.orderedData[index]; 
		
		//getting all unassinged rooms
		$scope.unassignedRooms = [];
		fetchAllUnAssignedRoom();

		//resetting the list unassigned rooms
		$scope.assignedRooms = [];

		//fetching the list of assigned rooms
		var floorID = $scope.floorData.id;
		getFloorDetails(floorID);	 	
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
		
		var unwantedKeys = ['rooms'];
		var params = dclone($scope.floorData, unwantedKeys);
		
	
		 
    	var successCallbackSave = function(data){
    		$scope.$emit('hideLoader');
    		//Since the list is ordered. Update the ordered data
    		if($scope.isAddMode){
    			$scope.data.floors.push(data);
    			$scope.tableParams.reload();
    			$scope.isAddMode = false;
    		}else{
    			$scope.orderedData[parseInt($scope.currentClickedElement)].description = $scope.floorData.description;
    			$scope.orderedData[parseInt($scope.currentClickedElement)].floor_number = $scope.floorData.floor_number;
    			$scope.tableParams.reload();
    			$scope.currentClickedElement = -1;
    		}		
    		
    	};

    	//appending the room ids in list
    	params.room_ids = _.pluck($scope.assignedRooms, 'id');

    	$scope.invokeApi(ADFloorSetupSrv.updateFloor, params , successCallbackSave);
    };

   /**
   * successcallback of getFloorDetails APi call
   * will set assignrooms with what we got  from API
   */
   var successCallBackOfGetAssignedRoomAgainstFloor = function(data) {
   		$scope.assignedRooms = data.rooms;
	 	
	 	$scope.floorData.floortitle = data.description ;
	 	$scope.floorData.floor_number_old = data.floor_number ;
   };

   /**
   * To fetch list of all unassigned room
   */
   var getFloorDetails = function(floorID) {   		
   		var params 	= {
   			floorID: 	floorID
   		};   		
		var options = {
    		params: 			params,
    		successCallBack: 	successCallBackOfGetAssignedRoomAgainstFloor     		
	    }
	    $scope.callAPI(ADFloorSetupSrv.getFloorDetails, options);		
   };

   /**
   * successcallback of fetchAllUnAssignedRoom APi call
   * will set unassignrooms with what we got  from API
   */
   var successCallBackOfFetchAllUnAssignedRoom = function(data) {
   		$scope.unassignedRooms = data.rooms;
   };

   /**
   * To fetch list of all unassigned room
   */
   var fetchAllUnAssignedRoom = function(floorID) {   		
   		var params 	= {
   			query: 	''
   		};   		
		var options = {
    		params: 			params,
    		successCallBack: 	successCallBackOfFetchAllUnAssignedRoom      		
	    }
	    $scope.callAPI(ADFloorSetupSrv.getUnAssignedRooms, options);		
   };

   /*
   * To delete a floor
   */
   $scope.deleteFloor = function(index){
		
		var unwantedKeys = [];
		var data = {};
		 data.id = $scope.orderedData[index].id;
    	var successCallbackSave = function(){
    		$scope.$emit('hideLoader');
    		var pos = $scope.data.floors.indexOf($scope.orderedData[index]);
    		$scope.data.floors.splice(pos, 1);
    		$scope.tableParams.reload();
    	};
    	$scope.invokeApi(ADFloorSetupSrv.deleteFloor, data , successCallbackSave);
    };
	/*
    * To add new floor
    * 
    */		
	$scope.addNewFloor = function(){
		$scope.currentClickedElement = -1;
		$scope.isAddMode = $scope.isAddMode ? false : true;
		//reset data
		$scope.floorData = {
			"floor_number":"",
			"description":"",
			"floortitle":"",

		};	
		//resetting the list unassigned rooms
		$scope.unassignedRooms = [];
		
		//resetting the list unassigned rooms
		$scope.assignedRooms = [];
		
		//fetching the list of unassigned rooms
		fetchAllUnAssignedRoom();

		$timeout(function() {
            $location.hash('new-form-holder');
            $anchorScroll();
    	});
	};

	/*
    * To handle click event
    */	
	$scope.clickCancel = function(){
		$scope.floorData.description = $scope.floorData.floortitle;
		$scope.floorData.floor_number = $scope.floorData.floor_number_old;
		if($scope.isAddMode)
			$scope.isAddMode =false;
		else
		    $scope.currentClickedElement = -1;
	};	
	var  addZeros = function(n) {
 			 return (n < 10)? '0' + n :'' + n;
	}

	$scope.validate = function(){
		if ($scope.floorData.floor_number == "" || typeof $scope.floorData.floor_number == "undefined" || $scope.floorData.description == " ") 
			return false;
		else
			return true;
	};

	initializeMe();	

}]);

