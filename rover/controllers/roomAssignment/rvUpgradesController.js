
sntRover.controller('RVUpgradesCtrl',['$scope','$state', '$stateParams', 'RVUpgradesSrv', '$sce','$filter', 'ngDialog', function($scope, $state, $stateParams, RVUpgradesSrv, $sce, $filter, ngDialog){
	
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
	/**
	* Listener to set the room upgrades when loaded
	*/
	$scope.$on('roomUpgradesLoaded', function(event, data){
			$scope.upgradesList = data.upsell_data;
			$scope.headerData = data.header_details;
			$scope.reservation_occupancy = $scope.headerData.reservation_occupancy;
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
		if($scope.upgradesList[index].room_max_occupancy != "" && $scope.reservation_occupancy != null){
				if(parseInt($scope.upgradesList[index].room_max_occupancy) < $scope.reservation_occupancy){
					showOccupancyMessage = true;
					$scope.max_occupancy = parseInt($scope.upgradesList[index].room_max_occupancy);
			}
		}else if($scope.upgradesList[index].room_type_max_occupancy != "" && $scope.reservation_occupancy != null){
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
	* function to set the upgrade option for the reservation
	*/
	$scope.selectUpgrade = function(index){
		index = $scope.selectedUpgradeIndex;
		var successCallbackselectUpgrade = function(data){
			$scope.$emit('hideLoader');
			$scope.selectedUpgrade.is_upsell_available = data.is_upsell_available;
			$scope.$emit('upgradeSelected', $scope.selectedUpgrade);
		};
		var errorCallbackselectUpgrade = function(error){
			$scope.$emit('hideLoader');
			$scope.$parent.errorMessage = error;
		};
		var params = {};
		params.reservation_id = parseInt($stateParams.reservation_id, 10);
		params.room_no = $scope.upgradesList[index].upgrade_room_number;
		params.upsell_amount_id = parseInt($scope.upgradesList[index].upsell_amount_id, 10);
		$scope.selectedUpgrade.room_id = $scope.upgradesList[index].room_id;
		$scope.selectedUpgrade.room_no = $scope.upgradesList[index].upgrade_room_number;
		$scope.selectedUpgrade.room_type_name = $scope.upgradesList[index].upgrade_room_type_name;
		$scope.selectedUpgrade.room_type_code = $scope.upgradesList[index].upgrade_room_type;
		$scope.selectedUpgrade.room_type_level = parseInt($scope.upgradesList[index].room_type_level);
		$scope.invokeApi(RVUpgradesSrv.selectUpgrade, params, successCallbackselectUpgrade, errorCallbackselectUpgrade);

	};

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
		if(room.is_oos == "true"){
			return "room-grey";
		}
		return statusClass;
	}
}]);