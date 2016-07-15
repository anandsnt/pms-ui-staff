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
	if($rootScope.isExternalVerification){
		$state.go('externalVerification');
	}
	else{
		$scope.pageValid = true;
	}
	//uncheck checkbox in reservation details page

	$rootScope.checkedApplyCharges = false;
	$scope.minDate  = $rootScope.businessDate;

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
	          return "Please provide all the required information";
	        }
	      }
	    };

	    //we need a guest token for authentication
	    //so fetch it with reservation id
	    var getToken = function(response){
	    	var data = {"reservation_id":$rootScope.reservationID};
		    checkinConfirmationService.getToken(data).then(function(res_data) {
	    		//set guestweb token
	    		$rootScope.accessToken 				= res_data.guest_web_token;
				// display options for room upgrade screen
				$rootScope.ShowupgradedLabel = false;
				$rootScope.roomUpgradeheading = "Your trip details";
				$scope.isResponseSuccess = true;
				response.results[0].terms_and_conditions = (typeof $rootScope.termsAndConditions !=="undefined")? $rootScope.termsAndConditions:"" ;
				checkinDetailsService.setResponseData(response.results[0]);
				$rootScope.upgradesAvailable = (response.results[0].is_upgrades_available === "true") ? true :  false;
				$rootScope.isCCOnFile = (response.results[0].is_cc_attached === "true") ? true : false;
				$rootScope.userEmail = response.results[0].guest_email;
				$rootScope.userMobile = response.results[0].guest_mobile;

				$rootScope.outStandingBalance = res_data.outstanding_balance;
				$rootScope.payment_method_used = res_data.payment_method_used;
				$rootScope.paymentDetails = res_data.payment_details;

				//navigate to next page
				$state.go('checkinReservationDetails');
				
			},function(){
				$rootScope.netWorkError = true;
				$scope.isLoading = false;
			});
	    };

		//next button clicked actions
		$scope.nextButtonClicked = function() {
			if($scope.lastname.length > 0 && ($scope.confirmationNumber.length > 0 || (typeof $scope.departureDate !== "undefined" && $scope.departureDate.length >0))){
				
				var data = {"hotel_identifier":$rootScope.hotelIdentifier}

				//check if all fields are filled
				if($scope.lastname.length >0){
					data.last_name = $scope.lastname;
				}
				if($scope.confirmationNumber.length>0){
					data.alt_confirmation_number = $scope.confirmationNumber;
				}
				if(typeof $scope.departureDate !== "undefined" && $scope.departureDate.length >0){
					data.departure_date  = dateToSend;
				}

				
				$scope.isLoading 		 = true;
				//call service
				checkinConfirmationService.searchReservation(data).then(function(response) {
					
					var noMatchAction = function(){
						$scope.searchMode 		= false;
						$scope.noMatch    		= true;
						$scope.multipleResults 	= false;
					};
					var reservations = [];
					//filter out reservations with reserved status
					angular.forEach(response.results, function(value, key) {
					  if(value.reservation_status ==='RESERVED'){
					  	reservations.push(value);
					  };
					});
					response.results = reservations;

					if(response.results.length ===0){ // No match
						$scope.isLoading = false;
						noMatchAction();
					}else if(response.results.length >=2) //Multiple matches
					{
						$scope.searchMode 		= false;
						$scope.noMatch    		= false;
						$scope.multipleResults 	= true;
						$scope.isLoading = false;
					}
					else{						
						//if reservation status is CANCELED -> No matches
						if(response.results[0].reservation_status ==='CANCELED'){
							$scope.isLoading = false;
							noMatchAction();
						}
						//if reservation status is NOSHOW or to too late -> No matches
						else if(response.results[0].reservation_status ==='NOSHOW' || response.results[0].is_too_late){
							$state.go('guestCheckinLate');
						}
						//if reservation is aleady checkin
						else if(response.results[0].is_checked_in === "true"){
							$state.go('checkinSuccess');
						}
						//if reservation is early checkin
						else if(response.results[0].is_too_early){
							$state.go('guestCheckinEarly',{"date":response.results[0].available_date_after});
						}
						else{
							//retrieve token for guest
							$rootScope.primaryGuestId 	= response.results[0].primary_guest_id;
							$rootScope.reservationID 	= response.results[0].reservation_id;
							$rootScope.isPrecheckinOnly = (response.is_precheckin_only === "true" && response.results[0].reservation_status ==='RESERVED')?true:false;
							$rootScope.isAutoCheckinOn 	= (response.is_auto_checkin === "true") && $rootScope.isPrecheckinOnly;
							getToken(response);
						};
					};
				},function(){
						$rootScope.netWorkError = true;
						$scope.isLoading = false;
					});
			}
			else{
				$modal.open($scope.errorOpts);
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

		$scope.clearDate = function(){
			$scope.date = "";
			$rootScope.departureDate = "";
		};

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
			dateToSend = ($filter('date')(dateToSend,'yyyy-MM-dd'));
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


sntGuestWeb.controller('earlyToCheckinCtrl', ['$scope','$stateParams',
 function($scope,$stateParams) {
 	$scope.checkinAvailableDateAfter = $stateParams.date;
 }]);
