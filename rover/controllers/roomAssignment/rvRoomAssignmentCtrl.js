
sntRover.controller('RVroomAssignmentController',['$scope','$state', '$stateParams', 'RVRoomAssignmentSrv', function($scope, $state, $stateParams, RVRoomAssignmentSrv){
	console.log("room assignment");
	// $scope.parentObj.slide = 'slide-right';
	BaseCtrl.call(this, $scope);
	
	$scope.rooms = [];
	$scope.filteredRooms = [];
	$scope.roomTypes = [];
	$scope.roomFeatures = [];
	$scope.selectedFiltersList = [];

	$scope.reservationData = $scope.$parent.reservation;
	$scope.roomType = $stateParams.room_type;
	$scope.isFiltersVisible = false;

	$scope.getRooms = function(){
		var successCallbackGetRooms = function(data){
			$scope.rooms = data;
			$scope.rooms[0].room_features.push(48);
			$scope.rooms[1].room_features.push(102);
			$scope.applyFilterToRooms();
			$scope.$emit('hideLoader');
			setTimeout(function(){
				$scope.$parent.myScroll['roomlist'].refresh();
				}, 
			3000);
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
	$scope.assignRoom = function(index){
		var successCallbackAssignRoom = function(data){
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
		$scope.invokeApi(RVRoomAssignmentSrv.assignRoom, params, successCallbackAssignRoom, errorCallbackAssignRoom);
	};
	$scope.getPreferences();

	$scope.$parent.myScrollOptions = {		
	    'roomlist': {
	    	scrollbars: true,
	        snap: false,
	        hideScrollbar: false,
	        preventDefault: false
	    }
	};	
	$scope.$on('roomFeaturesUpdated', function(event, data){
			$scope.roomFeatures = data;
			$scope.setSelectedFiltersList();
			$scope.applyFilterToRooms();
	});
	$scope.backToStayCard = function(){
		
		$state.go("rover.staycard.reservationcard.reservationdetails", {id:$scope.reservationData.reservation_card.reservation_id, confirmationId:$scope.reservationData.reservation_card.confirmation_num});
		
	};
	$scope.toggleFiltersView = function(){
		$scope.isFiltersVisible = !$scope.isFiltersVisible;
	};
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
	$scope.setNightsText = function(){
		return ($scope.reservationData.reservation_card.total_nights == 1)?"night":"nights";
	};
	$scope.isUpsellAvailable = function(){
		var showUpgrade = false;
		if(($scope.reservationData.reservation_card.isUpsellAvailable == 'true') && ($scope.reservationData.reservation_card.reservationStatus == 'RESERVED' || $scope.reservationData.reservation_card.reservationStatus == 'CHECKING_IN')){
			showUpgrade = true;
		}
		return showUpgrade;
	};
	$scope.addPredefinedFilters = function(){
		var group = {};
		group.group_name = "predefined";
		group.multiple_allowed = true;
		group.items = [];
		var item1 = {};
		item1.id = -1;
		item1.name = "Include Not Ready";
		item1.selected = false;
		var item2 = {};
		item2.id = -1;
		item2.name = "Include Due Out";
		item2.selected = false;
		var item3 = {};
		item3.id = -1;
		item3.name = "Include Pre-Assigned";
		item3.selected = false;
		group.items.push(item1);
		group.items.push(item2);
		group.items.push(item3);
		$scope.roomFeatures.splice(0, 0, group);
	};
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
	$scope.addToFilteredRooms = function(room){
		var flag = false;
			for(var j = 0; j < $scope.filteredRooms.length; j++){
				if(room.room_number == $scope.filteredRooms[j].room_number)
					flag = true;
			}
			if(!flag)
				$scope.filteredRooms.push(room);
	};
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
	$scope.isRoomListEmpty = function(){
		return ($scope.filteredRooms.length == 0);
	}
	
}]);