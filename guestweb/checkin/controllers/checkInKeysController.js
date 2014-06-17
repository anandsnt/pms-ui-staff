
(function() {
	var checkInKeysController = function($scope,$rootScope,$http,$location,checkinDetailsService) {

		$scope.pageValid = true;

		//TO DO: page navigatons if any of following conditions happpens

		if($scope.pageValid){

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
