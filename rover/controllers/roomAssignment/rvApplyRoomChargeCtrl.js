sntRover.controller('rvApplyRoomChargeCtrl',['$scope','$rootScope', '$state', '$stateParams', 'RVRoomAssignmentSrv', 'RVUpgradesSrv', 'ngDialog','RVReservationCardSrv',  
	function($scope, $rootScope, $state,  $stateParams, RVRoomAssignmentSrv,RVUpgradesSrv, ngDialog, RVReservationCardSrv){
	
	BaseCtrl.call(this, $scope);
	$scope.noChargeDisabled = false;
	$scope.chargeDisabled   = true;
	$scope.roomCharge       = '';

	$scope.enableDisableButtons = function(){
		
		return !isNaN($scope.roomCharge) && $scope.roomCharge.length > 0;
			
		
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

		// CICO-10152 : To fix - Rover - Stay card - Room type change does not reflect the updated name soon after upgrading.
		$scope.reservationData.reservation_card.room_id = $scope.assignedRoom.room_id;
		$scope.reservationData.reservation_card.room_number = $scope.assignedRoom.room_number;
		if(typeof $scope.selectedRoomType != 'undefined'){
			$scope.reservationData.reservation_card.room_type_description = $scope.selectedRoomType.description;
			$scope.reservationData.reservation_card.room_type_code = $scope.selectedRoomType.type;
		}
		$scope.reservationData.reservation_card.room_status = "READY";
		$scope.reservationData.reservation_card.fo_status = "VACANT";
		$scope.reservationData.reservation_card.room_ready_status = "INSPECTED";
		$scope.reservationData.reservation_card.is_upsell_available = data.is_upsell_available?"true":"false";

		RVReservationCardSrv.updateResrvationForConfirmationNumber($scope.reservationData.reservation_card.confirmation_num, $scope.reservationData);
		// CICO-10152 : Upto here..
		
		$scope.$emit('hideLoader');
		$scope.closeDialog();
		$scope.goToNextView();

	};
	$scope.clickedNoChargeButton = function(){
			
		var data = {
			"reservation_id": $scope.reservationData.reservation_card.reservation_id,
			"room_no": $scope.assignedRoom.room_number
		};
		$scope.invokeApi(RVUpgradesSrv.selectUpgrade, data, $scope.successCallbackUpgrade, $scope.failureCallbackUpgrade);
		
	};
	$scope.clickedCancelButton = function(){
		$scope.getRooms(true);
		$scope.closeDialog();
	};
	
}]);