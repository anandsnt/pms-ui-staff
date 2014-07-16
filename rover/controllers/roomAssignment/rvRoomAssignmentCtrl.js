
sntRover.controller('RVroomAssignmentController',['$scope','$state', '$stateParams', 'RVRoomAssignmentSrv', '$filter', 'RVReservationCardSrv', 'roomsList', 'roomPreferences', 'roomUpgrades', '$timeout', 'ngDialog', function($scope, $state, $stateParams, RVRoomAssignmentSrv, $filter, RVReservationCardSrv, roomsList, roomPreferences, roomUpgrades, $timeout, ngDialog){
		
	BaseCtrl.call(this, $scope);
	var title = $filter('translate')('ROOM_ASSIGNMENT_TITLE');
	$scope.setTitle(title);

	setTimeout(function(){
				$scope.refreshScroller('roomlist');	
				$scope.refreshScroller('filterlist');	
				}, 
			3000);
	$timeout(function() {
    	$scope.$broadcast('roomUpgradesLoaded', roomUpgrades);
		$scope.$broadcast('roomFeaturesLoaded', $scope.roomFeatures);
	});

	/**
	* function to to get the rooms based on the selected room type
	*/
	$scope.getRooms = function(index){
		$scope.selectedRoomType = $scope.getCurrentRoomType();
		var successCallbackGetRooms = function(data){
			$scope.rooms = data.rooms;
			$scope.reservation_occupancy = data.reservation_occupancy;
			$scope.setRoomsListWithPredefinedFilters();
			$scope.applyFilterToRooms();
			$scope.$emit('hideLoader');
			$scope.refreshScroller('roomlist');	
			// setTimeout(function(){
			// 	$scope.$parent.myScroll['roomlist'].refresh();
			// 	}, 
			// 3000);
		};
		var errorCallbackGetRooms = function(error){
			$scope.$emit('hideLoader');
			$scope.errorMessage = error;
		};
		var params = {};
		params.reservation_id = $stateParams.reservation_id;
		params.room_type = $scope.roomType;
		$scope.invokeApi(RVRoomAssignmentSrv.getRooms, params, successCallbackGetRooms, errorCallbackGetRooms);

	};

	$scope.getCurrentRoomType = function(){
		for (var i = 0; i < $scope.roomTypes.length; i++) {
			if($scope.roomTypes[i].type == $scope.roomType)
				return $scope.roomTypes[i];
		};
	}

	/**
	* function to check occupancy for the reservation
	*/
	$scope.showMaximumOccupancyDialog = function(index){
		var showOccupancyMessage = false;
		if($scope.filteredRooms[index].room_max_occupancy != null && $scope.reservation_occupancy != null){
				if($scope.filteredRooms[index].room_max_occupancy < $scope.reservation_occupancy){
					showOccupancyMessage = true;
					$scope.max_occupancy = $scope.filteredRooms[index].room_max_occupancy;
			}
		}else if($scope.filteredRooms[index].room_type_max_occupancy != null && $scope.reservation_occupancy != null){
				if($scope.filteredRooms[index].room_type_max_occupancy < $scope.reservation_occupancy){
					showOccupancyMessage = true;
					$scope.max_occupancy = $scope.filteredRooms[index].room_type_max_occupancy;
				} 
		}
		
		$scope.assignedRoom = $scope.filteredRooms[index];
		if(showOccupancyMessage){
			ngDialog.open({
                  template: '/assets/partials/roomAssignment/rvMaximumOccupancyDialog.html',
                  controller: 'rvMaximumOccupancyDialogController',
                  className: 'ngdialog-theme-default',
                  scope: $scope
                });
		}else{
			$scope.assignRoom();
		}
		

	}

	$scope.occupancyDialogSuccess = function(){
		$scope.assignRoom();			
	};
	
	/**
	* function to assign the new room for the reservation
	*/
	$scope.assignRoom = function(){
		var successCallbackAssignRoom = function(data){
			$scope.reservationData.reservation_card.room_number = $scope.assignedRoom.room_number;
			$scope.reservationData.reservation_card.room_status = $scope.assignedRoom.room_status;
			$scope.reservationData.reservation_card.fo_status = $scope.assignedRoom.fo_status;
			if($scope.roomType != $scope.reservationData.reservation_card.room_type_code){
				$scope.reservationData.reservation_card.is_upsell_available = false;
			}
			if(typeof $scope.selectedRoomType != 'undefined'){
				$scope.reservationData.reservation_card.room_type_description = $scope.selectedRoomType.description;
				$scope.reservationData.reservation_card.room_type_code = $scope.selectedRoomType.type;
			}			
			RVReservationCardSrv.updateResrvationForConfirmationNumber($scope.reservationData.reservation_card.confirmation_num, $scope.reservationData);
			if($scope.clickedButton == "checkinButton"){
				$state.go('rover.staycard.billcard', {"reservationId": $scope.reservationData.reservation_card.reservation_id, "clickedButton": "checkinButton"});
			} else {
				$scope.backToStayCard();
			}
			$scope.$emit('hideLoader');
		};
		var errorCallbackAssignRoom = function(error){
			$scope.$emit('hideLoader');
			$scope.errorMessage = error;
		};
		var params = {};
		params.reservation_id = parseInt($stateParams.reservation_id, 10);
		params.room_number = parseInt($scope.assignedRoom.room_number, 10);
		
		$scope.invokeApi(RVRoomAssignmentSrv.assignRoom, params, successCallbackAssignRoom, errorCallbackAssignRoom);
	};

	/**
	* setting the scroll options for the room list
	*/
	var scrollerOptions = { preventDefault: false};
  	$scope.setScroller('roomlist', scrollerOptions);
  	$scope.setScroller('filterlist', scrollerOptions);

	/**
	* Listener to update the room list when the filters changes
	*/
	$scope.$on('roomFeaturesUpdated', function(event, data){
			$scope.roomFeatures = data;
			$scope.setSelectedFiltersList();
			$scope.applyFilterToRooms();
			setTimeout(function(){		
				$scope.refreshScroller('roomlist');	
				}, 
			1000);
	});
	/**
	* Listener to update the reservation details on upgrade selection
	*/
	$scope.$on('upgradeSelected', function(event, data){
			$scope.reservationData.reservation_card.room_number = data.room_no;
			$scope.reservationData.reservation_card.room_type_description = data.room_type_name;
			$scope.reservationData.reservation_card.room_type_code = data.room_type_code;
			$scope.reservationData.reservation_card.room_status = "READY";
			$scope.reservationData.reservation_card.fo_status = "VACANT";
			$scope.reservationData.reservation_card.is_upsell_available = false;
			RVReservationCardSrv.updateResrvationForConfirmationNumber($scope.reservationData.reservation_card.confirmation_num, $scope.reservationData);
			$scope.backToStayCard();
	});

	/**
	* function to go back to reservation details
	*/
	$scope.backToStayCard = function(){
		
		$state.go("rover.staycard.reservationcard.reservationdetails", {id:$scope.reservationData.reservation_card.reservation_id, confirmationId:$scope.reservationData.reservation_card.confirmation_num});
		
	};
	/**
	* function to show and hide the filters view
	*/
	$scope.toggleFiltersView = function(){
		$scope.isFiltersVisible = !$scope.isFiltersVisible;
		setTimeout(function(){	
				$scope.refreshScroller('filterlist');				
				}, 
			1000);
	};
	/**
	* function to set the color coding for the room number based on the room status
	*/
	$scope.getRoomStatusClass = function(){
		var reservationRoomStatusClass = "";
		if($scope.reservationData.reservation_card.reservation_status == 'CHECKING_IN'){
			if($scope.reservationData.reservation_card.room_status == 'READY' && $scope.reservationData.reservation_card.fo_status == 'VACANT'){
				reservationRoomStatusClass = "ready";
			} else {
				reservationRoomStatusClass = "not-ready";
			}
		} 
		return reservationRoomStatusClass;
	};

	$scope.getRoomStatusClassForRoom = function(room){
		var reservationRoomStatusClass = "";
		
			if(room.room_status == 'READY' && room.fo_status == 'VACANT'){
				reservationRoomStatusClass = "ready";
			} else {
				reservationRoomStatusClass = "not-ready";
			}
		
		return reservationRoomStatusClass;
	};
	/**
	* function to change text according to the number of nights
	*/
	$scope.setNightsText = function(){
		return ($scope.reservationData.reservation_card.total_nights == 1)?$filter('translate')('NIGHT_LABEL'):$filter('translate')('NIGHTS_LABEL');
	};
	/**
	* function to decide whether or not to show the upgrades
	*/
	$scope.isUpsellAvailable = function(){
		var showUpgrade = false;
		if(($scope.reservationData.reservation_card.is_upsell_available == 'true') && ($scope.reservationData.reservation_card.reservation_status == 'RESERVED' || $scope.reservationData.reservation_card.reservation_status == 'CHECKING_IN')){
			showUpgrade = true;
		}
		return showUpgrade;
	};
	/**
	* function to add the predefined filters to the filterlist
	*/
	$scope.addPredefinedFilters = function(){
		var group = {};
		group.group_name = "predefined";
		group.multiple_allowed = true;
		group.items = [];
		var item1 = {};
		item1.id = -100;
		item1.name = $filter('translate')('INCLUDE_NOTREADY_LABEL');
		item1.selected = false;
		var item2 = {};
		item2.id = -101;
		item2.name = $filter('translate')('INCLUDE_DUEOUT_LABEL');
		item2.selected = false;
		var item3 = {};
		item3.id = -102;
		item3.name = $filter('translate')('INCLUDE_PREASSIGNED_LABEL');
		item3.selected = false;
		group.items.push(item1);
		group.items.push(item2);
		group.items.push(item3);
		$scope.roomFeatures.splice(0, 0, group);
	};

	/**
	* function to prepare the filtered room list
	*/
	$scope.applyFilterToRooms = function(){
		$scope.filteredRooms = [];
		var roomsWithInitialFilters = $scope.getRoomsWithInitialFilters();
		for(var i = 0; i < roomsWithInitialFilters.length; i++){
			var flag = true;
			
				for(var j = 0; j < $scope.selectedFiltersList.length; j++){
					if($scope.selectedFiltersList[j] != -100 && $scope.selectedFiltersList[j] != -101 && $scope.selectedFiltersList[j] != -102){
						if(roomsWithInitialFilters[i].room_features.indexOf($scope.selectedFiltersList[j]) == -1)
						flag = false;
					}									
				}
			if(flag)
				$scope.addToFilteredRooms(roomsWithInitialFilters[i]);
		}
		var includeNotReady = false;
		var includeDueOut = false;
		var includePreAssigned = false;
		if($scope.selectedFiltersList.indexOf(-100) != -1){
			includeNotReady = true;
			$scope.selectedFiltersList.splice($scope.selectedFiltersList.indexOf(-100), 1);
		}
			
			
		if($scope.selectedFiltersList.indexOf(-101) != -1){
			includeDueOut = true;
			$scope.selectedFiltersList.splice($scope.selectedFiltersList.indexOf(-101), 1);
		}
			
		if($scope.selectedFiltersList.indexOf(-102) != -1){
			includePreAssigned = true;
			$scope.selectedFiltersList.splice($scope.selectedFiltersList.indexOf(-102), 1);
		}
			
		if($scope.filteredRooms.length == 0 && $scope.selectedFiltersList.length == 0)
			$scope.filteredRooms = roomsWithInitialFilters;
		
		if(includeNotReady)
			$scope.includeNotReadyRooms();
		if(includeDueOut)
			$scope.includeDueoutRooms();
		if(includePreAssigned)
			$scope.includePreAssignedRooms(); 
	};

	$scope.getRoomsWithInitialFilters = function(){
		var roomsWithInitialFilters = [];
		for (var i = 0; i < $scope.rooms.length; i++) {
			if($scope.rooms[i].room_status == "READY" && $scope.rooms[i].fo_status == "VACANT" && !$scope.rooms[i].is_preassigned)
				roomsWithInitialFilters.push($scope.rooms[i]);
		};
		return roomsWithInitialFilters;
	}

	$scope.includeNotReadyRooms = function(){
		for(var i = 0; i < $scope.rooms.length; i++){
			if($scope.rooms[i].room_features.indexOf(-100) != -1)
				$scope.addToFilteredRooms($scope.rooms[i]);
		}
	};
	$scope.includeDueoutRooms = function(){
		for(var i = 0; i < $scope.rooms.length; i++){
			if($scope.rooms[i].room_features.indexOf(-101) != -1)
				$scope.addToFilteredRooms($scope.rooms[i]);
		}
	};
	$scope.includePreAssignedRooms = function(){
		for(var i = 0; i < $scope.rooms.length; i++){
			if($scope.rooms[i].room_features.indexOf(-102) != -1)
				$scope.addToFilteredRooms($scope.rooms[i]);
		}
	};

	/**
	* function to add the rooms to filtered list with sorting, handling the duplication
	*/
	$scope.addToFilteredRooms = function(room){
		var flag = false;
		var pos = -1;
			for(var j = 0; j < $scope.filteredRooms.length; j++){
				if($scope.filteredRooms[j].room_number < room.room_number){
						pos = j;
				}					
				if(room.room_number == $scope.filteredRooms[j].room_number)
					flag = true;
			}
			if(!flag){
				$scope.filteredRooms.splice(pos + 1, 0, room);
			}
				
	};
	/**
	* function to prepare the array of selected filters' ids
	*/
	$scope.setSelectedFiltersList = function(){
		$scope.selectedFiltersList = [];
		for(var i = 0; i < $scope.roomFeatures.length; i++){
			for(var j = 0; j < $scope.roomFeatures[i].items.length; j++){
				if($scope.roomFeatures[i].items[j].selected){
					$scope.selectedFiltersList.push($scope.roomFeatures[i].items[j].id);
				}
			}
		}
	}
	/**
	* function to return the rooms list status
	*/
	$scope.isRoomListEmpty = function(){
		return ($scope.filteredRooms.length == 0);
	}
	/**
	* function to add ids for predefined filters checking the corresponding status
	*/
	$scope.setRoomsListWithPredefinedFilters = function(){
		for(var i = 0; i < $scope.rooms.length; i++){
			if($scope.rooms[i].room_status == "NOTREADY" && $scope.rooms[i].fo_status == "VACANT" && $scope.rooms[i].room_ready_status != "CLEAN")
				$scope.rooms[i].room_features.push(-100);
			if($scope.rooms[i].fo_status == "DUEOUT")
				$scope.rooms[i].room_features.push(-101);
			if($scope.rooms[i].is_preassigned)
				$scope.rooms[i].room_features.push(-102);
		}
	}
	$scope.init = function(){
	$scope.roomTypes = roomPreferences.room_types;
	$scope.roomFeatures = roomPreferences.room_features;
	$scope.addPredefinedFilters();
	$scope.setSelectedFiltersList();
	$scope.rooms = roomsList.rooms;
	$scope.reservation_occupancy = roomsList.reservation_occupancy;
	$scope.setRoomsListWithPredefinedFilters();
	$scope.applyFilterToRooms();
	$scope.clickedButton = $stateParams.clickedButton;
	$scope.assignedRoom = "";
	$scope.reservationData = $scope.$parent.reservation;
	$scope.roomType = $stateParams.room_type; 
	$scope.isFiltersVisible = false;
	$scope.$emit('HeaderChanged', $filter('translate')('ROOM_ASSIGNMENT_TITLE'));
	};
	$scope.init();
	
}]);