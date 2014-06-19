sntRover.controller('RVReservationConfirmCtrl', ['$scope', '$state', 'RVReservationSummarySrv', 
					function($scope, $state, RVReservationSummarySrv){
	BaseCtrl.call(this, $scope);

	$scope.init = function(){
	};

	$scope.isCheckinTimeSet = function() {
		var ret = false;
		if($scope.reservationData.checkinTime.hh != '' &&
			 $scope.reservationData.checkinTime.mm != '' &&
			  $scope.reservationData.checkinTime.ampm!= '') {

			ret = true;
		}
		return ret;
	};

	$scope.isCheckoutTimeSet = function() {
		var ret = false;
		if($scope.reservationData.checkoutTime.hh != '' &&
			 $scope.reservationData.checkoutTime.mm != '' &&
			  $scope.reservationData.checkoutTime.ampm!= '') {

			ret = true;
		}
		return ret;

	}

	$scope.init();

}]);