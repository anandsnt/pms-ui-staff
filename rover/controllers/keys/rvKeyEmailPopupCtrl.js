sntRover.controller('RVKeyEmailPopupCtrlController',[ '$rootScope','$scope','ngDialog','RVKeyEmailPopupSrv', function($rootScope, $scope, ngDialog, RVKeyEmailPopupSrv){
	
	console.log("reservation id"+$scope.reservationData.reservation_card.reservation_id);
	// Set up data for view
	var setupData = function(){
		var reservation_id = $scope.reservationData.reservation_card.reservation_id;
		var successCallback = function(data){
	    	console.log(data);
	    	
	    };
	    
	  	var failureCallback = function(data){
	  		$scope.$emit('hideLoader');
	    };
		
		$scope.invokeApi(RVKeyEmailPopupSrv.fetchKeyEmailData,{ "reservation_id": reservation_id }, successCallback, failureCallback);  

	};
	setupData();
	
	// To handle close button click
	$scope.closeButtonClick = function(){
		ngDialog.close();
	};
	
}]);