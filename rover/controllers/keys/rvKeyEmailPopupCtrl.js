sntRover.controller('RVKeyEmailPopupCtrlController',[ '$rootScope','$scope','ngDialog','RVKeyPopupSrv', function($rootScope, $scope, ngDialog, RVKeyPopupSrv){
	
	console.log("reservation id"+$scope.reservationData.reservation_card.reservation_id);
	// Set up data for view
	var setupData = function(){
		var reservationId = $scope.reservationData.reservation_card.reservation_id;
		var reservationStatus = $scope.reservationData.reservation_card.reservation_status;
		var successCallback = function(data){
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
			$scope.closeActivityIndication();
	    };
	    
	  	var failureCallback = function(data){
	  		$scope.closeActivityIndication();
	    };
		
		$scope.invokeApi(RVKeyPopupSrv.fetchKeyEmailData,{ "reservation_id": reservation_id }, successCallback, failureCallback);  

	};
	setupData();
	
	// To handle close button click
	$scope.closeButtonClick = function(){
		ngDialog.close();
	};
	
}]);