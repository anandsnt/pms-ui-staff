sntRover.controller('rvRoomAvailabilityGridStatusController', [
	'$scope', 
	'$timeout', 
	'rvAvailabilitySrv', 
	function($scope, $timeout, rvAvailabilitySrv){

		BaseCtrl.call(this, $scope);

		$scope.hideMeBeforeFetching = false;
		$scope.showRoomTypeWiseAvailableRooms = false;

		$scope.data = rvAvailabilitySrv.getData();

		var scrollerOptions = {scrollX: true};
  		$scope.setScroller('room_availability_scroller', scrollerOptions);

		$scope.$on('$includeContentLoaded', function(event){
			$scope.$emit("hideLoader");
			$scope.refreshScroller('room_availability_scroller');
		});

		$scope.$on("changedRoomAvailableData", function(event){
			$scope.data = rvAvailabilitySrv.getData();
			$scope.refreshScroller('room_availability_scroller');
			$scope.hideMeBeforeFetching = true;
		});

		

		$scope.toggleShowRoomTypeWiseAvailableRooms = function(){
			$scope.showRoomTypeWiseAvailableRooms  = !$scope.showRoomTypeWiseAvailableRooms ;
			$scope.refreshScroller('room_availability_scroller');
		}

	}
]);