sntRover.controller('RVKeyEmailPopupController',[ '$rootScope','$scope','ngDialog','RVKeyPopupSrv', '$state','$filter', function($rootScope, $scope, ngDialog, RVKeyPopupSrv, $state, $filter){
	BaseCtrl.call(this, $scope);
	$scope.errorMessage = '';
	// Set up data for view
	var setupData = function(){
		var reservationId = "";
		var reservationStatus = "";
		if($scope.fromView === "checkin"){
			reservationId = $scope.reservationBillData.reservation_id;
			reservationStatus = $scope.reservationBillData.reservation_status;
		} else {
			reservationId = $scope.reservationData.reservation_card.reservation_id;
			reservationStatus = $scope.reservationData.reservation_card.reservation_status;
		}

		var successCallback = function(data){

			$scope.$emit('hideLoader');
	    	$scope.data = {};
	    	$scope.data = data;
	    	$scope.errorMessage = '';

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

	  	var failureCallback = function(data){
	  		$scope.$emit('hideLoader');
	  		$scope.errorMessage = data;
	    };

		$scope.invokeApi(RVKeyPopupSrv.fetchKeyEmailData,{ "reservationId": reservationId }, successCallback, failureCallback);

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