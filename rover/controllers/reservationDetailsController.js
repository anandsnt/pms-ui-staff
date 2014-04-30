sntRover.controller('reservationDetailsController',['$scope','RVReservationCardSrv', function($scope, RVReservationCardSrv){
	
	$scope.reservationDetailsFetchSuccessCallback = function(data){
		$scope.$emit('hideLoader');
		$scope.reservationData = data;
	};
	
	 $scope.$on("RESERVATIONDETAILS", function(event, confirmationNumber){
	 	
	 	if(confirmationNumber){
	 		  $scope.invokeApi(RVReservationCardSrv.fetchReservationDetails, confirmationNumber, $scope.reservationDetailsFetchSuccessCallback);	
	 	} else {
	 		$scope.reservationData = {};
	 	}
	  
  	});
}]);