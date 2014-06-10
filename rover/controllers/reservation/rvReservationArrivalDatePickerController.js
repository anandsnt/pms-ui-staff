sntRover.controller('RVReservationArrivalDatePickerController', ['$scope','ngDialog','dateFilter', function($scope,ngDialog,dateFilter){

	$scope.date = $scope.reservationData.arrivalDate;
	
	if($scope.date)
		$scope.isDateSelected = true;
	else
		$scope.date = dateFilter(new Date(), 'yyyy-MM-dd');
	
	$scope.mindate  = dateFilter(new Date(), 'yyyy-MM-dd');

	/*
	 * will be called from directive
	 */
	$scope.dateSelected =  function(){
		$scope.$parent.reservationData.arrivalDate = $scope.date;

		// adjust departure date accordingly
		 var newDate =  new Date($scope.$parent.reservationData.arrivalDate);
         newDay = newDate.getDate() + $scope.reservationData.numNights;
         newDate.setDate(newDay);
         $scope.reservationData.departureDate = dateFilter(new Date(newDate), 'yyyy-MM-dd');		
		
		 ngDialog.close();
	};

}]);