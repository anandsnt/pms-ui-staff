sntRover.controller('RVReservationSummaryAndConfirmCtrl', ['$scope', '$state', 'RVReservationSummarySrv', 
					function($scope, $state, RVReservationSummarySrv){
	BaseCtrl.call(this, $scope);

	$scope.init = function(){
		$scope.data = {};
		$scope.data.isConfirmationEmailSameAsGuestEmail = true;
		$scope.data.paymentMethods = [];
		$scope.heading = "Guest Details & Payment";

		$scope.$parent.myScrollOptions = {		
		    'reservationSummary': {
		    	scrollbars: true,
		        snap: false,
		        hideScrollbar: false,
		        preventDefault: false
		    }, 
		    'paymentInfo': {
		    	scrollbars: true,
		        snap: false,
		        hideScrollbar: false,
		        preventDefault: false
		    }, 
		};
		fetchPaymentMethods();
		
	}

	/**
	* Fetches all the payment methods
	*/
	var fetchPaymentMethods = function(){
		var paymentFetchSuccess = function(data) {
			$scope.data.paymentMethods = data;
			console.log(JSON.stringify($scope.data.paymentMethods));
			$scope.$emit('hideLoader');
		};
		
		$scope.invokeApi(RVReservationSummarySrv.fetchPaymentMethods, {}, paymentFetchSuccess);

	};

	/**
	* Click handler for confirm email Checkbox.
	* If checked, copies the guest email to the confirm email
	*/
	$scope.confirmEmailCheckboxClicked = function(){

		$scope.reservationData.guest.sendConfirmMailTo = '';
		if($scope.data.isConfirmationEmailSameAsGuestEmail) {
			$scope.reservationData.guest.sendConfirmMailTo = $scope.reservationData.guest.email;
		} 
		//$scope.refreshPaymentScroller();
	};

	/**
	* Build the reservation data from the data modal to be passed to the API
	*/
	var computeReservationDataToSave = function() {
		var data = {};
		data.arrival_date = $scope.reservationData.arrivalDate;
		data.arrival_time = '';
		//Check if the check-in time is set by the user. If yes, format it to the 24hr format and build the API data.
		if($scope.reservationData.checkinTime.hh != '' && $scope.reservationData.checkinTime.mm != '' && $scope.reservationData.checkinTime.ampm!= '') {
			data.arrival_time = getTimeFormated($scope.reservationData.checkinTime.hh, 
											$scope.reservationData.checkinTime.mm, 
											$scope.reservationData.checkinTime.ampm);	
		}
		data.departure_date = $scope.reservationData.departureDate;
		data.departure_time = '';
		//Check if the checkout time is set by the user. If yes, format it to the 24hr format and build the API data.
		if($scope.reservationData.checkoutTime.hh != '' && $scope.reservationData.checkoutTime.mm != '' && $scope.reservationData.checkinTime.ampm!= '') {
			data.arrival_time = getTimeFormated($scope.reservationData.checkoutTime.hh, 
											$scope.reservationData.checkoutTime.mm, 
											$scope.reservationData.checkoutTime.ampm);	
		}
		
		data.adults_count = parseInt($scope.reservationData.rooms[0].numAdults);
		data.children_count = parseInt($scope.reservationData.rooms[0].numChildren);
		data.infants_count = parseInt($scope.reservationData.rooms[0].numInfants);
		data.rate_id = parseInt($scope.reservationData.rooms[0].rateId);
		data.room_type_id = parseInt($scope.reservationData.rooms[0].roomTypeId);

		//Guest details
		data.guest_detail = {};
		data.guest_detail.id = $scope.reservationData.guest.id;
		data.guest_detail.first_name = $scope.reservationData.guest.firstName;
		data.guest_detail.last_name = $scope.reservationData.guest.lastName;
		data.guest_detail.email = $scope.reservationData.guest.email;
		if(!isEmpty($scope.reservationData.paymentType.type)){
			data.guest_detail.payment_type = {};
			data.guest_detail.payment_type.type_id = parseInt($scope.reservationData.paymentType.type.id);//TODO: verify
			data.guest_detail.payment_type.card_number = $scope.reservationData.paymentType.ccDetails.number;
			data.guest_detail.payment_type.expiry_date = ($scope.reservationData.paymentType.ccDetails.expYear == "" || $scope.reservationData.paymentType.ccDetails.expYear == "") ? "" : "20"+ $scope.reservationData.paymentType.ccDetails.expYear + "-" + 
															$scope.reservationData.paymentType.ccDetails.expMonth + "-01"
			data.guest_detail.payment_type.card_name = $scope.reservationData.paymentType.ccDetails.nameOnCard;

		}
		
														
		data.company_id = $scope.reservationData.company.id;
		data.travel_agent_id = $scope.reservationData.travelAgent.id;
		data.reservation_type_id = parseInt($scope.reservationData.demographics.reservationType);
		data.source_id = parseInt($scope.reservationData.demographics.source);
		data.market_segment_id = parseInt($scope.reservationData.demographics.market);
		data.booking_origin_id = parseInt($scope.reservationData.demographics.origin);
		data.confirmation_email = $scope.reservationData.guest.sendConfirmMailTo;

		return data;

	};

	/**
	* Click handler for confirm button - 
	* Creates the reservation and Go back to the reservation search screen
	*/
/*	$scope.clickedConfirmAndGoToDashboard = function() {
		var postData = computeReservationDataToSave();

		var saveSuccess = function(data) {
			$scope.$emit('hideLoader');
			$scope.initReservationData();
			goToReservationSearch();
		};

		$scope.invokeApi(RVReservationSummarySrv.saveReservation, postData, saveSuccess);
	};*/

	/**
	* Click handler for confirm button - 
	* Creates the reservation and on success, goes to the confirmation screen
	*/
	$scope.submitReservation = function(){
		var postData = computeReservationDataToSave();

		var saveSuccess = function(data) {
			$scope.$emit('hideLoader');
			$scope.reservationData.reservationId = data.id;
			$scope.reservationData.confirmNum = data.confirm_no;
			$state.go('rover.reservation.mainCard.reservationConfirm');
			
		};

		$scope.invokeApi(RVReservationSummarySrv.saveReservation, postData, saveSuccess);
	};

	/**
	* Click handler for confirm button - 
	* Creates the reservation and Go back to the reservation search screen
	* Will retain the guest information
	*/
	/*$scope.clickedConfirmAndCreateNew = function(){
		var postData = computeReservationDataToSave();

		var saveSuccess = function(data) {
			$scope.$emit('hideLoader');
			goToReservationSearch();
		};
		$scope.invokeApi(RVReservationSummarySrv.saveReservation, postData, saveSuccess);
	};*/

	/**
	* Click handler for cancel button - Go back to the reservation search screen
	* Does not save the reservation
	*/
	$scope.cancelButtonClicked = function(){
		$scope.initReservationData();
		goToReservationSearch();
	};

	var goToReservationSearch = function(){
		$state.go('rover.reservation.search');
	};

	$scope.refreshPaymentScroller = function(){
		$scope.$parent.myScroll['paymentInfo'].refresh();
	};

	$scope.init();

}]);