sntRover.controller('reservationDetailsController',['$scope','RVReservationCardSrv', function($scope, RVReservationCardSrv){
	
	$scope.reservationDetailsFetchSuccessCallback = function(data){
		$scope.$emit('hideLoader');
		$scope.reservationData = data;
		console.log(JSON.stringify($scope.reservationData));
	};
	
	 $scope.$on("DO_BIDDING", function(event, confirmationNumber){
	 	alert(confirmationNumber);
	 	if(confirmationNumber){
	 		  $scope.invokeApi(RVReservationCardSrv.fetchReservationDetails, confirmationNumber, $scope.reservationDetailsFetchSuccessCallback);	
	 	} else {
	 		$scope.reservationData = {};
	 	}
	  
  	});
}]);