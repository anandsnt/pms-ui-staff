(function() {
	var externalVerificationViewController = function($scope, externalVerificationService,$rootScope,$state,dateFilter,$filter,$modal) {

	$scope.stayDetails = {
							"room_number":"",
							"last_name":"",
							"arrival_date":"",
							"email":""
						 };

	$scope.calendarView = false;
	var dateToSend = "";
	$scope.date = dateFilter(new Date(), 'yyyy-MM-dd');
	$scope.selectedDate = ($filter('date')($scope.date, $rootScope.dateFormat));


	$scope.showCalender = function(){
		$scope.calendarView = true;
	};
	$scope.closeCalender = function(){
		$scope.calendarView = false;
	};
	$scope.dateChoosen = function(){
		$scope.stayDetails.arrival_date = ($filter('date')($scope.date, $rootScope.dateFormat));
		dateToSend = dclone($scope.date,[]);
		dateToSend = ($filter('date')(dateToSend,'yyyy-MM-dd'));
		$scope.closeCalender();
	};

	$scope.submit = function(){

		var params  = {
						"room_number":$scope.stayDetails.room_number,
						"hotel_identifier":$rootScope.hotelIdentifier,
						"last_name":$scope.stayDetails.last_name,
						"arrival_date":dateToSend,
						"email":$scope.stayDetails.email
					  };

		$scope.isLoading = true;

		var setReservartionDetails = function(response){

			$rootScope.reservationID 			= response.reservation_id;
			$rootScope.userName    				= response.user_name;
			$rootScope.checkoutDate  			= response.checkout_date
			$rootScope.checkoutTime 			= response.checkout_time;
			$rootScope.userCity   				= response.user_city;
			$rootScope.userState    			= response.user_state;
			$rootScope.roomNo       			= response.room_no;
			$rootScope.isLateCheckoutAvailable  = response.is_late_checkout_available;
			$rootScope.emailAddress 			= response.email_address;
			$rootScope.isCCOnFile				= response.is_cc_attached;
			$rootScope.accessToken 				= response.guest_web_token;

		};

	   $scope.errorOpts = {
	      backdrop: true,
	      backdropClick: true,
	      templateUrl: '/assets/checkoutnow/partials/Fontainebleau/externalVerificationErrorModal.html',
	      controller: verificationModalCtrl
        };

		externalVerificationService.verifyUser(params).then(function(response) {

			setReservartionDetails(response);
			$rootScope.isRoomVerified =  true;
			$scope.isLoading = false;

			if($rootScope.isLateCheckoutAvailable ){
				$state.go('checkOutOptions');
			}else {
				$state.go('checkOutConfirmation');
			}

		},function(){
			$scope.isLoading = false;
			$modal.open($scope.errorOpts); // error modal popup
		});
	};
};

var dependencies = [
'$scope',
'externalVerificationService','$rootScope','$state','dateFilter','$filter','$modal',
externalVerificationViewController
];

snt.controller('externalVerificationViewController', dependencies);
})();

snt.controller('verificationErrorController', ['$scope', function($scope) {

	$scope.doneClicked = function(){

	}

}]);

// controller for the modal

  var verificationModalCtrl = function ($scope, $modalInstance,$state) {

    $scope.closeDialog = function () {
      $modalInstance.dismiss('cancel');
    };

  };