admin.controller('ADFloorDetailsCtrl',
    [   '$scope', 
        '$state', 
        'ADFloorSetupSrv', 
        '$filter', 
        '$anchorScroll', 
        '$timeout',  
        '$location', 
        'floorDetails',
        '$stateParams', 
    function(
        $scope, 
        $state, 
        ADFloorSetupSrv, 
        $filter, 
        $anchorScroll, 
        $timeout, 
        $location,
        floorDetails,
        $stateParams){
	
	BaseCtrl.call(this, $scope);

    /**
    * set of initial settings - edit mode
    * @return - None
    */
    var setUpForEditMode = function(){
        $scope.floorData = floorDetails;
        $scope.floorData.searchKey = '';

        //duplicate of floor number
        $scope.floorData.floor_number_old = floorDetails.floor_number; 
        
        //list of unassigned rooms
        $scope.unassignedRooms = [];

        //list of assigned rooms
        $scope.assignedRooms = floorDetails.rooms;         

    };

    /**
    * set of initial settings - edit mode
    * @return - None
    */
    var setUpForAddMode = function(){
        $scope.floorData = {};
        $scope.floorData.searchKey = ''; 
        //list of unassigned rooms
        $scope.unassignedRooms = [];

        //list of assigned rooms
        $scope.assignedRooms = [];            
    };
    
    /**
    * should show assign selected button in unassigned rooms
    * @return - {Boolean}
    */
    $scope.shouldDisableSelectAllForUnAssigned = function(){
        return ($scope.unassignedRooms.length == 0)
    };

    /**
    * should show assign selected button in unassigned rooms
    * @return - {Boolean}
    */
    $scope.shouldDisableSelectAllForAssigned = function(){
        return ($scope.assignedRooms.length == 0)
    };

    /**
    * should show assign selected button in unassigned rooms
    * @return - {Boolean}
    */
    $scope.shouldShowAssignSelectedForUnAssigned = function(){
        return ($scope.selectedUnassignedRooms.length > 0)
    };

    /**
    * should show assign selected button in unassigned rooms
    * @return - {Boolean}
    */
    $scope.shouldShowAssignSelectedForAssigned = function(){
        return ($scope.selectedAssignedRooms.length > 0)
    };

    /**
    * should show assign selected button in unassigned rooms
    * @return - {Boolean}
    */
    $scope.shouldShowFindRooms = function(){
        return ($scope.unassignedRooms.length == 0)
    };

	/**
	* set of initial settings
    * @return - None
	*/
	var initializeMe = function() {
        $scope.errorMessage = '';

        //if we have id in stateparams, we have to switch to edit mode
        $scope.isAddMode = $stateParams.id ? false : true;        
      
        //if it is in editMode
        if(!$scope.isAddMode) setUpForEditMode();

        //if it is in addMode
        if($scope.isAddMode) setUpForAddMode();
	
            
        //list of selected rooms from unassigned rooms list
        $scope.selectedUnassignedRooms = [];

        $scope.selectedAssignedRooms = [];
	};	
    
    /**
    * when an item selected, we will add/remove from array 'selectedUnassignedRooms'
    * @param {Object} - Room
    * @return - None    
    */
    $scope.unAssignedRoomSelected = function(room){
        var roomIndex = _.indexOf(_.pluck($scope.selectedUnassignedRooms, 'id'), room.id);

        //is not in list, we have to add
        if (roomIndex === -1){
            $scope.selectedUnassignedRooms.push(room);            
        }
        //if found, we have to remove from list
        else {
            $scope.selectedUnassignedRooms.splice(roomIndex, 1);     
        }
    };

    /**
    * when an item selected, we will add/remove from array 'selectedUnassignedRooms'
    * @param {Object} - Room
    * @return - None    
    */
    $scope.assignedRoomSelected = function(room){
        var roomIndex = _.indexOf(_.pluck($scope.selectedAssignedRooms, 'id'), room.id);

        //is not in list, we have to add
        if (roomIndex === -1){
            $scope.selectedAssignedRooms.push(room);            
        }
        //if found, we have to remove from list
        else {
            $scope.selectedAssignedRooms.splice(roomIndex, 1);     
        }
    };

    /**
    * Method for go back
    * will redirect to to floor list screen
    * @return - None  
    */
    $scope.back = function(){
        $state.go ('admin.floorsetups');
    };

    /**
    * we have to add 'Selected' against those unSelected rooms
    * @param {Object} - Room
    * @return {Boolean} 
    */
    $scope.amInSelectedUnAssignedRooms = function(room){
        var roomIndex = _.indexOf(_.pluck($scope.selectedUnassignedRooms, 'id'), room.id);
        // we will return false if not found in the list
        return (roomIndex >= 0 ? true : false);
    };


    /**
    * will move the selected UnAssignItems to Selected Item List
    * @return - None
    */
    $scope.moveSelectedUnAssignToAssignList = function(){
        var roomIndex = -1;
        _.each($scope.selectedUnassignedRooms, function(room){
            $scope.assignedRooms.push (room);

            //removing from UnAssigning list
            roomIndex = _.indexOf(_.pluck($scope.unassignedRooms, 'id'), room.id);
            $scope.unassignedRooms.splice (roomIndex, 1);
        });
        $scope.selectedUnassignedRooms = [];
    };

    /**
    * will move the selected assignItems to unassign Selected Item List
    * @return - None
    */
    $scope.moveSelectedAssignToUnAssignList = function(){
        _.each($scope.selectedAssignedRooms, function(room){
            $scope.unassignedRooms.push (room);

            //removing from UnAssigning list
            roomIndex = _.indexOf(_.pluck($scope.assignedRooms, 'id'), room.id);
            $scope.assignedRooms.splice (roomIndex, 1);            
        });
        $scope.selectedAssignedRooms = [];        
    };

    /*
    * To save/update room type details
    * @return - None
    */
    $scope.saveFloor = function(){
		
		var unwantedKeys = ['rooms'];
		var params = dclone($scope.floorData, unwantedKeys);
		 
    	var successCallbackSave = function(data){
    		$scope.$emit('hideLoader');
    		$scope.back ();    		    	
    	};

    	//appending the room ids in list
    	params.room_ids = _.pluck($scope.assignedRooms, 'id');

    	$scope.invokeApi(ADFloorSetupSrv.updateFloor, params , successCallbackSave);
    };

    /**
    * successcallback of getFloorDetails APi call
    * will set assignrooms with what we got  from API
    * @return - None
    */
    var successCallBackOfGetAssignedRoomAgainstFloor = function(data) {
   		$scope.assignedRooms = data.rooms;
	 	
	 	$scope.floorData.floortitle = data.description ;
	 	$scope.floorData.floor_number_old = data.floor_number ;
    };


    /**
    * successcallback of fetchAllUnAssignedRoom APi call
    * will set unassignrooms with what we got from API
    * @return - None
    */
    var successCallBackOfFetchAllUnAssignedRoom = function(data) {
    	$scope.unassignedRooms = data.rooms;

        //resetting already choosed unassigned in last
        $scope.selectedUnassignedRooms = [];
    };

    /**
    * To fetch list of all unassigned room
    * @return - None
    */
    $scope.showAllUnassignedRooms = function(){   		
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
    * on canceling, we are going back  to floor list page
    * @return - None 
    */	
    $scope.clickCancel = function(){
    	$scope.back();
    };	

    $scope.searchInUnassignedRooms = function() { 
		var params 	= {
			query: $scope.floorData.searchKey
		};   		
    	var options = {
    		params: 			params,
    		successCallBack: 	successCallBackOfFetchAllUnAssignedRoom      		
        }
        $scope.callAPI(ADFloorSetupSrv.getUnAssignedRooms, options);		
    };


    $scope.selectAllUnassignedRooms = function(){
        $scope.selectedUnassignedRooms = []; 
        _.each($scope.unassignedRooms, function(room){
            $scope.selectedUnassignedRooms.push (room);           
        }); 
    }

    $scope.selectAllAssignedRooms = function(){
        $scope.selectedAssignedRooms = [];
        _.each($scope.assignedRooms, function(room){
            $scope.selectedAssignedRooms.push (room);           
        });         
    }

    initializeMe();	

}]);

