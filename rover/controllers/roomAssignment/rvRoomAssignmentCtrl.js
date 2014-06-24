
sntRover.controller('RVroomAssignmentController',['$scope','$state', '$stateParams', 'RVRoomAssignmentSrv', '$filter', 'RVReservationCardSrv', function($scope, $state, $stateParams, RVRoomAssignmentSrv, $filter, RVReservationCardSrv){
		
	BaseCtrl.call(this, $scope);
	
	$scope.rooms = [];
	$scope.isRoomsFetched = false;
	$scope.filteredRooms = [];
	$scope.roomTypes = [];
	$scope.roomFeatures = [];
	$scope.selectedFiltersList = [];

	$scope.assignedRoom = "";
	$scope.reservationData = $scope.$parent.reservation;
	$scope.roomType = $stateParams.room_type;
	$scope.isFiltersVisible = false;

	/**
	* function to to get the rooms based on the selected room type
	*/
	$scope.getRooms = function(){
		var successCallbackGetRooms = function(data){
			$scope.rooms = data;
			$scope.setRoomsListWithPredefinedFilters();
			$scope.applyFilterToRooms();
			$scope.$emit('hideLoader');
			$scope.isRoomsFetched = true;
			setTimeout(function(){
				$scope.$parent.myScroll['roomlist'].refresh();
				$scope.$parent.myScroll['filterlist'].refresh();
				}, 
			3000);
		};
		var errorCallbackGetRooms = function(error){
			$scope.$emit('hideLoader');
			$scope.errorMessage = error;
			$scope.isRoomsFetched = true;
		};
		var params = {};
		params.reservation_id = $stateParams.reservation_id;
		params.room_type = $scope.roomType;
		$scope.invokeApi(RVRoomAssignmentSrv.getRooms, params, successCallbackGetRooms, errorCallbackGetRooms);

	};
	/**
	* function to get the room types and room features
	*/
	$scope.getPreferences = function(){
		var successCallbackGetPreferences = function(data){
			$scope.roomTypes = data.room_types;
			$scope.roomFeatures = data.room_features;
			$scope.addPredefinedFilters();
			$scope.setSelectedFiltersList();
			$scope.$broadcast('roomFeaturesLoaded', $scope.roomFeatures);
			$scope.getRooms();
			$scope.$emit('hideLoader');
		};
		var errorCallbackGetPreferences = function(error){
			$scope.$emit('hideLoader');
			$scope.errorMessage = error;
		};
		var params = {};
		params.reservation_id = $stateParams.reservation_id;
		$scope.invokeApi(RVRoomAssignmentSrv.getPreferences, params, successCallbackGetPreferences, errorCallbackGetPreferences);

	};
	/**
	* function to assign the new room for the reservation
	*/
	$scope.assignRoom = function(index){
		var successCallbackAssignRoom = function(data){
			$scope.reservationData.reservation_card.room_number = $scope.assignedRoom;
			RVReservationCardSrv.updateResrvationForConfirmationNumber($scope.reservationData.reservation_card.confirmation_num, $scope.reservationData);
			$scope.backToStayCard();
			$scope.$emit('hideLoader');
		};
		var errorCallbackAssignRoom = function(error){
			$scope.$emit('hideLoader');
			$scope.errorMessage = error;
		};
		var params = {};
		params.reservation_id = parseInt($stateParams.reservation_id, 10);
		params.room_number = parseInt($scope.rooms[index].room_number, 10);
		$scope.assignedRoom = params.room_number;
		$scope.invokeApi(RVRoomAssignmentSrv.assignRoom, params, successCallbackAssignRoom, errorCallbackAssignRoom);
	};
	$scope.getPreferences();

	/**
	* setting the scroll options for the room list
	*/
	$scope.$parent.myScrollOptions = {		
	    'roomlist': {
	    	scrollbars: true,
	        snap: false,
	        hideScrollbar: false,
	        preventDefault: false
	    },
	    'filterlist': {
	    	scrollbars: true,
	        snap: false,
	        hideScrollbar: false,
	        preventDefault: false
	    }
	};	
	/**
	* Listener to update the room list when the filters changes
	*/
	$scope.$on('roomFeaturesUpdated', function(event, data){
			$scope.roomFeatures = data;
			$scope.setSelectedFiltersList();
			$scope.applyFilterToRooms();
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
		for(var i = 0; i < $scope.rooms.length; i++){
			var flag = true;
			for(var j = 0; j < $scope.selectedFiltersList.length; j++){
				if($scope.rooms[i].room_features.indexOf($scope.selectedFiltersList[j]) == -1)
					flag = false;
			}
			if(flag)
				$scope.addToFilteredRooms($scope.rooms[i]);
		}
		
		if($scope.filteredRooms.length == 0 && $scope.selectedFiltersList.length == 0)
			$scope.filteredRooms = $scope.rooms;
	};
	/**
	* function to add the rooms to filtered list, handling the duplication
	*/
	$scope.addToFilteredRooms = function(room){
		var flag = false;
			for(var j = 0; j < $scope.filteredRooms.length; j++){
				if(room.room_number == $scope.filteredRooms[j].room_number)
					flag = true;
			}
			if(!flag)
				$scope.filteredRooms.push(room);
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
		return ($scope.filteredRooms.length == 0 && $scope.isRoomsFetched);
	}
	/**
	* function to add ids for predefined filters checking the corresponding status
	*/
	$scope.setRoomsListWithPredefinedFilters = function(){
		for(var i = 0; i < $scope.rooms.length; i++){
			if($scope.rooms[i].room_status == "NOTREADY")
				$scope.rooms[i].room_features.push(-100);
			if($scope.rooms[i].fo_status == "DUEOUT")
				$scope.rooms[i].room_features.push(-101);
			if($scope.rooms[i].is_preassigned)
				$scope.rooms[i].room_features.push(-102);
		}
	}
	
}]);