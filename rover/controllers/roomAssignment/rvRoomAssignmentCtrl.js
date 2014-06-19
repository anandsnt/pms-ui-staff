
sntRover.controller('RVroomAssignmentController',['$scope','$state', '$stateParams', 'RVRoomAssignmentSrv', function($scope, $state, $stateParams, RVRoomAssignmentSrv){
	console.log("room assignment");
	// $scope.parentObj.slide = 'slide-right';
	BaseCtrl.call(this, $scope);
	
	$scope.rooms = [];
	$scope.roomTypes = [];
	$scope.roomFeatures = [];

	$scope.reservationData = $scope.$parent.reservation;
	$scope.roomType = $stateParams.room_type;
	$scope.isFiltersVisible = false;

	$scope.getRooms = function(){
		var successCallbackGetRooms = function(data){
			$scope.rooms = data;
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
	$scope.getRooms();

	$scope.$parent.myScrollOptions = {		
	    'roomlist': {
	    	scrollbars: true,
	        snap: false,
	        hideScrollbar: false,
	        preventDefault: false
	    }
	};	
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
	
}]);