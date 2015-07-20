(function() {
	var checkoutRoomVerificationViewController = function($scope,$rootScope,$state,$modal,checkoutRoomVerificationService,$timeout) {

	$scope.pageValid = false;
	$rootScope.isRoomVerified =  false;
	$scope.roomNumber = "";


	// if($rootScope.isPreCheckedIn){
	// 	$state.go('preCheckinComleted');
	// }
	// else
	if($rootScope.isPrecheckinOnly){
 		$state.go('preCheckinTripDetails');
 	}
	else if($rootScope.isCheckedin){
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

		var url = '/guest_web/verify_room.json';
		var data = {'reservation_id':$rootScope.reservationID,"room_number":$scope.roomNumber};
		$scope.isFetching = true;
		checkoutRoomVerificationService.verifyRoom(url,data).then(function(response) {

			   $timeout(function() {

					if(response.status ==="success"){
						$rootScope.isRoomVerified =  true;
						if($rootScope.isLateCheckoutAvailable ){
								$state.go('checkOutOptions');
					    }else {
					    	$state.go('checkOutConfirmation');
						}
					}
					else{
						$scope.isFetching = false;
						$modal.open($scope.opts); // error modal popup
					}
			    }, 2000);

		},function(){
			 $scope.isFetching = false;
			 $scope.netWorkError = true;

		});
	};


}
}

var dependencies = [
'$scope','$rootScope','$state','$modal','checkoutRoomVerificationService','$timeout',
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