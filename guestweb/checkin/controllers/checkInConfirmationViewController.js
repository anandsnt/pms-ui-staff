
(function() {
	var checkInConfirmationViewController = function($scope,$modal,$rootScope,$state, dateFilter, $filter, checkinConfirmationService,checkinDetailsService) {

		$scope.pageValid = true;
	//uncheck checkbox in reservation details page

	$rootScope.checkedApplyCharges = false;
	$scope.minDate  = $rootScope.businessDate;
	$scope.cardDigits = '';

	//TO DO: page navigatons if any of following conditions happpens


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
		var data = {'departure_date':$rootScope.departureDate,'credit_card':$scope.cardDigits,'reservation_id':$rootScope.reservationID};
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
	$scope.selectedDate = ($filter('date')($scope.date, 'MM/dd/yyyy'));
	$scope.$watch('date',function(){
		$scope.selectedDate = ($filter('date')($scope.date, 'MM/dd/yyyy'));
	});
	$scope.showCalender = function(){
		$scope.isCalender = true;
	};
	$scope.closeCalender = function(){
		$scope.isCalender = false;
	};
	$scope.dateChoosen = function(){
		$rootScope.departureDate = $scope.selectedDate;
		$scope.closeCalender();
	};
}
};

var dependencies = [
'$scope','$modal','$rootScope','$state', 'dateFilter', '$filter', 'checkinConfirmationService','checkinDetailsService',
checkInConfirmationViewController
];

snt.controller('checkInConfirmationViewController', dependencies);
})();


	// controller for the modal

	var ModalInstanceCtrl = function ($scope, $modalInstance) {
		$scope.closeDialog = function () {
			$modalInstance.dismiss('cancel');
		};
	};