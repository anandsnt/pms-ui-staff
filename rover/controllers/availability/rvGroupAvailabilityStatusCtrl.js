sntRover.controller('rvGroupAvailabilityStatusController', [
	'$scope',
	'rvAvailabilitySrv',
	function($scope, rvAvailabilitySrv){

		BaseCtrl.call(this, $scope);		

		$scope.togleHoldStatusVisibility = function(eventSource){
			if(eventSource === "groupRoomTotal"){
				$scope.hideHoldStatusOf["groupRoomTotal"]=!$scope.hideHoldStatusOf["groupRoomTotal"];
			}else if(eventSource === "groupRoomPicked"){
				$scope.hideHoldStatusOf["groupRoomPicked"] = !$scope.hideHoldStatusOf["groupRoomPicked"];
			};

			$scope.refreshScroller('groupscroller');
		};
		/**
		* when data changed from super controller, it will broadcast an event 'changedRoomAvailableData'
		*/
		$scope.$on("changedRoomAvailableData", function(event){
			$scope.data = rvAvailabilitySrv.getGridDataForGroupAvailability();
			$scope.refreshScroller('groupscroller');
			$scope.$emit("hideLoader");
		});


		var init = function(){
			$scope.hideHoldStatusOf = {};
			$scope.hideHoldStatusOf["groupRoomTotal"] = true;
			$scope.hideHoldStatusOf["groupRoomPicked"] = true;
			//we need horizonat scroller so adding option 'scrollX', also need to get the click event on toggling button on available room
			var scrollerOptions = {scrollX: true, preventDefault: false};
  			$scope.setScroller ('groupscroller', scrollerOptions);
			$scope.data = rvAvailabilitySrv.getGridDataForGroupAvailability();
			//if already fetched we will show without calling the API
			if(!isEmptyObject($scope.data)){
				$scope.refreshScroller('groupscroller');
				$scope.$emit("hideLoader");
			}
		}
		init();

	}
]);