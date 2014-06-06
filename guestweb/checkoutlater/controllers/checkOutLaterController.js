(function() {
	var checkOutLaterController = function($scope, LateCheckOutChargesService,$rootScope,$location) {

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
		else if(!$rootScope.isLateCheckoutAvailable){
			$scope.pageSuccess = false;
			$location.path('/checkOutNow');
		}

		if($scope.pageSuccess){
			
			$scope.showBackButtonImage = true;
			$rootScope.netWorkError = false;
			$rootScope.isFetching = true;

	//watch for any network errors
	$rootScope.$watch('netWorkError',function(){
		if($rootScope.netWorkError)
			$scope.isFetching = false;
	});

    // fetch details
    LateCheckOutChargesService.fetch().then(function(charges) {
    	$scope.charges = charges;
    	$rootScope.netWorkError = false;
    	$scope.isFetching = false;
    	
    	if($scope.charges.length > 0)
    		$scope.optionsAvailable = true;
    	else
    		$location.path('/serverError');

    });
}
};

var dependencies = [
'$scope',
'LateCheckOutChargesService','$rootScope','$location',
checkOutLaterController
];

snt.controller('checkOutLaterController', dependencies);
})();