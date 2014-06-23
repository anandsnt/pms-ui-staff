sntRover.controller('RVKeyQRCodePopupController',[ '$rootScope','$scope','ngDialog','RVKeyPopupSrv', function($rootScope, $scope, ngDialog, RVKeyPopupSrv){
	
	// Set up data for view
	var setupData = function(){
		var reservationId = "";
		var reservationStatus = "";
		if($scope.fromView == "checkin"){
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
	    	
	    	// To check reservation status and select corresponding texts and classes.
	    	if(reservationStatus == 'CHECKING_IN' ){
				$scope.data.reservationStatusText = 'Check in Complete';
				$scope.data.colorCodeClass = 'check-in';
				$scope.data.colorCodeClassForClose = 'hidden';
			}
			else if(reservationStatus == 'CHECKEDIN' ){
				$scope.data.reservationStatusText = 'In House';
				$scope.data.colorCodeClass = 'inhouse';
				$scope.data.colorCodeClassForClose = 'blue';
			}
			else if(reservationStatus == 'CHECKING_OUT'){
				$scope.data.reservationStatusText = 'Checking Out';
				$scope.data.colorCodeClass = 'check-out';
				$scope.data.colorCodeClassForClose = 'red';
			}
			
	    };
	    
	  	var failureCallback = function(data){
	  		$scope.$emit('hideLoader');
	    };
		
		$scope.invokeApi(RVKeyPopupSrv.fetchKeyQRCodeData,{ "reservationId": reservationId }, successCallback, failureCallback);  

	};
	setupData();
	
	// To handle close button click
	$scope.goToStaycard = function(){
		$scope.closeDialog();
		$state.go('rover.staycard.reservationcard.reservationdetails', {"id": $scope.reservationBillData.reservation_id, "confirmationId": $scope.reservationBillData.confirm_no});
		
	};
	$scope.goToSearch = function(){
		$scope.closeDialog();
		$state.go('rover.search');
		
	};
	
}]);