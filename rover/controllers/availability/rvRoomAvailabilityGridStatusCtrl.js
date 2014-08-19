sntRover.controller('rvRoomAvailabilityGridStatusController', [
	'$scope', 
	'$timeout', 
	'rvAvailabilitySrv', 
	function($scope, $timeout, rvAvailabilitySrv){

		BaseCtrl.call(this, $scope);

		$scope.hideMeBeforeFetching = false;
		$scope.showRoomTypeWiseAvailableRooms = false;

		$scope.data = rvAvailabilitySrv.getData();

		if(!isEmptyObject($scope.data)){
			$scope.refreshScroller('room_availability_scroller');
			$scope.hideMeBeforeFetching = true;			
			$scope.$emit("hideLoader");
		}

		var scrollerOptions = {scrollX: true, click: true, preventDefault: false};
  		$scope.setScroller ('room_availability_scroller', scrollerOptions);

		$scope.$on('$includeContentLoaded', function(event){
			$scope.$emit("hideLoader");
			$scope.refreshScroller('room_availability_scroller');
		});

		$scope.$on("changedRoomAvailableData", function(event){			
			$scope.data = rvAvailabilitySrv.getData();
			$scope.refreshScroller('room_availability_scroller');
			$scope.hideMeBeforeFetching = true;
			$scope.$emit("hideLoader");
		});

		

		$scope.toggleShowRoomTypeWiseAvailableRooms = function(){
			$scope.showRoomTypeWiseAvailableRooms  = !$scope.showRoomTypeWiseAvailableRooms ;
			$scope.refreshScroller('room_availability_scroller');
		}

	}
]);