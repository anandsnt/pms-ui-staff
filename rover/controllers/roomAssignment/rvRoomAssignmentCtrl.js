
sntRover.controller('RVroomAssignmentController',['$scope','$state', '$stateParams', 'RVRoomAssignmentSrv', function($scope, $state, $stateParams, RVRoomAssignmentSrv){
	console.log("room assignment");
	// $scope.parentObj.slide = 'slide-right';
	BaseCtrl.call(this, $scope);
	$scope.backToStayCard = function(){
		
		$state.go("rover.staycard.reservationcard.reservationdetails");
		
	};
	$scope.rooms = [];
	$scope.roomTypes = [];
	$scope.roomFeatures = [];

	$scope.reservationData = $scope.$parent.reservation;

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
		params.room_type = $stateParams.room_type;
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
	$scope.getPreferences();
	$scope.getRooms();

	$scope.$parent.myScrollOptions = {		
	    'roomlist': {
	    	scrollbars: true,
	        snap: false,
	        hideScrollbar: false,
	        preventDefault: false
	    },
	};
	
	
}]);