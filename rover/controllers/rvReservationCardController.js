sntRover.controller('reservationCardController',['$scope', 'RVReservationCardSrv', function($scope, RVReservationCardSrv){
	BaseCtrl.call(this, $scope);
	$scope.timeline = "current";
	$scope.reservationList = [];
	$scope.currentReservationId = "";
	/*
	 * to get state params from resrvation details controller
	 */
	$scope.$on('passReservationParams',function(event, data){
		
		// $scope.fetchReservationData(data.reservationId);
		// $scope.currentReservationId = data.confirmationNumber;

		$scope.data = data;
		$scope.countCurrent = data.reservation_list.current_reservations_arr.length;
		$scope.countUpcoming = data.reservation_list.upcoming_reservations_arr.length;
		$scope.countHistory = data.reservation_list.history_reservations_arr.length;
				
		// $scope.$broadcast("RESERVATIONDETAILS", $scope.currentReservationId);
		$scope.currentReservationId = data.reservation_details.confirmation_num;
		$scope.reservationList = data.reservation_list.current_reservations_arr;
		
		RVReservationCardSrv.setGuestData($scope.data.guest_details);

	var fetchGuestcardDataSuccessCallback = function(data){
		var contactInfoData = {'data': data,
								'countries': $scope.data.countries};
        $scope.$emit('guestCardUpdateData',contactInfoData);
        $scope.$emit('hideLoader');
    };
    var fetchGuestcardDataFailureCallback = function(data){
        $scope.$emit('hideLoader');
    };
   
    var param = {'fakeDataToAvoidCache':new Date(),
					'id':$scope.data.guest_details.reservation_id}
    $scope.invokeApi(RVReservationCardSrv.fetchGuestcardData,param,fetchGuestcardDataSuccessCallback,fetchGuestcardDataFailureCallback);  


		
		// $scope.$broadcast('passGuestDetails', $scope.data.guest_details);
	});
	/*
	 * Handles time line click events
	 * @param {string} time line
	 */
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
	 /*
	  * get reservation details on click each reservation
	  * @param {string} current clicked confirmation number
	  */
	 $scope.getReservationDetails = function(currentConfirmationNumber){
	 	
	 	$scope.$broadcast("RESERVATIONDETAILS", currentConfirmationNumber);
	 	$scope.currentReservationId = currentConfirmationNumber;
	 };
}]);