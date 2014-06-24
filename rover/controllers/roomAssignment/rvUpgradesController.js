
sntRover.controller('RVUpgradesCtrl',['$scope','$state', '$stateParams', 'RVUpgradesSrv', '$sce', function($scope, $state, $stateParams, RVUpgradesSrv, $sce){
	
	BaseCtrl.call(this, $scope);
	
	$scope.$parent.myScrollOptions = {		
	    'upgradesView': {
	    	scrollbars: true,
	        snap: false,
	        hideScrollbar: false,
	        preventDefault: false
	    }
	};

	$scope.upgradesList = [];
	$scope.headerData = {};
	$scope.upgradesDescriptionStatusArray = [];
	$scope.selectedUpgrade = {};
	/**
	* Listener to set the room upgrades when loaded
	*/
	$scope.$on('roomUpgradesLoaded', function(event, data){
			$scope.upgradesList = data.upsell_data;
			$scope.headerData = data.header_details;
			$scope.setUpgradesDescriptionInitialStatuses();
	});
	
	/**
	* function to set the upgrade option for the reservation
	*/
	$scope.selectUpgrade = function(index){
		var successCallbackselectUpgrade = function(data){
			$scope.$emit('hideLoader');
			$scope.$emit('upgradeSelected', $scope.selectedUpgrade);
		};
		var errorCallbackselectUpgrade = function(error){
			$scope.$emit('hideLoader');
			$scope.$parent.errorMessage = error;
		};
		var params = {};
		params.reservation_id = parseInt($stateParams.reservation_id, 10);
		params.room_no = parseInt($scope.upgradesList[index].upgrade_room_number, 10);
		params.upsell_amount_id = parseInt($scope.upgradesList[index].upsell_amount_id, 10);
		$scope.selectedUpgrade.room_no = $scope.upgradesList[index].upgrade_room_number;
		$scope.selectedUpgrade.room_type_name = $scope.upgradesList[index].upgrade_room_type_name;
		$scope.selectedUpgrade.room_type_code = $scope.upgradesList[index].upgrade_room_type;
		$scope.invokeApi(RVUpgradesSrv.selectUpgrade, params, successCallbackselectUpgrade, errorCallbackselectUpgrade);

	};

	/**
	* function to show and hide the upgrades detail view
	*/
	$scope.toggleUpgradeDescriptionStatus = function(index){
		$scope.upgradesDescriptionStatusArray[index] = !$scope.upgradesDescriptionStatusArray[index];
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
}]);