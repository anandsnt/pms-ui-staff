sntRover.controller('rvApplyRoomChargeCtrl',['$scope','$state', '$stateParams', 'RVRoomAssignmentSrv', 'RVUpgradesSrv', 'ngDialog',  
	function($scope, $state, $stateParams, RVRoomAssignmentSrv,RVUpgradesSrv, ngDialog){
	
	BaseCtrl.call(this, $scope);
	$scope.noChargeDisabled = false;
	$scope.chargeDisabled   = true;
	$scope.roomCharge       = '';

	$scope.enableDisableButtons = function(){
		
		// setTimeout(function(){
		//	$scope.search.guest_company_agent.length
			console.log($scope.roomCharge.length)
			if($scope.roomCharge.length === 0){
				console.log("=====***********=====================");
				$scope.noChargeDisabled = false;
				$scope.chargeDisabled   = true;
			} else {
				console.log("========++++++******************+++++==================");
				$scope.noChargeDisabled = true;
				$scope.chargeDisabled   = false;
				
				
			}
		// }, 1000);
		
	};
	$scope.clickChargeButton = function(){
		var data = {
			"reservation_id": $scope.reservationData.reservation_card.reservation_id,
			"room_no": $scope.assignedRoom.room_number,
			"upsell_amount": $scope.roomCharge
		};
		$scope.invokeApi(RVUpgradesSrv.selectUpgrade, data, $scope.successCallbackUpgrade, $scope.failureCallbackUpgrade);
		
	};
	$scope.failureCallbackUpgrade = function(){
		
		ngDialog.close();
		setTimeout(function(){
			ngDialog.open({
		          template: '/assets/partials/roomAssignment/rvRoomHasAlreadySelected.html',
		          controller: 'rvRoomAlreadySelectedCtrl',
		          className: 'ngdialog-theme-default',
		          scope: $scope
	        });
		}, 700);
		$scope.$emit('hideLoader');
		
	};
	$scope.successCallbackUpgrade = function(data){

		$scope.$emit('hideLoader');
		console.log("dddddd===========")
		console.log(data)
		if(data.data.is_room_auto_assigned == true){
			$scope.roomAssignedByOpera = data.data.room;
			
			setTimeout(function(){
				ngDialog.open({
			          template: '/assets/partials/roomAssignment/rvRoomHasAutoAssigned.html',
			          controller: 'rvRoomAlreadySelectedCtrl',
			          className: 'ngdialog-theme-default',
			          scope: $scope
		        });
			}, 700);
		} else {
			$scope.closeDialog();
		    $scope.assignRoom();
		}

	};
	$scope.clickedNoChargeButton = function(){
		$scope.closeDialog();
		$scope.assignRoom();
	};
	$scope.clickedCancelButton = function(){
		$scope.getRooms(true);
		$scope.closeDialog();
	};
	
}]);