sntRover.controller('rvRoomAvailabilityGridStatusController', [
	'$scope',
	'rvAvailabilitySrv',
	'$timeout',
	function($scope, rvAvailabilitySrv, $timeout){

		BaseCtrl.call(this, $scope);

		var init = function(){
			$scope.hideMeBeforeFetching = false;
			$scope.toggleStatusOf = {};
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

		var initToggleStatus = function(){
			$scope.toggleStatusOf['availableRooms'] = false;
			$scope.toggleStatusOf['roomsSold'] = false;
			$scope.toggleStatusOf['occupancy'] = false;
			$scope.toggleStatusOf['roomInventory'] = false;
		};

		$scope.toggle = function(source){
			$scope.toggleStatusOf[source] = !$scope.toggleStatusOf[source];

			if( 'occupancy' != source && 'roomInventory' != source && !isFullDataAvaillable() ){
				$scope.$parent.fetchAdditionalData();
			};

			$scope.refreshScroller('room_availability_scroller');
		};

		$scope.$on('$includeContentLoaded', function(event){
			$scope.$emit("hideLoader");
			$scope.refreshScroller('room_availability_scroller');
		});

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

		/*
		* function to toggle the display of individual group/allotmet on clicking
		* the toogle button
		*/
		$scope.toggleShowGroupAllotmentTotals = function() {
			var gridDataForGroupAvailability     = rvAvailabilitySrv.data.hasOwnProperty( 'gridDataForGroupAvailability' ),
				gridDataForAllotmentAvailability = rvAvailabilitySrv.data.hasOwnProperty( 'gridDataForAllotmentAvailability' );

			var success = function() {
				$scope.data.gridDataForGroupAvailability     = rvAvailabilitySrv.getGridDataForGroupAvailability();
				$scope.data.gridDataForAllotmentAvailability = rvAvailabilitySrv.getGridDataForAllotmentAvailability();

				$timeout(function() {
					$scope.$emit( 'hideLoader' );
					$scope.showShowGroupAllotmentTotals = true;
					$scope.refreshScroller('room_availability_scroller');
				}, 100);
			};

			var failed = function() {
				$scope.refreshScroller('room_availability_scroller');
				$scope.$emit( 'hideLoader' );
			};

			var isSameData = function() {
				var newParams = $scope.$parent.getDateParams(),
					oldParams = $scope.oldDateParams || { 'from_date': '', 'to_date': '' };

				return newParams.from_date == oldParams.from_date && newParams.to_date == oldParams.to_date;
			};

			if ( $scope.showShowGroupAllotmentTotals ) {
				$scope.showShowGroupAllotmentTotals = false;
				$scope.refreshScroller('room_availability_scroller');
			} else {
				if ( isSameData() ) {
					success();
				} else {
					$scope.oldDateParams = $scope.$parent.getDateParams();
					$scope.invokeApi(rvAvailabilitySrv.fetchGrpNAllotAvailDetails, $scope.oldDateParams, success, failed);
				};
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
				return 'width:' + (totalColumns * individualColWidth + leftMostRowCaptionWidth) + 'px';
			}
		};

		init();

	}
]);