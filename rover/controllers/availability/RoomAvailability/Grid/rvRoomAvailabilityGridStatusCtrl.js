angular.module('sntRover').controller('rvRoomAvailabilityGridStatusController', [
	'$scope',
	'rvAvailabilitySrv',
	'$rootScope',
	function($scope, rvAvailabilitySrv, $rootScope){

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

        //-------------------------------------------------------------------------------------------------------------- GRID DETAILED VIEW
        /**
         * NOTE: The below three methods handle the Expanded view of the Availability Grid
         * To start with A. Occupancy B. Available Rooms C. Rooms Sold are collapsed
         * The data required to show these sections are catered through different APIs.
         */

		$scope.toggleOccupancy = function() {

			// This detailed view needs ONLY additionalData.bestAvailabilityRate
			if (!$scope.toggleStatusOf['occupancy'] &&
				(!$scope.data.additionalData || !$scope.data.additionalData.bestAvailabilityRate)) {
				$scope.callAPI(rvAvailabilitySrv.fetchBARs, {
					params: $scope.getDateParams(),
					successCallBack: function() {
						handleDataChange();
						$scope.toggleStatusOf['occupancy'] = true;
					}
				});
			} else {
				$scope.toggleStatusOf['occupancy'] = !$scope.toggleStatusOf['occupancy'];
				$scope.refreshScroller('room_availability_scroller');
			}
		};

        $scope.toggleAvailableRooms = function(){
            // This detailed view needs ONLY additionalData.roomTypeWiseDetails
            if(!$scope.toggleStatusOf['availableRooms'] &&
                (!$scope.data.additionalData || !$scope.data.additionalData.roomTypeWiseDetails)) {
                // get Room Type wise details
                $scope.callAPI(rvAvailabilitySrv.getRoomsAvailability, {
                    params: $scope.getDateParams(),
                    successCallBack: function(){
                        handleDataChange();
                        $scope.toggleStatusOf['availableRooms'] = true;
                    }
                });
            }else{
                $scope.toggleStatusOf['availableRooms'] = !$scope.toggleStatusOf['availableRooms'];
                $scope.refreshScroller('room_availability_scroller');
            }
        };

        $scope.toggleSoldRooms = function(){
            // This detailed view needs additionalData.adultsChildrenCounts AND additionalData.roomTypeWiseDetails
            if(!$scope.toggleStatusOf['roomsSold'] &&
                (!$scope.data.additionalData ||
                !$scope.data.additionalData.adultsChildrenCounts ||
                !$scope.data.additionalData.roomTypeWiseDetails)){
                //get adultsChildrenCounts
                $scope.callAPI(rvAvailabilitySrv.getOccupancyCount, {
                    params: $scope.getDateParams(),
                    successCallBack: function(){
                        handleDataChange();
                        $scope.toggleStatusOf['roomsSold'] = true;
                    }
                });
            }else{
                $scope.toggleStatusOf['roomsSold'] = !$scope.toggleStatusOf['roomsSold'];
                $scope.refreshScroller('room_availability_scroller');
            }
        };

        $scope.toggleRoomInventory = function(){
            //This detailed view will have data from the initial API call
            $scope.toggleStatusOf['roomInventory'] = !$scope.toggleStatusOf['roomInventory'];
            $scope.refreshScroller('room_availability_scroller');
        }
        //--------------------------------------------------------------------------------------------------------------

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


        var handleDataChange = function(){
            $scope.data = rvAvailabilitySrv.getGridData();
            if(!isFullDataAvaillable()){
                initToggleStatus();
            }
            $scope.refreshScroller('room_availability_scroller');
            $scope.hideMeBeforeFetching = true;
            $scope.$emit("hideLoader");
        }
		/**
		* when data changed from super controller, it will broadcast an event 'changedRoomAvailableData'
		*/
		$scope.$on("changedRoomAvailableData", handleDataChange);

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

		$scope.getClassForHoldStatusRow = function(source, id) {
			var group,
				isDeduct,
				retCls;

			if ( !$scope.showShowGroupAllotmentTotals || !source ) {
				retCls = 'hidden';
			} else {
				group    = _.findWhere(source.holdStatus, { id: id });
				isDeduct = group && group['is_take_from_inventory'];

				if ( group && isDeduct ) {
					retCls = '';
				} else {
					retCls = 'hidden';
				};
			};

			return retCls;
		};

		init();

	}
]);