
sntRover.controller('RVUpgradesCtrl',['$scope','$state', '$stateParams', 'RVRoomAssignmentSrv', function($scope, $state, $stateParams, RVRoomAssignmentSrv){
	
	BaseCtrl.call(this, $scope);
	
	$scope.$parent.myScrollOptions = {		
	    'upgradesView': {
	    	scrollbars: true,
	        snap: false,
	        hideScrollbar: false,
	        preventDefault: false
	    }
	};
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
	$scope.getRooms();
	// setTimeout(function(){
	// 			$scope.$parent.myScroll['upgradesView'].refresh();
	// 			}, 
	// 		3000);
	
	
}]);