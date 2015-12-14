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
		$scope.searchMode      = true;
		$scope.noMatch    		= false;
		$scope.multipleResults 	= false;


		//next button clicked actions
		$scope.nextButtonClicked = function() {

			results = [1,1,1];


			if(results.length ===0){
				$scope.searchMode 		= false;
				$scope.noMatch    		= true;
				$scope.multipleResults 	= false;
			}else if(results.length >=2)
			{
				$scope.searchMode 		= false;
				$scope.noMatch    		= false;
				$scope.multipleResults 	= true;
			}
			else{

			};
			
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


