sntRover.controller('RVKeyQRCodePopupController',[ '$rootScope','$scope', '$state','ngDialog','RVKeyPopupSrv','$filter', function($rootScope, $scope, $state, ngDialog, RVKeyPopupSrv, $filter){
	BaseCtrl.call(this, $scope);
	// Set up data for view
	var setupData = function(){
		var reservationStatus = "";
		if($scope.fromView === "checkin"){
			reservationStatus = $scope.reservationBillData.reservation_status;
		} else {
			reservationStatus = $scope.reservationData.reservation_card.reservation_status;
		}
    	// To check reservation status and select corresponding texts and classes.
    	if(reservationStatus === 'CHECKING_IN' ){
			$scope.data.reservationStatusText = $filter('translate')('KEY_CHECKIN_STATUS');
			$scope.data.colorCodeClass = 'check-in';
			$scope.data.colorCodeClassForClose = 'green';
		}
		else if(reservationStatus === 'CHECKEDIN' ){
			$scope.data.reservationStatusText = $filter('translate')('KEY_INHOUSE_STATUS');
			$scope.data.colorCodeClass = 'inhouse';
			$scope.data.colorCodeClassForClose = 'blue';
		}
		else if(reservationStatus === 'CHECKING_OUT'){
			$scope.data.reservationStatusText = $filter('translate')('KEY_CHECKOUT_STATUS');
			$scope.data.colorCodeClass = 'check-out';
			$scope.data.colorCodeClassForClose = 'red';
		}
	};
	setupData();

	// To handle close button click
	$scope.goToStaycard = function(){
		$scope.closeDialog();
		$state.go('rover.reservation.staycard.reservationcard.reservationdetails', {"id": $scope.reservationBillData.reservation_id, "confirmationId": $scope.reservationBillData.confirm_no, "isrefresh": true});

	};
	$scope.goToSearch = function(){
		$scope.closeDialog();
		$state.go('rover.search');

	};
	// Close popup
	$scope.closeDialog = function(){
		ngDialog.close();
	};

}]);