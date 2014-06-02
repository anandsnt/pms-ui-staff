
(function() {
	var checkInKeysController = function($scope,$rootScope,baseWebService,$location,checkinDetailsService) {

		$scope.pageSuccess = true;

		// page navigatons if any of following conditions happpens

		if($rootScope.isCheckedin){

			$scope.pageSuccess = false;
			$location.path('/checkinSuccess');
		}
		else if($rootScope.isCheckedout){

			$scope.pageSuccess = false;
			$location.path('/checkOutNowSuccess');
		}
		else if(!$rootScope.isCheckin){

			$scope.pageSuccess = false;
			$location.path('/');
		};

		if($scope.pageSuccess){

  		//set up flags related to webservice
  		$scope.isPosting     = true;
  		$rootScope.netWorkError  = false;
  		$scope.responseData  = [];
  		$scope.reservationData = checkinDetailsService.getResponseData();

		// watch for any change
		$rootScope.$watch('netWorkError',function(){
			if($rootScope.netWorkError)
				$scope.isPosting = false;
		});

		var url = '/guest_web/checkin.json';
		var data = {'reservation_id':$rootScope.reservationID};

		baseWebService.post(url,data).then(function(response) {

			if(response.status === "failure")
				$rootScope.netWorkError  = true;
			else{
				$rootScope.isCheckedin = true;
				$scope.responseData =response.data;
			}

			$scope.isPosting = false;

		});
	}

};

var dependencies = [
'$scope','$rootScope','baseWebService','$location','checkinDetailsService',
checkInKeysController
];

snt.controller('checkInKeysController', dependencies);
})();
