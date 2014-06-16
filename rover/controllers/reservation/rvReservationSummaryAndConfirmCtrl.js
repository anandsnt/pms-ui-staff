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
	};

	/**
	* Compute the reservation data from the data modal to be passed to the API
	*/
	var computeReservationDataToSave = function() {
		var data = {};
		data.arrival_date = $scope.reservationData.arrivalDate;
		data.arrival_time = getTimeFormated($scope.reservationData.checkinTime.hh, 
											$scope.reservationData.checkinTime.mm, 
											$scope.reservationData.checkinTime.ampm);
		data.departure_date = $scope.reservationData.departureDate;
		data.departure_time = getTimeFormated($scope.reservationData.checkoutTime.hh, 
											$scope.reservationData.checkoutTime.mm,
											$scope.reservationData.checkoutTime.ampm);
		
		data.adults_count = parseInt($scope.reservationData.rooms[0].numAdults);
		data.children_count = parseInt($scope.reservationData.rooms[0].numChildren);
		data.infants_count = parseInt($scope.reservationData.rooms[0].numInfants);
		data.rate_id = parseInt($scope.reservationData.rooms[0].rateId);
		data.room_type_id = parseInt($scope.reservationData.rooms[0].roomTypeId);

		// Guest details
		if($scope.reservationData.guest.id != null && $scope.reservationData.guest.id != '') {
			data.guest_detail_id = $scope.reservationData.guest.id;
		} else {
			data.guest_detail = {};
			data.guest_detail.first_name = $scope.reservationData.guest.firstName;
			data.guest_detail.last_name = $scope.reservationData.guest.lastName;
			data.guest_detail.email = $scope.reservationData.guest.email;
			data.guest_detail.payment_type = {};
			data.guest_detail.payment_type.type_id = parseInt($scope.reservationData.paymentType.type.id);//TODO: verify
			data.guest_detail.payment_type.card_number = $scope.reservationData.paymentType.ccDetails.number;
			data.guest_detail.payment_type.expiry_date = $scope.reservationData.paymentType.ccDetails.expYear + '-' +
															$scope.reservationData.paymentType.ccDetails.expMonth; //TODO: format
			data.guest_detail.payment_type.card_name = $scope.reservationData.paymentType.ccDetails.nameOnCard;
			
		}

		//Company card
		if($scope.reservationData.company.id != null && $scope.reservationData.company.id != '') {
			data.company_id = $scope.reservationData.company.id;
		} else {
			if($scope.reservationData.company.name != "") {
				data.company = {};
				data.company.name = $scope.reservationData.company.name;
				data.company.account_number = $scope.reservationData.company.corporateid;
			}
		}
		//Travel agent
		if($scope.reservationData.travelAgent.id != null && $scope.reservationData.travelAgent.id != '') {
			data.travel_agent_id = $scope.reservationData.travelAgent.id;
		} else {
			if($scope.reservationData.travelAgent.name != "") {
				data.travel_agent = {};
				data.travel_agent.name = $scope.reservationData.travelAgent.name;
				data.travel_agent.account_number = $scope.reservationData.travelAgent.iataNumber; //TODO: verify iataNum vs corporateid
			}
		}

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
	$scope.clickedConfirmAndGoToDashboard = function() {
		var postData = computeReservationDataToSave();

		var saveSuccess = function(data) {
			$scope.$emit('hideLoader');
			$scope.initReservationData();
			goToReservationSearch();
		};

		$scope.invokeApi(RVReservationSummarySrv.saveReservation, postData, saveSuccess);
	};

	/**
	* Click handler for confirm button - 
	* Creates the reservation and Go back to the reservation search screen
	* Will retain the guest information
	*/
	$scope.clickedConfirmAndCreateNew = function(){
		var postData = computeReservationDataToSave();

		var saveSuccess = function(data) {
			$scope.$emit('hideLoader');
			goToReservationSearch();
		};
		$scope.invokeApi(RVReservationSummarySrv.saveReservation, postData, saveSuccess);
	};

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

	$scope.init();

}]);