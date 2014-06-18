
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
		
	$scope.getAllUpgrades = function(){
		var successCallbackgetAllUpgrades = function(data){
			$scope.upgradesList = data.upsell_data;
			$scope.headerData = data.header_details;
			$scope.setUpgradesDescriptionInitialStatuses();
			$scope.$emit('hideLoader');
			setTimeout(function(){
				$scope.$parent.myScroll['upgradesView'].refresh();
				}, 
			3000);
		};
		var errorCallbackgetAllUpgrades = function(error){
			$scope.$emit('hideLoader');
			$scope.$parent.errorMessage = error;
		};
		var params = {};
		params.reservation_id = $stateParams.reservation_id;
		$scope.invokeApi(RVUpgradesSrv.getAllUpgrades, params, successCallbackgetAllUpgrades, errorCallbackgetAllUpgrades);

	};
	$scope.selectUpgrade = function(index){
		var successCallbackselectUpgrade = function(data){
			$scope.$emit('hideLoader');
			$scope.$parent.backToStayCard();
		};
		var errorCallbackselectUpgrade = function(error){
			$scope.$emit('hideLoader');
			$scope.$parent.errorMessage = error;
		};
		var params = {};
		params.reservation_id = parseInt($stateParams.reservation_id, 10);
		params.room_no = parseInt($scope.upgradesList[index].upgrade_room_number, 10);
		params.upsell_amount_id = parseInt($scope.upgradesList[index].upsell_amount_id, 10);
		$scope.invokeApi(RVUpgradesSrv.selectUpgrade, params, successCallbackselectUpgrade, errorCallbackselectUpgrade);

	};
	$scope.getAllUpgrades();
	$scope.toggleUpgradeDescriptionStatus = function(index){
		$scope.upgradesDescriptionStatusArray[index] = !$scope.upgradesDescriptionStatusArray[index];
	};
	$scope.isDescriptionVisible = function(index){
		return $scope.upgradesDescriptionStatusArray[index];
	};
	$scope.setUpgradesDescriptionInitialStatuses = function(){
		$scope.upgradesDescriptionStatusArray = new Array($scope.upgradesList.length);
		for (var i = 0; i < $scope.upgradesDescriptionStatusArray.length; i++) 
			{ 
				$scope.upgradesDescriptionStatusArray[i] = false;
				$scope.upgradesList[i].upgrade_room_description = $sce.trustAsHtml($scope.upgradesList[i].upgrade_room_description);
			}
	};
}]);