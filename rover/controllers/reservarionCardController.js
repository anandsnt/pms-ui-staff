sntRover.controller('reservationCardController',['$scope', 'RVReservationCardSrv', function($scope, RVReservationCardSrv){
	BaseCtrl.call(this, $scope);
	$scope.timeline = "current";
	$scope.reservationList = [];
	$scope.currentReservationId = "";
	
	$scope.fetchReservationDataSuccessCallback = function(data){
		$scope.$emit('hideLoader');
		$scope.data = data;
		$scope.countCurrent = data.reservation_list.current_reservations_arr.length;
		$scope.countUpcoming = data.reservation_list.upcoming_reservations_arr.length;
		$scope.countHistory = data.reservation_list.history_reservations_arr.length;
		// $scope.currentReservationId = data.reservation_list.current_reservations_arr[0].confirmation_num;
		
		$scope.$broadcast("RESERVATIONDETAILS", $scope.currentReservationId);
		
		$scope.reservationList = data.reservation_list.current_reservations_arr;
		
	};
	$scope.fetchReservationDataFailureCallback = function(errorMessage){
		$scope.$emit('hideLoader');
		$scope.errorMessage = errorMessage;
	};
	$scope.fetchReservationData = function(reservationId){
		 
		$scope.invokeApi(RVReservationCardSrv.fetch, reservationId,$scope.fetchReservationDataSuccessCallback,$scope.fetchReservationDataFailureCallback);	
	};
	$scope.$on('guestId',function(event, data){
		
		$scope.fetchReservationData(data.reservationId);
		$scope.currentReservationId = data.confirmationNumber;
	 	RVReservationCardSrv.emptyConfirmationNumbers();
	});
	
	$scope.showTimeLineReservation = function(timeline){
		if(timeline == "current"){
			$scope.timeline = "current";
			$scope.reservationList = $scope.data.reservation_list.current_reservations_arr;
			
			if($scope.countCurrent>0){
				$scope.currentReservationId = $scope.data.reservation_list.current_reservations_arr[0].confirmation_num;
			 	$scope.$broadcast("RESERVATIONDETAILS", $scope.currentReservationId);
			} else {
				$scope.currentReservationId = "";
			 	$scope.$broadcast("RESERVATIONDETAILS", $scope.currentReservationId);
			}
			
		}
		if(timeline == "upcoming"){
			$scope.timeline = "upcoming";
			$scope.reservationList = $scope.data.reservation_list.upcoming_reservations_arr;
			if($scope.countUpcoming>0){
				$scope.currentReservationId = $scope.data.reservation_list.upcoming_reservations_arr[0].confirmation_num;
			 	$scope.$broadcast("RESERVATIONDETAILS", $scope.currentReservationId);
			} else {
				$scope.currentReservationId = "";
			 	$scope.$broadcast("RESERVATIONDETAILS", $scope.currentReservationId);
			}
			
		}
		if(timeline == "history"){
			$scope.timeline = "history";
			$scope.reservationList = $scope.data.reservation_list.history_reservations_arr;
			if($scope.countHistory > 0){
				$scope.currentReservationId = $scope.data.reservation_list.history_reservations_arr[0].confirmation_num;
			 	$scope.$broadcast("RESERVATIONDETAILS", $scope.currentReservationId);
			} else {
				$scope.currentReservationId = "";
			 	$scope.$broadcast("RESERVATIONDETAILS", $scope.currentReservationId);
			}
		}
		
	 };
	 $scope.getReservationDetails = function(currentConfirmationNumber){
	 	
	 	$scope.$broadcast("RESERVATIONDETAILS", currentConfirmationNumber);
	 	$scope.currentReservationId = currentConfirmationNumber;
	 };
}]);