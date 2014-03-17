sntRover.controller('reservationCardPaymentMethodController',['$scope', function($scope){

	

	var loadData = function(){
		$scope.paymentmethod = $scope.currentReservation.payment_details[0];
		$scope.guarentee_type = $scope.currentReservation.guarentee_type;
	}
}]);