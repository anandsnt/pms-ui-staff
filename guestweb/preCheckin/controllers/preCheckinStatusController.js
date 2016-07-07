/*
	Precheckin final Ctrl where the pre checkin API is called
*/
(function() {
	var preCheckinStatusController = function($scope, preCheckinSrv,$rootScope,$state) {
	// if prompt for cc is turned on
	// we will always ask for CC addition in case of MLI

	$rootScope.userEmail = ($rootScope.userEmail === null ) ? "" :$rootScope.userEmail;
	$rootScope.userMobile = ($rootScope.userMobile === null ) ? "" :$rootScope.userMobile;

	if($rootScope.collectCCOnCheckin && $rootScope.isMLI && !$rootScope.isCcAttachedFromGuestWeb){
		$state.go('checkinCcVerification');
	}
	else if($rootScope.application ==="SMS" 
			&& $rootScope.userMobile.length >0 && !$rootScope.userMobileSkipped){
		$state.go('mobileNumberOptions');// if user has not attached an mobile
	}
	else if($rootScope.application ==="SMS" 
			&& $rootScope.userMobile.length ===0 && !$rootScope.userMobileSkipped){
		$state.go('mobileNumberAddition');// if user has not attached an mobile
	}
	else if($rootScope.offerRoomDeliveryOptions && !$rootScope.userEmailEntered && ($rootScope.application ==="SMS" || $rootScope.application ==="EMAIL" || $rootScope.application ==="URL")){
		$state.go('emailAddition',{'isFrom':'checkinLater'});// if user has not attached an email
	}
	else if($rootScope.enforceDeposit && !$rootScope.skipDeposit){
		$state.go('depositPayment'); //checkin deposit collection
	}
	else{
		//this page will be used again after email entry
		// So once preckin is completed we store some details
		if(!$rootScope.preckinCompleted){
			$scope.isLoading = true;
			preCheckinSrv.completePrecheckin().then(function(response) {
				$scope.isLoading = false;
				if(response.status === 'failure'){
					$scope.netWorkError = true;
				}
				else{
					$scope.responseData =response.data;
					$rootScope.preckinCompleted =  true;
					$rootScope.responseData = {"confirmation_message":$scope.responseData.confirmation_message};
				};
			},function(){
				$scope.netWorkError = true;
				$scope.isLoading = false;
			});
		}

		$scope.changeEmail = function(){
			$state.go('emailAddition');
		};
		$scope.isValidEmail = function() {
	   		 var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	    	return re.test($rootScope.userEmail);
	 	 };
	}
};

var dependencies = [
'$scope',
'preCheckinSrv','$rootScope','$state',
preCheckinStatusController
];

sntGuestWeb.controller('preCheckinStatusController', dependencies);
})();