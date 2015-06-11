sntRover.controller('rvApplyRoomChargeCtrl',[
	'$scope',
	'$rootScope', 
	'$state', 
	'$stateParams', 
	'RVRoomAssignmentSrv', 
	'RVUpgradesSrv', 
	'ngDialog',
	'RVReservationCardSrv',  
	'$timeout',
	function($scope, 
		$rootScope, 
		$state,  
		$stateParams, 
		RVRoomAssignmentSrv,
		RVUpgradesSrv, 
		ngDialog, 
		RVReservationCardSrv,
		$timeout) {
	
	BaseCtrl.call(this, $scope);
	$scope.noChargeDisabled = false;
	$scope.chargeDisabled   = true;
	$scope.roomCharge       = '';	

	// CICO-17082, do we need to call the the room assigning API with forcefully assign to true
	// currently used for group reservation
	var wanted_to_forcefully_assign = false;
	var choosedNoCharge = false;


	$scope.enableDisableButtons = function(){
		
		return !isNaN($scope.roomCharge) && $scope.roomCharge.length > 0;
			
		
	};
	$scope.clickChargeButton = function(){
		choosedNoCharge = false;

		var data = {
			"reservation_id": $scope.reservationData.reservation_card.reservation_id,
			"room_no": $scope.assignedRoom.room_number,
			"upsell_amount": $scope.roomCharge,
			forcefully_assign_room: wanted_to_forcefully_assign
		};
		$scope.invokeApi(RVUpgradesSrv.selectUpgrade, data, $scope.successCallbackUpgrade, $scope.failureCallbackUpgrade);
		
	};
	
	/**
	 * to open the room aleady chhosed popup
	 * @return undefined
	 */
	var openWantedToBorrowPopup = function() {
		ngDialog.open(
		{
			template 	: '/assets/partials/roomAssignment/rvGroupRoomTypeNotConfigured.html',
			scope 		: $scope
        });
	};

	/**
	 * to open the room aleady chhosed popup
	 * @return undefined
	 */
	var openRoomAlreadyChoosedPopup = function() {
		ngDialog.open(
		{
			template 	: '/assets/partials/roomAssignment/rvRoomHasAutoAssigned.html',
			controller 	: 'rvRoomAlreadySelectedCtrl',
			className 	: 'ngdialog-theme-default',
			scope 		: $scope
        });
	};

	/**
	 * [selectUpgrade description]
	 * @return {[type]} [description]
	 */
	$scope.selectUpgrade = function() {
		$scope.closeDialog();

		$timeout(function() {
			if (choosedNoCharge) {
				$scope.clickedNoChargeButton ();
			}
			else {
				$scope.clickChargeButton ();
			}		
		}, 100);
	};

	$scope.failureCallbackUpgrade = function(error) {
		ngDialog.close();
		//since we are expecting some custom http error status in the response
		//and we are using that to differentiate among errors
		if(error.hasOwnProperty ('httpStatus')) {
			switch (error.httpStatus) {
				case 470:
						wanted_to_forcefully_assign = true;
						openWantedToBorrowPopup ();
				 	break;
				default:
					break;
			}
		}
		else {
			setTimeout(function(){
				openRoomAlreadyChoosedPopup ();
			}, 700);
		}
		$scope.$emit('hideLoader');
		
	};
	
	$scope.successCallbackUpgrade = function(data){

		// CICO-10152 : To fix - Rover - Stay card - Room type change does not reflect the updated name soon after upgrading.
		var dataToUpdate 		= {}, 
			assignedRoom 		= $scope.assignedRoom, 
			selectedRoomType 	= $scope.selectedRoomType,
			reservationData 	= $scope.reservationData.reservation_card;

		_.extend (dataToUpdate, 
		{
			room_id 			: assignedRoom.room_id,
			room_number 		: assignedRoom.room_number,
			room_status 		: "READY",
			fo_status 			: "VACANT",
			room_ready_status	: "INSPECTED",
			is_upsell_available	: (data.is_upsell_available) ? "true" : "false",  // CICO-7904 and CICO-9628 : update the upsell availability to staycard			
		});
		
		if (typeof $scope.selectedRoomType !== 'undefined') {
			_.extend (dataToUpdate, 
			{
				room_type_description 	: selectedRoomType.description,
				room_type_code 			: selectedRoomType.type
			});
		}		

		//updating in the central data model
		_.extend($scope.reservationData.reservation_card, dataToUpdate);

		RVReservationCardSrv
			.updateResrvationForConfirmationNumber(reservationData.confirmation_num, $scope.reservationData);
		
		// CICO-10152 : Upto here..
		$scope.closeDialog();
		$scope.goToNextView();

	};
	$scope.clickedNoChargeButton = function(){
		choosedNoCharge = true;

		var data = {
			"reservation_id" 	: $scope.reservationData.reservation_card.reservation_id,
			"room_no" 			: $scope.assignedRoom.room_number,
			forcefully_assign_room : wanted_to_forcefully_assign			
		};
		$scope.invokeApi(RVUpgradesSrv.selectUpgrade, data, $scope.successCallbackUpgrade, $scope.failureCallbackUpgrade);
		
	};
	$scope.clickedCancelButton = function(){
		$scope.getRooms(true);
		$scope.closeDialog();
	};
	
}]);