sntRover.controller('rvRoomAvailabilityGridStatusController', [
	'$scope',
	'rvAvailabilitySrv',
	function($scope, rvAvailabilitySrv){

		BaseCtrl.call(this, $scope);

		$scope.hideMeBeforeFetching = false;
		$scope.showRoomTypeWiseAvailableRooms = false;
		$scope.showRoomTypeWiseBookedRooms = false;


		$scope.data = rvAvailabilitySrv.getGridData();

		//if already fetched we will show without calling the API
		if(!isEmptyObject($scope.data)){
			$scope.refreshScroller('room_availability_scroller');
			$scope.hideMeBeforeFetching = true;
			$scope.$emit("hideLoader");
		}

		//we need horizonat scroller so adding option 'scrollX', also need to get the click event on toggling button on available room
		var scrollerOptions = {scrollX: true, preventDefault: false};
  		$scope.setScroller ('room_availability_scroller', scrollerOptions);

		$scope.$on('$includeContentLoaded', function(event){
			$scope.$emit("hideLoader");
			$scope.refreshScroller('room_availability_scroller');
		});

		/**
		* when data changed from super controller, it will broadcast an event 'changedRoomAvailableData'
		*/
		$scope.$on("changedRoomAvailableData", function(event){
			$scope.data = rvAvailabilitySrv.getGridData();
			$scope.refreshScroller('room_availability_scroller');
			$scope.hideMeBeforeFetching = true;
			$scope.$emit("hideLoader");
		});

		/*
		* function to toggle the display of individual room type booked list on clicking
		* the toogle button
		*/
		$scope.toggleShowRoomTypeWiseBookedRooms = function(){
			$scope.showRoomTypeWiseBookedRooms  = !$scope.showRoomTypeWiseBookedRooms;
			$scope.refreshScroller('room_availability_scroller');
		};


		/*
		* function to toggle the display of individual room type available list on clicking
		* the toogle button
		*/
		$scope.toggleShowRoomTypeWiseAvailableRooms = function(){
			$scope.showRoomTypeWiseAvailableRooms  = !$scope.showRoomTypeWiseAvailableRooms;
			$scope.refreshScroller('room_availability_scroller');
		};

		/*
		* function to toggle the display of individual group/allotmet on clicking
		* the toogle button
		*/
		$scope.toggleShowGroupAllotmentBreakdown = function() {
			$scope.showRoomTypeWiseBookedRooms  = !$scope.showRoomTypeWiseBookedRooms;
			$scope.refreshScroller('room_availability_scroller');

			// do something
			// call indiviual

			somesrv.fetchGroupAndAllotmentAvailabilityDetails()
		};


		/**
		 * For iScroll, we need width of the table
		 * @return {Integer}
		 */
		$scope.getWidthForTable = function() {

			var leftMostRowCaptionWidth = 130, // 120px cell width + 10px cell spacing
				totalColumns = $scope.data && $scope.data.dates && $scope.data.dates.length,
				individualColWidth = 60; // 55px cell width + 5px cell spacing

			if (!_.has($scope.data, 'dates') && totalColumns < 30) {
				return 0;
			};

			if (totalColumns == 30) {
				return 'width:' + (totalColumns * individualColWidth + leftMostRowCaptionWidth) + 'px';
			}
		};

	}
]);