(function() {
	var checkoutRoomVerificationViewController = function($scope,$rootScope,$state,$modal,checkoutRoomVerificationService) {

	$scope.pageValid = false;
	$rootScope.isRoomVerified =  false;
	$scope.roomNumber = "";

	if($rootScope.isCheckedin){
		$state.go('checkinSuccess');
	}
	else if($rootScope.isCheckin){
		$state.go('checkinConfirmation');
	}
	else{
		$scope.pageValid = true;
	}	

	if($scope.pageValid){
		//setup options for error popup
		$scope.opts = {
			backdrop: true,
			backdropClick: true,
			templateUrl: '/assets/checkoutnow/partials/roomVerificationErrorModal.html',
			controller: roomVerificationErrorModalCtrl
		};

		$scope.continueButtonClicked = function(){

		//TO DO:
		//
		var url = '/guest_web/verify_room.json';
		var data = {'reservation_id':$rootScope.reservationID,"room_number":$scope.roomNumber};

		checkoutRoomVerificationService.verifyRoom(url,data).then(function(response) {
			if(response.status ==="success"){
				$rootScope.isRoomVerified =  true;
				if($rootScope.isLateCheckoutAvailable ){
						$state.go('checkOutOptions');
			    }else {
			    	$state.go('checkOutConfirmation');	
				}
			}
			else{
				$modal.open($scope.opts); // error modal popup
			}
			
		},function(){
			$modal.open($scope.opts); // error modal popup
			
		});	
	};

	
}
}

var dependencies = [
'$scope','$rootScope','$state','$modal','checkoutRoomVerificationService',
checkoutRoomVerificationViewController
];

snt.controller('checkoutRoomVerificationViewController', dependencies);
})();


// controller for the modal

	var roomVerificationErrorModalCtrl = function ($scope, $modalInstance) {
		$scope.closeDialog = function () {
			$modalInstance.dismiss('cancel');
		};
		$scope.goToBrowserHomePage = function(){
			if (window.home) {
                window.home ();
            } else {        // Internet Explorer
                document.location.href = "about:home";
            }
		};
	};