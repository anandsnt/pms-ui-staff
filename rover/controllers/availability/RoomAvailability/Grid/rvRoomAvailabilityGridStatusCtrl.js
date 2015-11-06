sntRover.controller('rvRoomAvailabilityGridStatusController', [
	'$scope',
	'rvAvailabilitySrv',
	'$timeout',
	function($scope, rvAvailabilitySrv, $timeout){

		BaseCtrl.call(this, $scope);

		var init = function(){
			$scope.hideMeBeforeFetching = false;
			initToggleStatus();
			$scope.data = rvAvailabilitySrv.getGridData();

			//we need horizonat scroller so adding option 'scrollX', also need to get the click event on toggling button on available room
			var scrollerOptions = {scrollX: true, preventDefault: false};
  			$scope.setScroller ('room_availability_scroller', scrollerOptions);

  			//if already fetched we will show without calling the API
			if(!isEmptyObject($scope.data)){
				$scope.refreshScroller('room_availability_scroller');
				$scope.hideMeBeforeFetching = true;
				$scope.$emit("hideLoader");
			}
		};
		/*
		* Function to set all toggle to close
		*/
		var initToggleStatus = function(){			
			$scope.toggleStatusOf = {};
			$scope.toggleStatusOf['availableRooms'] = false;
			$scope.toggleStatusOf['roomsSold'] = false;
			$scope.toggleStatusOf['occupancy'] = false;
			$scope.toggleStatusOf['roomInventory'] = false;
		};

		$scope.toggle = function(source){
			$scope.toggleStatusOf[source] = !$scope.toggleStatusOf[source];
			//fetches additional data if not available.
			if(!isFullDataAvaillable()){
				$scope.$parent.fetchAdditionalData();
			};
			$scope.refreshScroller('room_availability_scroller');
		};

		$scope.$on('$includeContentLoaded', function(event){
			$scope.$emit("hideLoader");
			$scope.refreshScroller('room_availability_scroller');
		});
		/*
		*  Checks whether additional data available or not
		*/
		var isFullDataAvaillable = function(){
			return $scope.data.hasOwnProperty('additionalData');
		};

		/**
		* when data changed from super controller, it will broadcast an event 'changedRoomAvailableData'
		*/
		$scope.$on("changedRoomAvailableData", function(event){
			$scope.data = rvAvailabilitySrv.getGridData();
			if(!isFullDataAvaillable()){
				initToggleStatus();
			}
			$scope.refreshScroller('room_availability_scroller');
			$scope.hideMeBeforeFetching = true;
			$scope.$emit("hideLoader");
		});

		$scope.$on('changedGrpNAllotData', function() {
			$scope.data.gridDataForGroupAvailability     = rvAvailabilitySrv.getGridDataForGroupAvailability();
			$scope.data.gridDataForAllotmentAvailability = rvAvailabilitySrv.getGridDataForAllotmentAvailability();

			$scope.showShowGroupAllotmentTotals = true;

			$scope.refreshScroller('room_availability_scroller');
			$scope.$emit("hideLoader");
		});

		/*
		* function to toggle the display of individual group/allotmet on clicking
		* the toogle button
		*/
		$scope.toggleShowGroupAllotmentTotals = function() {
			if ( $scope.showShowGroupAllotmentTotals ) {
				$scope.showShowGroupAllotmentTotals = false;
				$scope.refreshScroller('room_availability_scroller');
			} else {
				$scope.$parent.fetchGrpNAllotData();
			};
		};

		/*
		* param - Holdstatus id
		* return Hold status name
		*/
		$scope.getGroupAllotmentName = function(source, id){
			var found = _.findWhere(source.holdStatus, {id: id});
			return found && found.name;
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
				return (totalColumns * individualColWidth + leftMostRowCaptionWidth);
			}
		};

		init();

	}
]);