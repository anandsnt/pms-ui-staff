sntRover.controller('RVReservationSummaryAndConfirmCtrl', ['$scope', '$state', 'RVReservationSummarySrv', 
					function($scope, $state, RVReservationSummarySrv){
	BaseCtrl.call(this, $scope);

	$scope.init = function(){
		$scope.data = {};
		$scope.data.isConfirmationEmailSameAsGuestEmail = true;
		$scope.data.paymentMethods = [];

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

	var fetchPaymentMethods = function(){
		var paymentFetchSuccess = function(data) {
			$scope.data.paymentMethods = data;
			console.log(JSON.stringify($scope.data.paymentMethods));
			$scope.$emit('hideLoader');
		};
		
		$scope.invokeApi(RVReservationSummarySrv.fetchPaymentMethods, {}, paymentFetchSuccess);

	};

	$scope.confirmEmailCheckboxClicked = function(){

		$scope.reservationData.guest.sendConfirmMailTo = '';
		if($scope.data.isConfirmationEmailSameAsGuestEmail) {
			$scope.reservationData.guest.sendConfirmMailTo = $scope.reservationData.guest.email;
		} 
	};

	var computeReservationDataToSave = function() {
		//TODO: add confirm emeil
		var data = {};
		data.arrival_date = $scope.reservationData.arrivalDate;
		data.arrival_time = getTimeFormated($scope.reservationData.checkinTime.hh, 
											$scope.reservationData.checkinTime.mm, 
											$scope.reservationData.checkinTime.ampm);
		data.departure_date = $scope.reservationData.departureDate;
		data.departure_time = getTimeFormated($scope.reservationData.checkoutTime.hh, 
											$scope.reservationData.checkoutTime.mm,
											$scope.reservationData.checkoutTime.ampm);
		
		data.adults_count = $scope.reservationData.rooms.numAdults;
		data.children_count = $scope.reservationData.rooms.numChildren;
		data.infants_count = $scope.reservationData.rooms.numInfants;
		data.rate_id = $scope.reservationData.rooms.rateId;
		data.room_type_id = $scope.reservationData.rooms.roomTypeId;

		if($scope.reservationData.guest.id != null) {
			data.guest_detail_id = $scope.reservationData.guest.id;
		} else {
			data.guest_detail = {};
			data.guest_detail.first_name = $scope.reservationData.guest.firstName;
			data.guest_detail.last_name = $scope.reservationData.guest.lastName;
			data.guest_detail.email = $scope.reservationData.guest.email;
			data.guest_detail.payment_type = {};
			data.guest_detail.payment_type.type_id = $scope.reservationData.paymentType.type.name;//TODO: verify
			data.guest_detail.payment_type.card_number = $scope.reservationData.paymentType.ccDetails.number;
			data.guest_detail.payment_type.expiry_date = $scope.reservationData.paymentType.ccDetails.expMonth +
															$scope.reservationData.paymentType.ccDetails.expMonth; //TODO: format
			data.guest_detail.payment_type.card_name = $scope.reservationData.paymentType.ccDetails.nameOnCard;
			
		}

		if($scope.reservationData.company.id != null) {
			data.company_id = $scope.reservationData.company.id;
		} else {
			data.company = {};
			data.company.name = $scope.reservationData.company.name;
			data.company.corporate_id = $scope.reservationData.company.corporateid;
		}

		if($scope.reservationData.travelAgent.id != null) {
			data.travel_agent_id = $scope.reservationData.travelAgent.id;
		} else {
			data.travel_agent = {};
			data.travel_agent.name = $scope.reservationData.travelAgent.name;
			data.travel_agent.corporate_id = $scope.reservationData.travelAgent.iataNumber; //TODO: verify iataNum vs corporateid
		}

		data.reservation_type_id = $scope.reservationData.demographics.reservationType;
		data.source_id = $scope.reservationData.demographics.source;
		data.market_segment_id = $scope.reservationData.demographics.market;
		data.booking_origin_id = $scope.reservationData.demographics.origin;
		data.confirmation_email = $scope.reservationData.guest.sendConfirmMailTo;

		console.log(JSON.stringify(data));

		return data;

	};

	$scope.clickedConfirmAndGoToDashboard = function() {
		var postData = computeReservationDataToSave();

		var saveSuccess = function(data) {
			$scope.$emit('hideLoader');
			$scope.initReservationData();
			goToReservationSearch();
		};

		$scope.invokeApi(RVReservationSummarySrv.saveReservation, postData, saveSuccess);


	};

	$scope.clickedConfirmAndCreateNew = function(){
		var postData = computeReservationDataToSave();

		var saveSuccess = function(data) {
			$scope.$emit('hideLoader');
			goToReservationSearch();
		};

		$scope.invokeApi(RVReservationSummarySrv.saveReservation, postData, saveSuccess);
	};

	$scope.cancelButtonClicked = function(){
		$scope.initReservationData();
		goToReservationSearch();
	};

	var goToReservationSearch = function(){
		$state.go('rover.reservation.search');
	};

	$scope.init();

}]);