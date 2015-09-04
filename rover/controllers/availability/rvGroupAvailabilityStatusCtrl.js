sntRover.controller('rvGroupAvailabilityStatusController', [
	'$scope',
	'rvAvailabilitySrv',
	function($scope, rvAvailabilitySrv){

		BaseCtrl.call(this, $scope);

		$scope.hideMeBeforeFetching = false;
		$scope.hideHoldStatusOf = {};
		$scope.hideHoldStatusOf["groupRoomTotal"] = true;
		$scope.hideHoldStatusOf["groupRoomPicked"] = true;

		$scope.togleHoldStatusVisibility = function(eventSource){
			if(eventSource === "groupRoomTotal"){
				$scope.hideHoldStatusOf["groupRoomTotal"]=!$scope.hideHoldStatusOf["groupRoomTotal"];
			}else if(eventSource === "groupRoomPicked"){
				$scope.hideHoldStatusOf["groupRoomPicked"]=!$scope.hideHoldStatusOf["groupRoomPicked"];
			};

		};

		$scope.data = rvAvailabilitySrv.getGridDataForGroupAvailability();
		//if already fetched we will show without calling the API
		if(!isEmptyObject($scope.data)){
			$scope.refreshScroller('availability-grid');
			$scope.hideMeBeforeFetching = true;
			$scope.$emit("hideLoader");
		}

		//we need horizonat scroller so adding option 'scrollX', also need to get the click event on toggling button on available room
		var scrollerOptions = {scrollX: true, preventDefault: false};
  		$scope.setScroller ('availability-grid', scrollerOptions);

		$scope.$on('$includeContentLoaded', function(event){
			$scope.$emit("hideLoader");
			$scope.refreshScroller('availability-grid');
		});

		/**
		* when data changed from super controller, it will broadcast an event 'changedRoomAvailableData'
		*/
		$scope.$on("changedRoomAvailableData", function(event){
			$scope.data = rvAvailabilitySrv.getGridDataForGroupAvailability();
			$scope.refreshScroller('availability-grid');
			$scope.hideMeBeforeFetching = true;
			$scope.$emit("hideLoader");
		});

	}
]);