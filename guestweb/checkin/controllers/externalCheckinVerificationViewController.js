/*
	External Checkin confimation Ctrl 
	The user enetered last name ,departure date or conf number are verified.
	The reservation details will be the  in the API response of the verification API.
*/

(function() {
	var externalCheckinVerificationViewController = 
	function($scope,
		$modal,
		$rootScope,
		$state, 
		dateFilter,
		$filter,
		checkinConfirmationService,
		checkinDetailsService) {


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

	

	if($scope.pageValid){

		//set up flags related to webservice
		$scope.isLoading 		 	= false;
		$rootScope.netWorkError  	= false;
		$scope.searchMode      		= true;
		$scope.noMatch    			= false;
		$scope.multipleResults 		= false;
		$scope.lastname         	= "";
		$scope.confirmationNumber 	= "";


		 $scope.errorOpts = {
	      backdrop: true,
	      backdropClick: true,
	      templateUrl: '/assets/preCheckin/partials/preCheckinErrorModal.html',
	      controller: ccVerificationModalCtrl,
	      resolve: {
	        errorMessage:function(){
	          return "Please fill all the required fields";
	        }
	      }
	    };

	    // $state.go('guestCheckinEarly');
	    // $state.go('guestCheckinLate');
		//next button clicked actions
		$scope.nextButtonClicked = function() {

			if($scope.lastname.length > 0 && ($scope.confirmationNumber.length > 0 || $scope.departureDate.length >0)){
				var data = {}
				if($scope.lastname.length >0){
					data.last_name = $scope.lastname;
				}
				if($scope.confirmationNumber.length>0){
					data.alt_confirmation_number = $scope.confirmationNumber;
				}
				if(typeof $scope.departureDate !== "undefined" && $scope.departureDate.length >0){
					data.departure_date  = $scope.departureDate;
				}
				
				$scope.isLoading 		 = true;
				//call service
				checkinConfirmationService.searchReservation(data).then(function(response) {
					$scope.isLoading = false;

					if(response.results.length ===0){
						// $scope.searchMode 		= false;
						// $scope.noMatch    		= true;
						// $scope.multipleResults 	= false;
					}else if(response.results.length >=2)
					{
						// $scope.searchMode 		= false;
						// $scope.noMatch    		= false;
						// $scope.multipleResults 	= true;
					}
					else{

					};
				},function(){
						$rootScope.netWorkError = true;
						$scope.isLoading = false;
					});
				}
				else{
					$modal.open($scope.errorOpts);
				}
			
		};

		$scope.tryAgain = function(){
			$scope.searchMode      = true;
			$scope.noMatch    		= false;
			$scope.multipleResults 	= false;
		};

		// moved date picker controller logic
		$scope.isCalender = false;
		$scope.date = dateFilter(new Date(), 'yyyy-MM-dd');
		$scope.selectedDate = ($filter('date')($scope.date, $rootScope.dateFormat));

		$scope.showCalender = function(){
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
externalCheckinVerificationViewController
];

sntGuestWeb.controller('externalCheckinVerificationViewController', dependencies);
})();


