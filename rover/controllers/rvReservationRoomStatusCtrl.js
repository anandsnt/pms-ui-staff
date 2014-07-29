sntRover.controller('reservationRoomStatus',[ '$state','$rootScope','$scope','ngDialog',  function($state, $rootScope, $scope, ngDialog){
	BaseCtrl.call(this, $scope);
	
	
	$scope.getRoomClass = function(reservationStatus){
		var reservationRoomClass = "";
		if(reservationStatus != 'NOSHOW' && reservationStatus != 'CHECKEDOUT' && reservationStatus != 'CANCELED' && reservationStatus != 'CHECKEDIN' && reservationStatus != 'CHECKING_OUT'){
			reservationRoomClass = "has-arrow";
		} 
		return reservationRoomClass;
	};
	
	$scope.getRoomStatusClass = function(reservationStatus, roomStatus, foStatus, roomReadyStatus, checkinInspectedOnly){
		var reservationRoomStatusClass = "";
		if(reservationStatus == 'CHECKING_IN'){
			
			if(roomReadyStatus!=''){
				if(foStatus == 'VACANT'){
					switch(roomReadyStatus) {

						case "INSPECTED":
							reservationRoomStatusClass = ' room-green';
							break;
						case "CLEAN":
							if (checkinInspectedOnly == "true") {
								reservationRoomStatusClass = ' room-orange';
								break;
							} else {
								reservationRoomStatusClass = ' room-green';
								break;
							}
							break;
						case "PICKUP":
							reservationRoomStatusClass = " room-orange";
							break;
			
						case "DIRTY":
							reservationRoomStatusClass = " room-red";
							break;

		        }
				
				} else {
					reservationRoomStatusClass = "room-red";
				}
				
			}
		} 
		return reservationRoomStatusClass;
	};
	
	$scope.showUpgradeButton = function(reservationStatus,  isUpsellAvailable){
		var showUpgrade = false;
		if((isUpsellAvailable == 'true') && $scope.isFutureReservation(reservationStatus)){
			showUpgrade = true;
		}
		return showUpgrade;
	};
	$scope.isFutureReservation = function(reservationStatus){
		return (reservationStatus == 'RESERVED' || reservationStatus == 'CHECKING_IN');
	};
	$scope.showKeysButton = function(reservationStatus){
		var showKey = false;
		if(reservationStatus == 'CHECKING_OUT' || reservationStatus == 'CHECKEDIN'){
			showKey = true;
		}
		return showKey;
	};
	$scope.addHasButtonClass = function(reservationStatus,  isUpsellAvailable){
		var hasButton = "";
		if($scope.showKeysButton(reservationStatus) || $scope.showUpgradeButton(reservationStatus,  isUpsellAvailable)){
			hasButton = "has-button";
		};
		return hasButton;
	};
	
	// To handle click of key icon.
	$scope.clickedIconKey = function(){
		
		var keySettings = $scope.reservationData.reservation_card.key_settings;
		
		if(keySettings === "email"){
			
			ngDialog.open({
				 template: '/assets/partials/keys/rvKeyEmailPopup.html',
				 controller: 'RVKeyEmailPopupController',
				 className: 'ngdialog-theme-default1',
				 scope: $scope
			});
		}
		else if(keySettings === "qr_code_tablet"){
			
			ngDialog.open({
				 template: '/assets/partials/keys/rvKeyQrcodePopup.html',
				 controller: 'RVKeyQRCodePopupController',
				 className: 'ngdialog-theme-default1',
				 scope: $scope
			});
		}
		
		//Display the key encoder popup
		else if(keySettings === "encode"){
			ngDialog.open({
			    template: '/assets/partials/keys/rvKeyEncodePopup.html',
			    controller: 'RVKeyEncodePopupCtrl',
			    className: 'ngdialog-theme-default1',
			    scope: $scope
			});
		}
	};
	
	/**
	* function for close activity indicator.
	*/
	$scope.closeActivityIndication = function(){
		$scope.$emit('hideLoader');
	};
	/**
	* function to trigger room assignment.
	*/
	$scope.goToroomAssignment = function(){
		if($scope.isFutureReservation($scope.reservationData.reservation_card.reservation_status)){
			$state.go("rover.reservation.staycard.roomassignment", {reservation_id:$scope.reservationData.reservation_card.reservation_id, room_type:$scope.reservationData.reservation_card.room_type_code, "clickedButton": "roomButton"});
		}
		
	};

	
}]);