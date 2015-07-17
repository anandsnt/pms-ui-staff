
(function() {
	var checkInKeysController = function($scope,$rootScope,$http,$location,checkinDetailsService,checkinKeysService,$state) {

	$scope.pageValid = false;

	if($rootScope.isCheckedin){
		$state.go('checkinSuccess');
	}
	else{
		$scope.pageValid = true;
	};

	if($scope.pageValid){

	//set up flags related to webservice
	$scope.isPosting     = true;
	$rootScope.netWorkError  = false;
	$scope.responseData  = [];
	$scope.reservationData = checkinDetailsService.getResponseData();
	var url = '/guest_web/checkin.json';
	var data = {'reservation_id':$rootScope.reservationID};
	checkinKeysService.checkin(url,data).then(function(response) {
		if(response.status === "failure") {
			$rootScope.netWorkError  = true;
		}
		else{
			$rootScope.isCheckedin = true;
			$scope.responseData =response.data;
		}
		$scope.isPosting = false;

	},function(){
		$scope.isPosting = false;
		$rootScope.netWorkError  = true;     });

}

};

var dependencies = [
'$scope','$rootScope','$http','$location','checkinDetailsService','checkinKeysService','$state',
checkInKeysController
];

snt.controller('checkInKeysController', dependencies);
})();
