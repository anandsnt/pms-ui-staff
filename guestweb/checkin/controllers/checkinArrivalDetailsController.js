(function() {

	var checkinArrivalDetailsController = function($scope, preCheckinSrv,$rootScope,$state,$modal,$stateParams) {

	var init = function(){

       $scope.hours = ["01","02","03","04","05","06","07","08","09","10","11","12"];
       $scope.minutes = ["00","15","30","45"];
       if ($stateParams.isearlycheckin !=="undefined" && $stateParams.isearlycheckin) {
       		$scope.stayDetails = {
							       	"hour":$rootScope.earlyCheckinHour,
							       	"minute":$rootScope.earlyCheckinMinute,
							       	"primeTime" : $rootScope.earlyCheckinPM
							      };
       }
       else{
	       	$scope.stayDetails = {
							       	"hour":"",
							       	"minute":"",
							       	"primeTime" : ""
							     };
       }

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
	    $scope.checkinTime = (typeof $stateParams.time !=="undefined") ? $stateParams.time :"";

	};
	init();

	$scope.postStayDetails = function(){
		$scope.isLoading = true;
		if(!$scope.stayDetails.hour  || !$scope.stayDetails.minute  ||!$scope.stayDetails.primeTime){
			$modal.open($scope.errorOpts); // error modal popup
			$scope.isLoading = false;
		}
		else{
		//change format to 24 hours
		 var hour = parseInt($scope.stayDetails.hour);
		 if ($scope.stayDetails.primeTime === 'PM' && hour < 12) {
		 	hour = hour+ 12;
		 }
		 else if ($scope.stayDetails.primeTime === 'AM' && hour === 12) {
		    hour = hour-12;
		 }
		 hour = (hour <10)?("0"+hour): hour;
		 var dataTosend = {
		 	"arrival_time":  hour+":"+$scope.stayDetails.minute,
		 	"comments":$scope.stayDetails.comment
		 };


		preCheckinSrv.postStayDetails(dataTosend).then(function(response) {
			if(response.early_checkin_available && typeof response.early_checkin_offer_id !== "undefined"){
					$rootScope.earlyCheckinHour   =  response.last_early_checkin_hour;
					$rootScope.earlyCheckinMinute =  response.last_early_checkin_minute;
					$rootScope.earlyCheckinPM     =  response.last_early_checkin_primetime;
					$state.go('earlyCheckinOptions',{'time':response.checkin_time,'charge':response.early_checkin_charge,'id':response.early_checkin_offer_id});
				}
				else{
					$state.go('preCheckinStatus');
				}
			},function(){
				$scope.netWorkError = true;
				$scope.isLoading = false;
			});
		}
	};
};

var dependencies = [
'$scope',
'preCheckinSrv','$rootScope','$state','$modal','$stateParams',
checkinArrivalDetailsController
];

snt.controller('checkinArrivalDetailsController', dependencies);
})();