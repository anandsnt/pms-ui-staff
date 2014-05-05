sntRover.controller('reservationDetailsController',['$scope','RVReservationCardSrv',  '$stateParams', function($scope, RVReservationCardSrv, $stateParams){
	
	$scope.reservationDetailsFetchSuccessCallback = function(data){
		
		$scope.$emit('hideLoader');
		$scope.reservationData = data;
		$scope.$emit('showStaycard');
	};
	
	 $scope.$on("RESERVATIONDETAILS", function(event, confirmationNumber){
	 	
	 	if(confirmationNumber){
	 		  $scope.invokeApi(RVReservationCardSrv.fetchReservationDetails, confirmationNumber, $scope.reservationDetailsFetchSuccessCallback);	
	 	} else {
	 		$scope.reservationData = {};
	 	}
	  
  	});
  	var passData = {confirmationNumber: $stateParams.confirmationId, reservationId: $stateParams.id};
  	$scope.$emit('guestId', passData);
}]);