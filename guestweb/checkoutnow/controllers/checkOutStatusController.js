
(function() {
	var checkOutStatusController = function($scope, baseWebService,$rootScope) {

		$scope.finalMessage = "Thank You for staying with us!"
		$scope.errorMessage = ""

	// data posted status
	
	$scope.posted = false;
	$scope.isCheckoutCompleted= $rootScope.isCheckedout;

	// prevent chekout operation if user has already checked out
	
	if(!$scope.isCheckoutCompleted){
	
	var url = '/guest_web/home/checkout_guest.json';
	var data = {'reservation_id':$rootScope.reservationID};

    //post data 
   
	 baseWebService.post(url,data).then(function(response) {
    	
    	$scope.posted = true;	
    	$scope.success = (response.status != "failure") ? true : false;
    	
    	if($scope.success)
    		$rootScope.isCheckedout = $scope.isCheckoutCompleted = true;
    	
    	$scope.errorMessage = response.errors[0];
    });
    
    }
};

var dependencies = [
'$scope',
'baseWebService','$rootScope',
checkOutStatusController
];

snt.controller('checkOutStatusController', dependencies);
})();