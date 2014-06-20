sntRover.controller('RVValidateEmailPhoneCtrl',['$rootScope', '$scope', '$state', 'ngDialog', 'RVValidateCheckinSrv',  function($rootScope, $scope, $state, ngDialog, RVValidateCheckinSrv){
	BaseCtrl.call(this, $scope);
	
	$scope.showEmail = ($scope.guestCardData.contactInfo.email == '' || $scope.guestCardData.contactInfo.email == null) ? true : false;
	$scope.showPhone = ($scope.guestCardData.contactInfo.phone == '' || $scope.guestCardData.contactInfo.phone == null) ? true : false;
	$scope.saveData = {};
	$scope.saveData.email = "";
	$scope.saveData.phone = "";
	$scope.saveData.guest_id = "";
	$scope.saveData.user_id = "";

	console.log($scope);
	$scope.clickCancel = function(){
		ngDialog.close();
	};
	$scope.validateEmailPhoneSuccessCallback = function(){
		console.log("-----------------------");
		console.log($scope);
		
		if($scope.showEmail && $scope.showPhone){
			$scope.guestCardData.contactInfo.phone = $scope.saveData.phone;
			$scope.guestCardData.contactInfo.email = $scope.saveData.email;
		} else if($scope.showPhone){
			$scope.guestCardData.contactInfo.phone = $scope.saveData.phone;
		} else if($scope.showEmail){
			$scope.guestCardData.contactInfo.email = $scope.saveData.email;
		}
			
		$scope.$emit('hideLoader');
		ngDialog.close();
		$scope.goToNextView();
	};
	$scope.goToNextView = function(){
		// if($scope.reservationData.reservation_card.room_number == '' || $scope.reservationData.reservation_card.room_status != 'READY' || $scope.reservationData.reservation_card.fo_status != 'VACANT')
		// {
			// //TO DO:Go to rrom assignemt viw
			// $state.go("rover.staycard.roomassignment");
		// } else if ($scope.reservationData.reservation_card.is_force_upsell && $scope.reservationData.reservation_card.is_upsell_available){
			// //TO DO : gO TO ROOM UPGRAFED VIEW
		// } else {
			$state.go('rover.staycard.billcard', {"reservationId": $scope.reservationData.reservation_card.reservation_id, "clickedButton": "checkinButton"});
		// }
	};
	$scope.submitAndGoToCheckin = function(){
			$scope.saveData.guest_id = $scope.guestCardData.guestId;
	        $scope.saveData.user_id = $scope.guestCardData.userId;
			if($scope.showEmail && $scope.showPhone){
				$scope.saveData = $scope.saveData;
			} else if($scope.showPhone){
				var unwantedKeys = ["email"]; // remove unwanted keys for API
				$scope.saveData = dclone($scope.saveData, unwantedKeys); 
			} else {
				var unwantedKeys = ["phone"]; // remove unwanted keys for API
				$scope.saveData = dclone($scope.saveData, unwantedKeys);
			}
			$scope.invokeApi(RVValidateCheckinSrv.saveGuestEmailPhone, $scope.saveData, $scope.validateEmailPhoneSuccessCallback);
	};
	
	
}]);