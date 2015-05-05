
sntRover.controller('RVroomAssignmentController',[
	'$scope',
	'$rootScope',
	'$state',
	'$stateParams', 
	'RVRoomAssignmentSrv', 
	'$filter', 
	'RVReservationCardSrv', 
	'roomsList', 
	'roomPreferences', 
	'roomUpgrades', 
	'$timeout', 
	'ngDialog',
	'RVSearchSrv',
	function($scope, $rootScope, $state, $stateParams, RVRoomAssignmentSrv, $filter, RVReservationCardSrv, roomsList, roomPreferences, roomUpgrades, $timeout, ngDialog, RVSearchSrv){

	// set a back button on header
	$rootScope.setPrevState = {
		title: $filter('translate')('STAY_CARD'),
		callback: 'backToStayCard',
		scope: $scope
	};
		
	BaseCtrl.call(this, $scope);
	var oldRoomType = '';
	$scope.errorMessage = '';
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

	/*To fix the unassign button flasing issue during checkin
	*/
	$scope.roomAssgnment = {};
	$scope.roomAssgnment.inProgress = false;
	$scope.roomTransfer = {};
	/**
	* function to to get the rooms based on the selected room type
	*/
	$scope.getRooms = function(isOldRoomType){
		$scope.selectedRoomType = $scope.getCurrentRoomType();
		var successCallbackGetRooms = function(data){
			$scope.rooms = data.rooms;
			$scope.reservation_occupancy = data.reservation_occupancy;
			$scope.setSelectedFiltersList();
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
		if(isOldRoomType!=undefined){
			if(isOldRoomType){
				$scope.roomType = oldRoomType;
			}
		}
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
	};

	$scope.moveInHouseRooms = function(){
		$scope.selectedRoomType = $scope.getCurrentRoomType();
		var successCallbackMoveInHouseRooms = function(response){
			$scope.roomTransfer.newRoomRate = response.data.new_rate_amount;
			$scope.roomTransfer.oldRoomRate = response.data.old_rate_amount;
			$scope.$emit('hideLoader');
		
			if($scope.roomTransfer.newRoomRate !== $scope.roomTransfer.oldRoomRate){
				$scope.roomTransfer.newRoomType = $scope.selectedRoomType.description;
				$scope.roomTransfer.isNewRoomType = true;
			}
			else{
				$scope.roomTransfer.newRoomType = $scope.selectedRoomType.description;
				$scope.roomTransfer.isNewRoomType = false;
			}
			ngDialog.open({
	          template: '/assets/partials/roomAssignment/rvRoomTransferConfirmation.html',
	          controller: 'rvRoomTransferConfirmationCtrl',
	          scope: $scope
        	});
		};
		var errorCallbackMoveInHouseRooms = function(error){
			$scope.$emit('hideLoader');
			$scope.errorMessage = error;
		};
		var params = {};
		params.reservation_id = $scope.reservationData.reservation_card.reservation_id;
		params.room_type_id = $scope.selectedRoomType.id;
		params.room_number = $scope.roomTransfer.newRoomNumber;
		$scope.invokeApi(RVRoomAssignmentSrv.moveInHouseRooms, params, successCallbackMoveInHouseRooms, errorCallbackMoveInHouseRooms);
		
	};

	/**
	* function to check occupancy for the reservation
	*/
	$scope.showMaximumOccupancyDialog = function(index){
		
		var reservationStatus = $scope.reservationData.reservation_card.reservation_status;
		
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
		$scope.roomTransfer.newRoomNumber = $scope.filteredRooms[index].room_number;
		if(showOccupancyMessage){
	    //if(true){
	    	$scope.oldRoomType = oldRoomType;
			ngDialog.open({
                  template: '/assets/partials/roomAssignment/rvMaximumOccupancyDialog.html',
                  controller: 'rvMaximumOccupancyDialogController',
                  className: 'ngdialog-theme-default',
                  scope: $scope
                });
		}else{
			if(reservationStatus=="CHECKEDIN"){
				$scope.moveInHouseRooms();
			}else{
				if(oldRoomType !== $scope.roomType){
				//if(true){
					$scope.oldRoomType = oldRoomType;
					$scope.openApplyChargeDialog();
				} else {
					$scope.roomTransfer.withoutRateChange = true;
					$scope.assignRoom();
				}
			}
		}
	};
	$scope.openApplyChargeDialog = function(){
		ngDialog.open({
	          template: '/assets/partials/roomAssignment/rvApplyRoomCharge.html',
	          controller: 'rvApplyRoomChargeCtrl',
	          className: 'ngdialog-theme-default',
	          scope: $scope
        });
	};

	$scope.occupancyDialogSuccess = function(){
		//$scope.assignRoom();	
		var reservationStatus = $scope.reservationData.reservation_card.reservation_status;
        if(reservationStatus=="CHECKEDIN"){
            	$scope.moveInHouseRooms();
       	}else{
        	    $scope.openApplyChargeDialog();         
       	}
	
	};
	// update the room details to RVSearchSrv via RVSearchSrv.updateRoomDetails - params: confirmation, data
	var updateSearchCache = function() {

		// room related details
		var data = {
			'room': '',					
		};

		RVSearchSrv.updateRoomDetails($scope.reservationData.reservation_card.confirmation_num, data);
	};
	
	/**
	* click function to unassing rooms
	*/
	$scope.unassignRoom = function(){
		var params = {
			'reservationId' : parseInt($stateParams.reservation_id, 10)
		};

		//success call of un-assigningb rooms
		var successCallbackOfUnAssignRoom = function(data){
			$scope.$emit('hideLoader');
			$scope.reservationData.reservation_card.room_id = '';
			$scope.reservationData.reservation_card.room_number = '';

			$scope.reservationData.reservation_card.room_status = '';
			$scope.reservationData.reservation_card.fo_status = '';
			$scope.reservationData.reservation_card.room_ready_status = '';					
			RVReservationCardSrv.updateResrvationForConfirmationNumber($scope.reservationData.reservation_card.confirmation_num, $scope.reservationData);
			updateSearchCache();
			$scope.backToStayCard();
				
		};
		
		//failujre call of un-assigningb rooms
		var failureCallBackOfUnAssignRoom = function(errorMessage){

			$scope.$emit('hideLoader');
			$scope.errorMessage = errorMessage;
		};

		$scope.invokeApi(RVRoomAssignmentSrv.UnAssignRoom, params, successCallbackOfUnAssignRoom, failureCallBackOfUnAssignRoom);
	};
		
	/**
	* function to assign the new room for the reservation
	*/
	$scope.assignRoom = function() {
		var successCallbackAssignRoom = function(data){
			$scope.$emit('hideLoader');			
			
			$scope.reservationData.reservation_card.room_id = $scope.assignedRoom.room_id;
			
			$scope.reservationData.reservation_card.room_status = $scope.assignedRoom.room_status;
			$scope.reservationData.reservation_card.fo_status = $scope.assignedRoom.fo_status;
			$scope.reservationData.reservation_card.room_ready_status = $scope.assignedRoom.room_ready_status;
			// CICO-7904 and CICO-9628 : update the upsell availability to staycard		
			$scope.reservationData.reservation_card.is_upsell_available = data.is_upsell_available?"true":"false";
			if(typeof $scope.selectedRoomType != 'undefined'){
				$scope.reservationData.reservation_card.room_type_description = $scope.selectedRoomType.description;
				$scope.reservationData.reservation_card.room_type_code = $scope.selectedRoomType.type;
			}			

			if(data.is_room_auto_assigned == true){

				$scope.roomAssignedByOpera = data.room;

				$scope.reservationData.reservation_card.room_number = data.room;

				ngDialog.open({
			          template: '/assets/partials/roomAssignment/rvRoomHasAutoAssigned.html',
			          controller: 'rvRoomAlreadySelectedCtrl',
			          className: 'ngdialog-theme-default',
			          scope: $scope
		        });
			} else {
				if($scope.clickedButton == "checkinButton"){
					$scope.$emit('hideLoader');
					$state.go('rover.reservation.staycard.billcard', {"reservationId": $scope.reservationData.reservation_card.reservation_id, "clickedButton": "checkinButton"});
				} else {
					$scope.$emit('hideLoader');
					$scope.backToStayCard();
				}
				$scope.reservationData.reservation_card.room_number = $scope.assignedRoom.room_number;
			}
			RVReservationCardSrv.updateResrvationForConfirmationNumber($scope.reservationData.reservation_card.confirmation_num, $scope.reservationData);
			setTimeout(function(){
				$scope.roomAssgnment.inProgress = false;	
				}, 
			3000);
			
		};
		var errorCallbackAssignRoom = function(error){
			$scope.$emit('hideLoader');
			$scope.roomAssgnment.inProgress = false;
			setTimeout(function(){
				ngDialog.open({
			          template: '/assets/partials/roomAssignment/rvRoomHasAlreadySelected.html',
			          controller: 'rvRoomAlreadySelectedCtrl',
			          className: 'ngdialog-theme-default',
			          scope: $scope
		        });
			}, 700);
		
			
			
			//$scope.errorMessage = error;
		};
		var params = {};
		params.reservation_id = parseInt($stateParams.reservation_id, 10);
		params.room_number = $scope.assignedRoom.room_number;
		params.without_rate_change = $scope.roomTransfer.withoutRateChange;
		params.new_rate_amount = $scope.roomTransfer.newRoomRateChange;
		$scope.roomAssgnment.inProgress = true;
		$scope.invokeApi(RVRoomAssignmentSrv.assignRoom, params, successCallbackAssignRoom, errorCallbackAssignRoom);
	};
	$scope.goToNextView = function(){

		if($scope.clickedButton == "checkinButton"){
			$scope.$emit('hideLoader');
			$state.go('rover.reservation.staycard.billcard', {"reservationId": $scope.reservationData.reservation_card.reservation_id, "clickedButton": "checkinButton"});
		} else {
			$scope.$emit('hideLoader');
			$scope.backToStayCard();
		}
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
			$scope.reservationData.reservation_card.room_id = data.room_id;
			$scope.reservationData.reservation_card.room_number = data.room_no;
			$scope.reservationData.reservation_card.room_type_description = data.room_type_name;
			$scope.reservationData.reservation_card.room_type_code = data.room_type_code;
			$scope.reservationData.reservation_card.room_status = "READY";
			$scope.reservationData.reservation_card.fo_status = "VACANT";
			$scope.reservationData.reservation_card.room_ready_status = "INSPECTED";
			// CICO-7904 and CICO-9628 : update the upsell availability to staycard			
			$scope.reservationData.reservation_card.is_upsell_available = data.is_upsell_available?"true":"false";
			RVReservationCardSrv.updateResrvationForConfirmationNumber($scope.reservationData.reservation_card.confirmation_num, $scope.reservationData);
			if($scope.clickedButton == "checkinButton"){
				$state.go('rover.reservation.staycard.billcard', {"reservationId": $scope.reservationData.reservation_card.reservation_id, "clickedButton": "checkinButton"});
			} else {
				$scope.backToStayCard();
			}			
	});

	/**
	* function to go back to reservation details
	*/
	$scope.backToStayCard = function(){
		
		$state.go("rover.reservation.staycard.reservationcard.reservationdetails", {id:$scope.reservationData.reservation_card.reservation_id, confirmationId:$scope.reservationData.reservation_card.confirmation_num ,isrefresh: false});
		
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
		var reservationStatus = $scope.reservationData.reservation_card.reservation_status;
		var roomReadyStatus = $scope.reservationData.reservation_card.room_ready_status; 
		var foStatus = $scope.reservationData.reservation_card.fo_status;
		var checkinInspectedOnly = $scope.reservationData.reservation_card.checkin_inspected_only;
		return getMappedRoomStatusColor(reservationStatus, roomReadyStatus, foStatus, checkinInspectedOnly);
	};

	$scope.getNotReadyRoomTag = function(room){
		if(!room.is_in_future) {
			if(room.room_ready_status == "PICKUP" || room.room_ready_status == "CLEAN"){
				return room.room_ready_status;
			}else{
				return room.fo_status;
			}
		} else {
			return "";
		}
	};

	$scope.getRoomStatusClassForRoom = function(room){

		
		if(room.is_oos){
			return "room-grey";
		}

		var reservationRoomStatusClass = "";

		//CICO-9063 no need to show the color coding if future reservation
		if($scope.reservationData.reservation_card.reservation_status === 'RESERVED'){
			return reservationRoomStatusClass;
		}

		var roomReadyStatus = room.room_ready_status;
		var foStatus = room.fo_status;
		var checkinInspectedOnly = room.checkin_inspected_only;
	    if(roomReadyStatus!=''){
				if(foStatus == 'VACANT'){
					switch(roomReadyStatus) {

						case "INSPECTED":
							reservationRoomStatusClass = ' room-green';
							break;
						case "CLEAN":
							if (checkinInspectedOnly == "true") {
								reservationRoomStatusClass = ' room-orange';
								break;
							} else {
								reservationRoomStatusClass = ' room-green';
								break;
							}
							break;
						case "PICKUP":
							reservationRoomStatusClass = " room-orange";
							break;
			
						case "DIRTY":
							reservationRoomStatusClass = " room-red";
							break;

		        }
				
				} else {
					reservationRoomStatusClass = "room-red";
				}
				
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
		//CICO-9063 we should not show Not Ready and Due Out filter if future reservation
		if($scope.reservationData.reservation_card.reservation_status !== 'RESERVED'){
			var item1 = {};
			item1.id = -100;
			item1.name = $filter('translate')('INCLUDE_NOTREADY_LABEL');
			item1.selected = false;
			var item2 = {};
			item2.id = -101;
			item2.name = $filter('translate')('INCLUDE_DUEOUT_LABEL');
			item2.selected = false;
		}
		
		var item3 = {};
		item3.id = -102;
		item3.name = $filter('translate')('INCLUDE_PREASSIGNED_LABEL');
		item3.selected = false;
		var item4 = {};
		item4.id = -103;
		item4.name = $filter('translate')('INCLUDE_CLEAN_LABEL');
		item4.selected = false;
		//CICO-9063 we should not show Not Ready and Due Out filter if future reservation
		if($scope.reservationData.reservation_card.reservation_status !== 'RESERVED'){
			group.items.push(item1);
			group.items.push(item2);
		}
		group.items.push(item3);
		if($scope.rooms.length > 0 && $scope.rooms[0].checkin_inspected_only == "true"){
			group.items.push(item4);
		}
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
					if($scope.selectedFiltersList[j] != -100 && $scope.selectedFiltersList[j] != -101 && $scope.selectedFiltersList[j] != -102 && $scope.selectedFiltersList[j] != -103){
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
		var includeClean = false;
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

		if($scope.selectedFiltersList.indexOf(-103) != -1){
			includeClean = true;
			$scope.selectedFiltersList.splice($scope.selectedFiltersList.indexOf(-103), 1);
		}
			
		if($scope.filteredRooms.length == 0 && $scope.selectedFiltersList.length == 0)
			$scope.filteredRooms = roomsWithInitialFilters;
		
		if(includeNotReady)
			$scope.includeNotReadyRooms();
		if(includeDueOut)
			$scope.includeDueoutRooms();
		if(includePreAssigned)
			$scope.includePreAssignedRooms(); 
		if(includeClean)
			$scope.includeClean();
		if($scope.floorFilterData&&!$scope.floorFilterData.isNoFloorSelected){
			$scope.includeFloorFilter();			
		}

	};

	$scope.getRoomsWithInitialFilters = function(){	
		var roomsWithInitialFilters = [];

		//CICO-9063 we will display all vacant rooms for a future reservation
		if($scope.reservationData.reservation_card.reservation_status === 'RESERVED'){
			for (var i = 0; i < $scope.rooms.length; i++) {
				if($scope.rooms[i].fo_status == "VACANT" && !$scope.rooms[i].is_preassigned){
					roomsWithInitialFilters.push($scope.rooms[i]);
				}
			};
			return roomsWithInitialFilters;
		}
		for (var i = 0; i < $scope.rooms.length; i++) {
			if($scope.rooms[i].room_status == "READY" && $scope.rooms[i].fo_status == "VACANT" && !$scope.rooms[i].is_preassigned){
				if($scope.rooms[i].checkin_inspected_only == "true" && $scope.rooms[i].room_ready_status == "INSPECTED"){
					roomsWithInitialFilters.push($scope.rooms[i]);
				}else if($scope.rooms[i].checkin_inspected_only == "false"){
					roomsWithInitialFilters.push($scope.rooms[i]);
				}
				
			}				
		};
		return roomsWithInitialFilters;
	};

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

	$scope.includeClean = function(){
		for(var i = 0; i < $scope.rooms.length; i++){
			if($scope.rooms[i].room_features.indexOf(-103) != -1)
				$scope.addToFilteredRooms($scope.rooms[i]);
		}
	};
	$scope.includeFloorFilter = function(){
		var roomsInSelectedFloor;
			var tempfilteredRooms=[];			
					$scope.floors.forEach(function(element){
					if(element.id==$scope.floorFilterData.selectedFloorId){								
							roomsInSelectedFloor=element.room_ids;
						}
					});	
					if(typeof roomsInSelectedFloor != 'undefined'){				
					$scope.filteredRooms.forEach(function(element){
						roomsInSelectedFloor.map(function(x){
								if(element.room_id==x){
									tempfilteredRooms.push(element);
								}
						});

					});
				}
					$scope.filteredRooms=tempfilteredRooms;					
			
	}

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
	};
	/**
	* function to return the rooms list status
	*/
	$scope.isRoomListEmpty = function(){
		return ($scope.filteredRooms.length == 0);
	};
	/**
	* function to add ids for predefined filters checking the corresponding status
	*/
	$scope.setRoomsListWithPredefinedFilters = function(){
		for(var i = 0; i < $scope.rooms.length; i++){
			if($scope.rooms[i].room_status == "NOTREADY" && $scope.rooms[i].fo_status == "VACANT" && $scope.rooms[i].room_ready_status != "CLEAN" && $scope.rooms[i].room_ready_status != "INSPECTED")
				$scope.rooms[i].room_features.push(-100);
			if($scope.rooms[i].fo_status == "DUEOUT")
				$scope.rooms[i].room_features.push(-101);
			if($scope.rooms[i].is_preassigned)
				$scope.rooms[i].room_features.push(-102);
			if($scope.rooms[i].fo_status == "VACANT" && $scope.rooms[i].room_ready_status == "CLEAN" && $scope.rooms[i].checkin_inspected_only == "true")
				$scope.rooms[i].room_features.push(-103);

		}
	};
	$scope.init = function(){

		$scope.roomTypes = roomPreferences.room_types;
		$scope.roomFeatures = roomPreferences.room_features;
		$scope.rooms = roomsList.rooms;
		$scope.floors = roomPreferences.floors.floor_details;
		$scope.reservationData = $scope.$parent.reservation;
		$scope.addPredefinedFilters();
		$scope.setSelectedFiltersList();
		$scope.reservation_occupancy = roomsList.reservation_occupancy;
		$scope.setRoomsListWithPredefinedFilters();
		$scope.applyFilterToRooms();
		$scope.clickedButton = $stateParams.clickedButton;
		$scope.assignedRoom = "";
		
		oldRoomType = $scope.roomType = $stateParams.room_type; 
		$scope.isStandAlone = $rootScope.isStandAlone;
		$scope.isFiltersVisible = false;
		$scope.$emit('HeaderChanged', $filter('translate')('ROOM_ASSIGNMENT_TITLE'));
		$scope.roomTransfer.oldRoomNumber = $scope.reservationData.reservation_card.room_number;
		$scope.roomTransfer.oldRoomType = $scope.reservationData.reservation_card.room_type_description;
	};
	$scope.init();
	/**
	* function to handle floor filter.
	*/
	$scope.applyFloorFilter = function(floorFilterData){
		$scope.floorFilterData =floorFilterData;
		$scope.setSelectedFiltersList();
		$scope.applyFilterToRooms();		
	}
	/**
	* function to determine whether to show unassignroom
	*/
	$scope.showUnAssignRoom = function() {
		var r_data = $scope.reservationData.reservation_card;
		return (r_data.reservation_status.indexOf(['CHECKING_IN', 'RESERVED']) && 
			!!r_data.room_number && 
			$rootScope.isStandAlone && 
			!$scope.roomAssgnment.inProgress &&
			!r_data.is_hourly_reservation &&
			r_data.reservation_status!="CHECKEDIN");
	};
}]);