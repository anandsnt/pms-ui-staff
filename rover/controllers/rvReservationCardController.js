sntRover.controller('reservationCardController',[ '$rootScope','$scope', 'RVReservationCardSrv', function($rootScope, $scope, RVReservationCardSrv){
	BaseCtrl.call(this, $scope);
	$scope.timeline = "";
	$scope.reservationList = [];
	$scope.currentReservationId = "";
	$scope.reservationCount = 0;
	
	
	/*
	 * to get state params from resrvation details controller
	 */
	$scope.$on('passReservationParams',function(event, data){
		
		// $scope.fetchReservationData(data.reservationId);
		// $scope.currentReservationId = data.confirmationNumber;

		$scope.data = data;
		$scope.timeline = data.reservation_details.timeline;;
		
		$scope.countCurrent = data.reservation_list.current_reservations_arr.length;
		$scope.countUpcoming = data.reservation_list.upcoming_reservations_arr.length;
		$scope.countHistory = data.reservation_list.history_reservations_arr.length;
		
		$scope.currentReservationId = data.reservation_details.confirmation_num;
		
		if($scope.timeline == "current"){
			$scope.reservationList = data.reservation_list.current_reservations_arr;
			//This status is used to show appr message if count of reservations in selected time line is zero
			$scope.reservationDisplayStatus = 	($scope.countCurrent>0) ? true : false;
		}
		if($scope.timeline == "upcoming"){
			$scope.reservationList = data.reservation_list.upcoming_reservations_arr;
			//This status is used to show appr message if count of reservations in selected time line is zero
			$scope.reservationDisplayStatus = 	($scope.countUpcoming>0) ? true : false;
		}
		if($scope.timeline == "history"){
			$scope.reservationList = data.reservation_list.history_reservations_arr;
			//This status is used to show appr message if count of reservations in selected time line is zero
			$scope.reservationDisplayStatus = 	($scope.countHistory>0) ? true : false;
		}
		
		RVReservationCardSrv.setGuestData($scope.data.guest_details);

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
			//This status is used to show appr message if count of reservations in selected time line is zero
			$scope.reservationDisplayStatus = 	($scope.countCurrent>0) ? true : false;
			
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
			//This status is used to show appr message if count of reservations in selected time line is zero
			$scope.reservationDisplayStatus = 	($scope.countUpcoming>0) ? true : false;
			
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
			//This status is used to show appr message if count of reservations in selected time line is zero
			$scope.reservationDisplayStatus = ($scope.countHistory>0) ? true : false;
		}
		 $scope.$broadcast('RESERVATIONLISTUPDATED');
		
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