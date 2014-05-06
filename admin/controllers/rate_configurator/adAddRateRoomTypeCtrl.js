admin.controller('ADAddRateRoomTypeCtrl',['$scope','ADRatesAddRoomTypeSrv',  function($scope,ADRatesAddRoomTypeSrv){

$scope.selectedAssignedRoomIndex =-1;
$scope.selectedUnAssignedRoomIndex =-1;
$scope.nonAssignedroomTypes = [];
$scope.assignedRoomTypes = [];
$scope.availableRoomTypes = [];

var lastDropedTime = '';

/**
* Method to fetch the list of room types available. 
* Assigned rooms and non assigned rooms are calculated using the roomlist ids in parent scope
*/
$scope.fetchData = function(){
    var fetchRoomTypesSuccessCallback = function(data){
        console.log($scope.rateData.room_type_ids);
        $scope.availableRoomTypes = data.results;
        //$scope.nonAssignedroomTypes = data.results;
        $scope.calculateRoomLists();
        $scope.$emit('hideLoader');
    };

    $scope.invokeApi(ADRatesAddRoomTypeSrv.fetchRoomTypes, {},fetchRoomTypesSuccessCallback); 

};

$scope.$on("onRateDefaultsFetched", function(e){
    $scope.calculateRoomLists();
});

$scope.calculateRoomLists = function(){
    // separate out assigned and non-assigned room types
    $scope.assignedRoomTypes = [];
    if ($scope.rateData.room_type_ids){
        for(var j = 0; j < $scope.availableRoomTypes.length; j++){
            angular.forEach($scope.rateData.room_type_ids, function(room_type_id){
                if (room_type_id == $scope.availableRoomTypes[j].id){
                    $scope.assignedRoomTypes.push($scope.availableRoomTypes[j]);
                    //$scope.availableRoomTypes.splice(j, 1);
                }else{
                    $scope.nonAssignedroomTypes.push($scope.availableRoomTypes[j]);
                }
                
            });
        }
        if($scope.rateData.based_on.id !== undefined || $scope.rateData.based_on.id !== ""){
            $scope.nonAssignedroomTypes = [];
        }
    }

    
}


$scope.fetchData();

$scope.saveRoomTypes = function(){
    console.log($scope.rateData.id)
    
    var roomIdArray =[];
    angular.forEach($scope.assignedRoomTypes, function(item){
       roomIdArray.push(item.id);
    });
    var data = {
        'room_type_ids': roomIdArray,
        'id' : $scope.rateData.id
    };

    var saveRoomTypesSuccessCallback = function(data){
        $scope.$emit('hideLoader');
        $scope.rateData.room_type_ids = roomIdArray;
        $scope.$emit("changeMenu", 'Rates Range');
    };

    $scope.invokeApi(ADRatesAddRoomTypeSrv.saveRoomTypes, data, saveRoomTypesSuccessCallback);       
};

/**
 * To handle drop success event
 *
 */
$scope.dropSuccessHandler = function($event, index, array) {
    array.splice(index, 1);
};
/**
 * To handle on drop event
 *
 */
$scope.onDrop = function($event, $data, array) {    
    array.push($data);
};

/*
 * To check if any room is assigned
 *
 */
$scope.anyRoomSelected = function(){

    if($scope.assignedRoomTypes.length >0)
        return true;
    else
        return false;
}
/*
 * To register selected assigned room 
 *
 */

$scope.assignedRoomSelected = function($event, index){

    if(lastDropedTime == ''){
        if(index === $scope.selectedAssignedRoomIndex)
            $scope.selectedAssignedRoomIndex = -1;
        else
            $scope.selectedAssignedRoomIndex =index;        
    }
    else if(typeof lastDropedTime == 'object') { //means date
        var currentTime = new Date();
        var diff = currentTime - lastDropedTime;
        if(diff <= 100){
            $event.preventDefault();                
        }
        else{
            lastDropedTime = '';
        }
    }

    
}
/*
 * To register selected unassigned room 
 *
 */

$scope.unAssignedRoomSelected = function($event, index){
	//If base rate is selected, restrict the room types to the base rate
	if($scope.hasBaseRate){
		return false;
	}
    if(lastDropedTime == ''){
        if(index === $scope.selectedUnAssignedRoomIndex)
            $scope.selectedUnAssignedRoomIndex =-1;
        else{
            $scope.selectedUnAssignedRoomIndex =index;
        }   
    }
    else if(typeof lastDropedTime == 'object') { //means date
        var currentTime = new Date();
        var diff = currentTime - lastDropedTime;
        if(diff <= 100){
            $event.preventDefault();                
        }
        else{
            lastDropedTime = '';
        }
    }   


}
/*
 * To handle click action for selected room type 
 *
 */

$scope.topMoverightClicked = function(){

    if($scope.selectedUnAssignedRoomIndex != -1){
        var temp = $scope.nonAssignedroomTypes[$scope.selectedUnAssignedRoomIndex];
        $scope.assignedRoomTypes.push(temp)
        $scope.nonAssignedroomTypes.splice($scope.selectedUnAssignedRoomIndex,1);
        $scope.selectedUnAssignedRoomIndex =-1;
    }
};
/*
 * To handle click action for selected room type 
 *
 */
$scope.topMoveleftClicked = function(){
    if($scope.selectedAssignedRoomIndex != -1){
        var temp = $scope.assignedRoomTypes[$scope.selectedAssignedRoomIndex];
        $scope.nonAssignedroomTypes.push(temp)
        $scope.assignedRoomTypes.splice($scope.selectedAssignedRoomIndex,1);
        $scope.selectedAssignedRoomIndex =-1;
     }
};
/*
 * To handle click action to move all assigned room types 
 *
 */

$scope.bottomMoverightClicked = function(){
    if($scope.nonAssignedroomTypes.length>0){
        angular.forEach($scope.nonAssignedroomTypes, function(item){
        $scope.assignedRoomTypes.push(item);
 	});
        $scope.nonAssignedroomTypes = [];
    }
    $scope.selectedUnAssignedRoomIndex =-1;
};
/*
 * To handle click action to move all unassigned room types 
 *
 */
$scope.bottomMoveleftClicked = function(){
    if($scope.assignedRoomTypes.length>0){
        angular.forEach($scope.assignedRoomTypes, function(item){
           $scope.nonAssignedroomTypes.push(item);
         });
        $scope.assignedRoomTypes = [];
    }
    $scope.selectedAssignedRoomIndex =-1;

    };
    $scope.reachedAssignedRoomTypes = function(){
        $scope.selectedAssignedRoomIndex = -1;  
        lastDropedTime = new Date();
    }
    $scope.reachedUnAssignedRoomTypes = function(){
        $scope.selectedUnAssignedRoomIndex = -1;    
        lastDropedTime = new Date();
    } 

}]);

