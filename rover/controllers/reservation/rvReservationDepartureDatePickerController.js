sntRover.controller('RVReservationDepartureDatePickerController', ['$scope','ngDialog','dateFilter', function($scope,ngDialog,dateFilter){

	$scope.date = $scope.reservationData.departureDate;

	if($scope.date)
		$scope.isDateSelected = true;
	else
		$scope.date = dateFilter(new Date(), 'yyyy-MM-dd');

	$scope.mindate  = dateFilter(new Date(), 'yyyy-MM-dd');

	/*
	 * will be called from directive
	 */
	$scope.dateSelected =  function(){
		$scope.$parent.reservationData.departureDate = $scope.date;
		ngDialog.close();
	};

}]);