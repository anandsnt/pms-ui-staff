sntRover.controller('rvGroupAvailabilityStatusController', [
	'$scope',
	'rvAvailabilitySrv',
	'$state',
	'ngDialog',
	'rvGroupConfigurationSrv',
	function($scope, rvAvailabilitySrv, $state, ngDialog, rvGroupConfigurationSrv){

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
			$scope.hideBeforeDataFetch = false;
			$scope.data = rvAvailabilitySrv.getGridDataForGroupAvailability();
			$scope.refreshScroller('groupscroller');
			$scope.$emit("hideLoader");
		});
		/**
		* Setting scroller
		*/
		var setScroller = function(){
			//we need horizontal scroller so adding option 'scrollX', also need to get the click event on toggling button on available room
			var scrollerOptions = {scrollX: true, preventDefault: false};
  			$scope.setScroller ('groupscroller', scrollerOptions);
		};
		/**
		* Function for navigate to Group config screen
		* Param  - Group id
		* return - Null 
		*/		
		$scope.gotoGroupScreen = function(GroupId){
			$state.go('rover.groups.config', {
				id: GroupId,
				activeTab: 'ROOMING'
			});
			$scope.$emit("CLOSEAVAILIBILTY");
		};
		/*
		* Function for show/hide Room status of Groups
		* param - index of clicked row
		* return Null
		*/
		$scope.toggleButtonClicked = function(index){
			$scope.data.groupDetails[index].isDropDownOpened = !$scope.data.groupDetails[index].isDropDownOpened;
			$scope.refreshScroller('groupscroller');
		};
		/*
		* Function for release Warn popup
		* Param - Object contain details of curresponding group.
		*/
		$scope.roomHeldButtonClicked = function(detail){
			$scope.data.clickedHeldRoomDetail = detail;
			ngDialog.open({
				template: '/assets/partials/availability/releaseRoomPopup.html',
				controller: 'rvGroupAvailabilityStatusController',
				scope: $scope,
				closeByDocument: true
			});
		};
		/**
		 * Handle release rooms
		 * @return undefined
		 */
		$scope.releaseRooms = function() {
			var onReleaseRoomsSuccess = function(data) {
					//: Handle successful release
					$scope.closeDialog();
					$scope.$parent.changedAvailabilityDataParams();
				},
				onReleaseRoomsFailure = function(errorMessage) {
					$scope.closeDialog();
					$scope.errorMessage = errorMessage;
				};
			$scope.callAPI(rvGroupConfigurationSrv.releaseRooms, {
				successCallBack: onReleaseRoomsSuccess,
				failureCallBack: onReleaseRoomsFailure,
				params: {
					groupId:$scope.data.clickedHeldRoomDetail.id
				}
			});
		};
		/*
		* Initialisation goes here!
		*/
		var init = function(){
			$scope.hideBeforeDataFetch =true;
			$scope.hideHoldStatusOf = {};
			$scope.hideHoldStatusOf["groupRoomTotal"] = true;
			$scope.hideHoldStatusOf["groupRoomPicked"] = true;
			$scope.data = rvAvailabilitySrv.getGridDataForGroupAvailability();
			setScroller();	
			//if already fetched we will show without calling the API
			if(!isEmptyObject($scope.data)){
				$scope.hideBeforeDataFetch = false;
				$scope.refreshScroller('groupscroller');
				$scope.$emit("hideLoader");
			};
		};
		init();
	}
]);