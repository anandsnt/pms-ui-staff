
(function() {
	var checkOutStatusController = function($scope, baseWebService,$rootScope,$location) {

		$scope.pageSuccess = true;

		if($rootScope.isCheckedin){
			$scope.pageSuccess = false;
			$location.path('/checkinSuccess');
		}
		else if($rootScope.isCheckin){
			$scope.pageSuccess = false;
			$location.path('/checkinConfirmation');
		}
		else if($rootScope.isCheckedout){
			$scope.pageSuccess = false;
			$location.path('/checkOutNowSuccess');
		}
		if($scope.pageSuccess){
			$scope.finalMessage = "Thank You for staying with us!";
			$scope.errorMessage = "";

	// data posted status	
	$scope.posted = false;
	$scope.isCheckoutCompleted= $rootScope.isCheckedout;
	$rootScope.netWorkError = false;

	// prevent chekout operation if user has already checked out
	
	if(!$scope.isCheckoutCompleted){
		var url = '/guest_web/home/checkout_guest.json';
		var data = {'reservation_id':$rootScope.reservationID};

	//watch for any network errors
	$rootScope.$watch('netWorkError',function(){
		if($rootScope.netWorkError)
			$scope.posted = true;
	});

    //post data 

    baseWebService.post(url,data).then(function(response) {
    	
    	$rootScope.netWorkError =false;
    	$scope.posted = true;	
    	$scope.success = (response.status != "failure") ? true : false;    	
    	if($scope.success)
    		$rootScope.isCheckedout = $scope.isCheckoutCompleted = true;  	
    	$scope.errorMessage = response.errors[0];
    });
    
}

}
};

var dependencies = [
'$scope',
'baseWebService','$rootScope','$location',
checkOutStatusController
];

snt.controller('checkOutStatusController', dependencies);
})();