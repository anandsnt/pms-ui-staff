(function() {
	var preCheckinStayDetailsController = function($scope, preCheckinSrv,$rootScope,$state,$modal) {
	
	var init = function(){
		
       $scope.stayDetails = {};   
       $scope.hours = ["01","02","03","04","05","06","07","08","09","10","11","12"];
       $scope.minutes = ["00","15","30","45"];    

	   $scope.errorOpts = {
	      backdrop: true,
	      backdropClick: true,
	      templateUrl: '/assets/preCheckin/partials/preCheckinErrorModal.html',
	      controller: ccVerificationModalCtrl,
	      resolve: {
	        errorMessage:function(){
	          return "Please select a valid estimated arrival time";
	        }
	      }
	    };


	};
	init();
	$scope.isLoading = true;
	

	$scope.postStayDetails = function(){
	
		if(!$scope.stayDetails.hour  || !$scope.stayDetails.minute  ||!$scope.stayDetails.primeTime){
			$modal.open($scope.errorOpts); // error modal popup
		}
		else{
			//call

			// preCheckinSrv.completePrecheckin().then(function(response) {
	// 		$scope.isLoading = false;	
	// 		var success = (response.status != "failure") ? true : false;
			// if(success){
			// 	$state.go('checkinReservationDetails');
			// }    	
	// 	},function(){
	// 		$scope.netWorkError = true;
	// 		$$scope.isLoading = false;
	// });
			$state.go('preCheckinStatus');

		}
		
	}
	

};

var dependencies = [
'$scope',
'preCheckinSrv','$rootScope','$state','$modal',
preCheckinStayDetailsController
];

snt.controller('preCheckinStayDetailsController', dependencies);
})();