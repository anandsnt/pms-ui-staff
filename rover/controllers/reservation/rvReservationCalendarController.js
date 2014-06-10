sntRover.controller('RVReservationDatePickerController', ['$scope','ngDialog', function($scope,ngDialog){

	$scope.date = $scope.reservationData.arrivalDate;
	if($scope.date)
		$scope.isDateSelected = true;


	$scope.dateSelected =  function(){
		$scope.$parent.reservationData.arrivalDate = $scope.date;
		ngDialog.close();
	};

}]);