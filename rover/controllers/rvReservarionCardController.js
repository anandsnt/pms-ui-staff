sntRover.controller('reservationCardController',['$scope', 'RVReservationCardSrv', function($scope, RVReservationCardSrv){
	BaseCtrl.call(this, $scope);
	$scope.timeline = "current";
	$scope.reservationList = [];
	$scope.currentReservationId = "";
	/*
	 * Fetch reservation list successcallback
	 * @param {object} data
	 */
	$scope.fetchReservationDataSuccessCallback = function(data){
		$scope.$emit('hideLoader');
		$scope.data = data;
		$scope.countCurrent = data.reservation_list.current_reservations_arr.length;
		$scope.countUpcoming = data.reservation_list.upcoming_reservations_arr.length;
		$scope.countHistory = data.reservation_list.history_reservations_arr.length;
				
		$scope.$broadcast("RESERVATIONDETAILS", $scope.currentReservationId);
		
		$scope.reservationList = data.reservation_list.current_reservations_arr;
		
	};
	/*
	 * Fetch reservation list failure callback
	 * @param {string} erorr message
	 */
	$scope.fetchReservationDataFailureCallback = function(errorMessage){
		$scope.$emit('hideLoader');
		$scope.errorMessage = errorMessage;
	};
	/*
	 * Fetch reservation list
	 * @param {string} reservation id
	 */
	$scope.fetchReservationData = function(reservationId){
		 
		$scope.invokeApi(RVReservationCardSrv.fetch, reservationId,$scope.fetchReservationDataSuccessCallback,$scope.fetchReservationDataFailureCallback);	
	};
	/*
	 * to get state params from resrvation details controller
	 */
	$scope.$on('passReservationParams',function(event, data){
		
		$scope.fetchReservationData(data.reservationId);
		$scope.currentReservationId = data.confirmationNumber;
	 	RVReservationCardSrv.emptyConfirmationNumbers();
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