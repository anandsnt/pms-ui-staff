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
		 var hour = parseInt($scope.stayDetails.hour);
		 if ($scope.stayDetails.primeTime == 'PM' && hour < 12) {
		 	hour = hour+ 12;		      
		 }
		 else if ($scope.stayDetails.primeTime == 'AM' && hour == 12) {
		    hour = hour-12;
		 }
		 hour = (hour <10)?("0"+hour): hour
		 var dataTosend = {
		 	"time":  hour+":"+$scope.stayDetails.minute,
		 	"comment":$scope.stayDetails.comment,
		 	"mobile":$scope.stayDetails.mobile,
		 	"reservation_id":$rootScope.reservationID
		 }
		 console.log(dataTosend);
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