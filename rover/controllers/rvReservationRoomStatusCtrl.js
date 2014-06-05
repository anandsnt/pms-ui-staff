sntRover.controller('reservationRoomStatus',[ '$rootScope','$scope','ngDialog',  function($rootScope, $scope, ngDialog){
	BaseCtrl.call(this, $scope);
	
	
	$scope.getRoomClass = function(reservationStatus){
		var reservationRoomClass = "";
		if(reservationStatus != 'NOSHOW' && reservationStatus != 'CHECKEDOUT' && reservationStatus != 'CANCELED' && reservationStatus != 'CHECKEDIN' && reservationStatus != 'CHECKING_OUT'){
			reservationRoomClass = "has-arrow";
		} 
		return reservationRoomClass;
	};
	
	$scope.getRoomStatusClass = function(reservationStatus, roomStatus, foStatus){
		var reservationRoomStatusClass = "";
		if(reservationStatus == 'CHECKING_IN'){
			if(roomStatus == 'READY' && foStatus == 'VACANT'){
				reservationRoomStatusClass = "ready";
			} else {
				reservationRoomStatusClass = "not-ready";
			}
		} 
		return reservationRoomStatusClass;
	};
	
	$scope.showUpgradeButton = function(reservationStatus,  isUpsellAvailable){
		var showUpgrade = false;
		if((isUpsellAvailable == 'true') && (reservationStatus == 'RESERVED' || reservationStatus == 'CHECKING_IN')){
			showUpgrade = true;
		}
		return showUpgrade;
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
		
		console.log("clickedIconKey");
		console.log($scope.reservationData);
		console.log($scope.reservationData.reservation_card);
		console.log($scope.reservationData.reservation_card.reservation_status);
		console.log($scope.reservationData.reservation_card.key_settings);
		console.log($scope.reservationData.reservation_card.reservation_id);
		var keySettings = $scope.reservationData.reservation_card.key_settings;
		
		if(keySettings === "email"){
			
			console.log("email");
			
			ngDialog.open({
				 template: '/assets/partials/keys/rvKeyEmailPopup.html',
				 controller: 'RVKeyEmailPopupCtrlController',
				 className: 'ngdialog-theme-default1 calendar-single1',
				 scope: $scope
			});
		}
		else if(keySettings === "qr_code_tablet"){
			
			console.log("qr_code_tablet");
		}
		else if(keySettings === "encode"){
			
			console.log("encode");
		}
	};
	
}]);