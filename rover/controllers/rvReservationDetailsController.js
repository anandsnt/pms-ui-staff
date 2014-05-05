sntRover.controller('reservationDetailsController',['$scope','RVReservationCardSrv',  '$stateParams', function($scope, RVReservationCardSrv, $stateParams){
	/*
	 * success call back of fetch reservation details
	 */
	$scope.reservationDetailsFetchSuccessCallback = function(data){
		
		$scope.$emit('hideLoader');
		$scope.reservationData = data;
		$scope.$emit('showStaycard');
	};
	/*
	 * Fetch reservation details on selecting or clicking each reservation from reservations list
	 * @param {int} confirmationNumber => confirmationNumber of reservation
	 */
	$scope.$on("RESERVATIONDETAILS", function(event, confirmationNumber){
	 	
	 	if(confirmationNumber){
	 		  $scope.invokeApi(RVReservationCardSrv.fetchReservationDetails, confirmationNumber, $scope.reservationDetailsFetchSuccessCallback);	
	 	} else {
	 		$scope.reservationData = {};
	 	}
	  
  	});
  	//To pass confirmation number and resrvation id to reservation Card controller.
  	var passData = {confirmationNumber: $stateParams.confirmationId, reservationId: $stateParams.id};
  	$scope.$emit('passReservationParams', passData);
}]);