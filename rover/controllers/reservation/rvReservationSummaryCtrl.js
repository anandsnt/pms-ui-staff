sntRover.controller('RVReservationSummaryCtrl', ['$rootScope', '$scope', '$state', 'RVReservationSummarySrv', 
					function($rootScope, $scope, $state, RVReservationSummarySrv){

	BaseCtrl.call(this, $scope);
	var MLISessionId =  "";

	$scope.init = function(){
		$scope.data = {};
		$scope.data.isConfirmationEmailSameAsGuestEmail = true;
		$scope.data.paymentMethods = [];
		$scope.heading = "Guest Details & Payment";

		$scope.$parent.myScrollOptions = {		
		    'reservationSummary': {
		    	scrollbars: true,
		        snap: false,
		        hideScrollbar: false
		    }, 
		    'paymentInfo': {
		    	scrollbars: true,
		        hideScrollbar: false,
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
		$scope.refreshPaymentScroller();
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
			data.payment_type = {};
			data.payment_type.type_id = parseInt($scope.reservationData.paymentType.type.id);
			//TODO: verify
			//data.payment_type.card_number = $scope.reservationData.paymentType.ccDetails.number;
			data.payment_type.expiry_date = ($scope.reservationData.paymentType.ccDetails.expYear == "" || $scope.reservationData.paymentType.ccDetails.expYear == "") ? "" : "20"+ $scope.reservationData.paymentType.ccDetails.expYear + "-" + 
															$scope.reservationData.paymentType.ccDetails.expMonth + "-01"
			data.payment_type.card_name = $scope.reservationData.paymentType.ccDetails.nameOnCard;
		
		}
		
		// MLI Integration.
		if($scope.reservationData.paymentType.type.value === "CC"){
			data.payment_type.session_id = MLISessionId;
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

	$scope.proceedCreatingReservation = function(){
		var postData = computeReservationDataToSave();

		var saveSuccess = function(data) {
			$scope.$emit('hideLoader');
			$scope.reservationData.reservationId = data.id;
			$scope.reservationData.confirmNum = data.confirm_no;
			$state.go('rover.reservation.mainCard.reservationConfirm');
			MLISessionId = "";
			
		};
		var saveFailure =  function(data){
			$scope.$emit('hideLoader');
			$scope.errorMessage = data;
			MLISessionId = "";

		}

		$scope.invokeApi(RVReservationSummarySrv.saveReservation, postData, saveSuccess,saveFailure);
	}

	/**
	* MLI integration 
	*
	*/
	$scope.fetchMLISession = function(){

		 var sessionDetails = {};
			 sessionDetails.cardNumber = $scope.reservationData.paymentType.ccDetails.number;
			 sessionDetails.cardSecurityCode = $scope.reservationData.paymentType.ccDetails.cvv;
			 sessionDetails.cardExpiryMonth = $scope.reservationData.paymentType.ccDetails.expMonth;
			 sessionDetails.cardExpiryYear = $scope.reservationData.paymentType.ccDetails.expYear;
		
		 var callback = function(response){
		 	
		 	$scope.$emit("hideLoader");
		 	$scope.$apply();
		 	if(response.status ==="ok"){

		 		MLISessionId = response.session;
		 		$scope.proceedCreatingReservation();// call save payment details WS
		 		
		 	}
		 	else{
		 		$scope.errorMessage = ["There is a problem with your credit card"];
		 	}			 	
		 }
		 $scope.$emit("showLoader");
		 HostedForm.updateSession(sessionDetails, callback);		;
	}


	$scope.setUpMLIConnection = function(){
		HostedForm.setMerchant($rootScope.MLImerchantId);
	}();




	/**
	* Click handler for confirm button - 
	* Creates the reservation and on success, goes to the confirmation screen
	*/
	$scope.submitReservation = function(){

		
	   if($scope.reservationData.paymentType.type.value === "CC"){
		
			if($scope.reservationData.paymentType.ccDetails.number.length ===0){
				$scope.errorMessage = ["There is a problem with your credit card"];
			}else{
				$scope.fetchMLISession();
			}			
		}
		else{
			$scope.proceedCreatingReservation();
		}
		
	};

	/**
	* Click handler for cancel button - Go back to the reservation search screen
	* Does not save the reservation
	*/
	$scope.cancelButtonClicked = function(){
		$scope.initReservationData();
		$state.go('rover.reservation.search');
	};
	
	$scope.refreshPaymentScroller = function(){
		setTimeout( function(){
		$scope.$parent.myScroll['paymentInfo'].refresh();}, 0);
	};

	$scope.init();

}]);