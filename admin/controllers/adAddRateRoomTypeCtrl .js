	admin.controller('ADAddRateRoomTypeCtrl',['$scope','ADRatesAddRoomTypeSrv',  function($scope,ADRatesAddRoomTypeSrv){

	$scope.selectedAssignedRoomIndex =-1;
	$scope.selectedUnAssignedRoomIndex =-1;
	$scope.nonAssignedroomTypes = [];
	$scope.assignedRoomTypes = [];

	$scope.fetchData = function(){
		
		var fetchRoomTypesSuccessCallback = function(data){
			$scope.nonAssignedroomTypes = data.results;
			$scope.$emit('hideLoader');
		};
		var fetchRoomTypesFailureCallback = function(data){
			$scope.$emit('hideLoader');
		};
		$scope.invokeApi(ADRatesAddRoomTypeSrv.fetchRoomTypes, {},fetchRoomTypesSuccessCallback,fetchRoomTypesFailureCallback);	

	};
	$scope.fetchData();

	$scope.saveStep2 = function(){
		
		var assignedRoomArray =[];
		angular.forEach($scope.assignedRoomTypes, function(item){
			   assignedRoomArray.push(item.id.toString());
			 });
		var data = {
			'room_type_ids': assignedRoomArray,
			'id' : $scope.newRateId
		};
		var saveRoomTypesSuccessCallback = function(data){
			$scope.$emit('hideLoader');
			$scope.$emit("updateIndex","2");
		};
		var saveRoomTypesFailureCallback = function(data){
			$scope.$emit('hideLoader');
		};
		$scope.invokeApi(ADRatesAddRoomTypeSrv.saveRoomTypes,data,saveRoomTypesSuccessCallback,saveRoomTypesFailureCallback);
		
		
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

	$scope.assignedRoomSelected = function(index){
			$scope.selectedAssignedRoomIndex =index;
		
	}
   /*
	 * To register selected unassigned room 
	 *
	 */

	$scope.unAssignedRoomSelected = function(index){
		$scope.selectedUnAssignedRoomIndex =index;

	}
   /*
	 * To handle click action for selected room type 
	 *
	 */

	$scope.topMoverightClicked = function(){
		
		if($scope.selectedAssignedRoomIndex != -1){
			var temp = $scope.assignedRoomTypes[$scope.selectedAssignedRoomIndex];
			$scope.nonAssignedroomTypes.push(temp)
			$scope.assignedRoomTypes.splice($scope.selectedAssignedRoomIndex,1);
			$scope.selectedAssignedRoomIndex =-1;
		 }
	};
   /*
	 * To handle click action for selected room type 
	 *
	 */
	$scope.topMoveleftClicked = function(){
		
		if($scope.selectedUnAssignedRoomIndex != -1){
			var temp = $scope.nonAssignedroomTypes[$scope.selectedUnAssignedRoomIndex];
			$scope.assignedRoomTypes.push(temp)
			$scope.nonAssignedroomTypes.splice($scope.selectedUnAssignedRoomIndex,1);
			$scope.selectedUnAssignedRoomIndex =-1;
	    }
	};
   /*
	 * To handle click action to move all assigned room types 
	 *
	 */

	$scope.bottomMoverightClicked = function(){

		if($scope.assignedRoomTypes.length>0){
			angular.forEach($scope.assignedRoomTypes, function(item){
			   $scope.nonAssignedroomTypes.push(item);
			 });
			$scope.assignedRoomTypes = [];
		}
	};
   /*
	 * To handle click action to move all unassigned room types 
	 *
	 */
	$scope.bottomMoveleftClicked = function(){

		if($scope.nonAssignedroomTypes.length>0){
			angular.forEach($scope.nonAssignedroomTypes, function(item){
	        $scope.assignedRoomTypes.push(item);
	 });
			$scope.nonAssignedroomTypes = [];
		}
	};

	}]);

