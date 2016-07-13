/*
	Checkin confimation Ctrl 
	The user enetered card number and departure number are verified.
	However if the operation is autocheckin and the reservation has non CC payment type, then the card entry is not required.
	The reservation details will be the  in the API response of the verification API.
*/

(function() {
	var checkInConfirmationViewController = function($scope,$modal,$rootScope,$state, dateFilter, $filter, checkinConfirmationService,checkinDetailsService) {


	$scope.pageValid = false;
	var dateToSend = '';
	if($rootScope.isCheckedin){
		$state.go('checkinSuccess');
	}
	else{
		$scope.pageValid = true;
	}
	//uncheck checkbox in reservation details page

	$rootScope.checkedApplyCharges = false;
	$scope.minDate  = $rootScope.businessDate;
	$scope.cardDigits = '';

	//setup options for modal
	$scope.opts = {
		backdrop: true,
		backdropClick: true,
		templateUrl: '/assets/checkin/partials/errorModal.html',
		controller: ModalInstanceCtrl
	};

	if($scope.pageValid){

	//set up flags related to webservice
	$scope.isPosting 		 = false;
	$rootScope.netWorkError  = false;


	//next button clicked actions
	$scope.nextButtonClicked = function() {
		var data = {'departure_date':dateToSend,'credit_card':$scope.cardDigits,'reservation_id':$rootScope.reservationID};
		$scope.isPosting 		 = true;

	//call service
	checkinConfirmationService.login(data).then(function(response) {
		$scope.isPosting = false;

		if(response.status === 'failure') {
			$modal.open($scope.opts); // error modal popup
		}
		else{
			// display options for room upgrade screen
			$rootScope.ShowupgradedLabel = false;
			$rootScope.roomUpgradeheading = "Your trip details";
			$scope.isResponseSuccess = true;
			checkinDetailsService.setResponseData(response.data);
			$rootScope.upgradesAvailable = (response.data.is_upgrades_available === "true") ? true :  false;
			$rootScope.outStandingBalance = response.data.outstanding_balance;
			$rootScope.payment_method_used = response.data.payment_method_used;
			$rootScope.paymentDetails = response.data.payment_details;
			//navigate to next page
			$state.go('checkinReservationDetails');
		}
	},function(){
		$rootScope.netWorkError = true;
		$scope.isPosting = false;
	});
};

	// moved date picker controller logic
	$scope.isCalender = false;
	$scope.date = dateFilter(new Date(), 'yyyy-MM-dd');
	$scope.selectedDate = ($filter('date')($scope.date, $rootScope.dateFormat));

	function loseFocus() {
		var inputs = document.getElementsByTagName('input');
		for (var i = 0; i < inputs.length; ++i) {
		  inputs[i].blur();
		}
	};
	$scope.showCalender = function(){
		loseFocus();// focusout the input fields , so as to fix cursor being shown above the calendar
		$scope.isCalender = true;
	};
	$scope.closeCalender = function(){
		$scope.isCalender = false;
	};
	$scope.dateChoosen = function(){
		$scope.selectedDate = ($filter('date')($scope.date, $rootScope.dateFormat));
		$rootScope.departureDate = $scope.selectedDate;

		dateToSend = dclone($scope.date,[]);
		dateToSend = ($filter('date')(dateToSend,'MM-dd-yyyy'));
		$scope.closeCalender();
	};
}
};

var dependencies = [
'$scope','$modal','$rootScope','$state', 'dateFilter', '$filter', 'checkinConfirmationService','checkinDetailsService',
checkInConfirmationViewController
];

sntGuestWeb.controller('checkInConfirmationViewController', dependencies);
})();


