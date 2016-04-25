
angular.module('sntRover').controller('RVUpgradesCtrl',['$scope','$state', '$stateParams', 'RVUpgradesSrv', '$sce','$filter', 'ngDialog', '$timeout', function($scope, $state, $stateParams, RVUpgradesSrv, $sce, $filter, ngDialog, $timeout){

	BaseCtrl.call(this, $scope);
	var title = $filter('translate')('ROOM_UPGRADES_TITLE');
	$scope.setTitle(title);

	var scrollerOptions = {tap:true, click:true};
	$scope.setScroller('upgradesView', scrollerOptions);
	$scope.eventTimestamp = "";

	$scope.upgradesList = [];
	$scope.headerData = {};
	$scope.upgradesDescriptionStatusArray = [];
	$scope.selectedUpgrade = {};
	$scope.selectedUpgradeIndex = "";

	// CICO-17082, do we need to call the the room assigning API with forcefully assign to true
	// currently used for group reservation
	var wanted_to_forcefully_assign = false;
	/**
	* Listener to set the room upgrades when loaded
	*/
	$scope.$on('roomUpgradesLoaded', function(event, data){
			$scope.upgradesList = data.upsell_mapping;
			_.each($scope.upgradesList, function(upgradesList){
				upgradesList.upgrade_room_number = (_.findWhere($scope.allRooms, {"room_type_id": upgradesList.upgrade_room_type_id_int})).room_number;
			});
			// $scope.headerData = data.header_details;
			$scope.reservation_occupancy = $scope.reservation_occupancy;
			$scope.setUpgradesDescriptionInitialStatuses();
			setTimeout(function(){
				$scope.refreshScroller('upgradesView');
				},
			1000);
	});
	$scope.imageLoaded = function(){
		$scope.refreshScroller('upgradesView');
	};

	/**
	* function to check occupancy for the reservation
	*/
	$scope.showMaximumOccupancyDialog = function(index){
		var showOccupancyMessage = false;
		if($scope.upgradesList[index].room_max_occupancy !== "" && $scope.reservation_occupancy !== null){
				if(parseInt($scope.upgradesList[index].room_max_occupancy) < $scope.reservation_occupancy){
					showOccupancyMessage = true;
					$scope.max_occupancy = parseInt($scope.upgradesList[index].room_max_occupancy);
			}
		}else if($scope.upgradesList[index].room_type_max_occupancy !== "" && $scope.reservation_occupancy !== null){
				if(parseInt($scope.upgradesList[index].room_type_max_occupancy) < $scope.reservation_occupancy){
					showOccupancyMessage = true;
					$scope.max_occupancy = parseInt($scope.upgradesList[index].room_type_max_occupancy);
				}
		}

		$scope.selectedUpgradeIndex = index;
		if(showOccupancyMessage){
			ngDialog.open({
                  template: '/assets/partials/roomAssignment/rvMaximumOccupancyDialog.html',
                  controller: 'rvMaximumOccupancyDialogController',
                  className: 'ngdialog-theme-default',
                  scope: $scope
                });
		}else{
			$scope.selectUpgrade();
		}


	};
	$scope.occupancyDialogSuccess = function(){
		$scope.selectUpgrade();
	};


	/**
	 * to open the room aleady chhosed popup
	 * @return undefined
	 */
	var openWantedToBorrowPopup = function(error) {
		$scope.passingParams = {
			"errorMessage": error.errorMessage[0]
		}
		ngDialog.open(
		{
			template 	: '/assets/partials/roomAssignment/rvGroupRoomTypeNotConfigured.html',
			controller 	: 'rvBorrowRoomTypeCtrl',
			scope 		: $scope
        });
	};

	/**
	 * API success of room upgrade
	 * @param  {[type]} data [description]
	 * @return undefined
	 */
	var successCallbackselectUpgrade = function(data) {
		$scope.selectedUpgrade.is_upsell_available = data.is_upsell_available;
		$scope.$emit('upgradeSelected', $scope.selectedUpgrade);
	};

	var errorCallbackselectUpgrade = function(error){
		//since we are expecting some custom http error status in the response
		//and we are using that to differentiate among errors
		if(error.hasOwnProperty ('httpStatus')) {
			switch (error.httpStatus) {
				case 470:
						wanted_to_forcefully_assign = true;
						openWantedToBorrowPopup (error);
				 	break;
				default:
					break;
			}
		}
		else {
			$scope.$parent.errorMessage = error;
		}
	};

	/**
	 * [borrowFromOtherRoomType description]
	 * @return {[type]} [description]
	 */
	$scope.borrowFromOtherRoomType = function (){
		$scope.closeDialog ();
		$timeout(function(){
			$scope.selectUpgrade ();
		}, 300);
	};
	/*** THIS IS JUST REPEATATION OF rvUpgradesCtrl.js's upgrade. I dont
	*** know why upgrade is in two file and two controller, WTH.
	***/

	/**
	 * When the user select a particular room updgrade, this funciton will fire
	 * @return undefined
	 */
	$scope.selectUpgrade = function() {
		var index 				= $scope.selectedUpgradeIndex,
			selectedListItem 	= $scope.upgradesList[index];

		var params = {};


		//CICO-17082
		params.forcefully_assign_room 	= wanted_to_forcefully_assign;
		wanted_to_forcefully_assign 	= false;

		params.reservation_id 	= parseInt($stateParams.reservation_id, 10);
		params.upsell_amount_id = parseInt(selectedListItem.upsell_amount_id, 10);
		params.room_no 			= selectedListItem.upgrade_room_number;

		_.extend($scope.selectedUpgrade,
		{
			room_id 		: selectedListItem.room_id,
			room_no 		: selectedListItem.upgrade_room_number,
			room_type_name 	: selectedListItem.upgrade_room_type_name,
			room_type_code 	: selectedListItem.upgrade_room_type,
			room_type_level	: parseInt(selectedListItem.room_type_level)
		});

		//yes. ALL set. Go!
		var options = {
            params 			: params,
            successCallBack : successCallbackselectUpgrade,
            failureCallBack : errorCallbackselectUpgrade,
            successCallBackParameters: 	{ selectedListItem: selectedListItem}
        };
        $scope.callAPI(RVUpgradesSrv.selectUpgrade, options);
	};

	$scope.$on('UPGRADE_ROOM_SELECTED_FROM_ROOM_ASSIGNMENT', function(event, indexValue) {
		$scope.selectedUpgradeIndex = indexValue;
		$scope.selectUpgrade();
    });
	/**
	* function to show and hide the upgrades detail view
	*/
	$scope.toggleUpgradeDescriptionStatus = function($event,index){
		$event.stopPropagation();
		$event.stopImmediatePropagation();

		if (parseInt($scope.eventTimestamp)) {
			if (($event.timeStamp - $scope.eventTimestamp) < 500) {
				return;
			}
			else{
				$scope.upgradesDescriptionStatusArray[index] = !$scope.upgradesDescriptionStatusArray[index];
			}
		}else{
			$scope.upgradesDescriptionStatusArray[index] = !$scope.upgradesDescriptionStatusArray[index];
		}
		$scope.eventTimestamp = $event.timeStamp;
		$scope.refreshScroller('upgradesView');

	};
	$scope.isDescriptionVisible = function(index){
		return $scope.upgradesDescriptionStatusArray[index];
	};


	/**
	* function to set the initial display status for the upgrade details for all the upgrades
	  And also to set the upgrade description text as html
	*/
	$scope.setUpgradesDescriptionInitialStatuses = function(){
		$scope.upgradesDescriptionStatusArray = new Array($scope.upgradesList.length);
		for (var i = 0; i < $scope.upgradesDescriptionStatusArray.length; i++)
			{
				$scope.upgradesDescriptionStatusArray[i] = false;
				$scope.upgradesList[i].upgrade_room_description = $sce.trustAsHtml($scope.upgradesList[i].upgrade_room_description);
			}
	};

	/**
	* In upgrades we would display rooms Inspected & vacant(color - green) or outof service (grey).
	*/
	$scope.getRoomStatusClass = function(room){
		var statusClass = "ready";
		if(room.is_oos === "true"){
			return "room-grey";
		}
		return statusClass;
	};
}]);