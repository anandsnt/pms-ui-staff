
(function() {
	var checkInKeysController = function($scope,$rootScope,$http,$location,checkinDetailsService) {

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
		var url = '/guest_web/checkin.json';
		var data = {'reservation_id':$rootScope.reservationID};
		$http.post(url,data).success(function(response) {
			if(response.status === "failure")
				$rootScope.netWorkError  = true;
			else{
				$rootScope.isCheckedin = true;
				$scope.responseData =response.data;
			}

			$scope.isPosting = false;
		},function(){
			$scope.isPosting = false;
			$rootScope.netWorkError  = true;

		});
	}

};

var dependencies = [
'$scope','$rootScope','$http','$location','checkinDetailsService',
checkInKeysController
];

snt.controller('checkInKeysController', dependencies);
})();
