(function() {
	var checkOutLaterSuccessController = function($scope, $http, $q, $stateParams, $state, $rootScope, LateCheckOutChargesService) {
	$scope.pageValid = true;

	//TO DO : navigations

	if($scope.pageValid){

		var charges = LateCheckOutChargesService.charges;
		var id = $stateParams.id;
		$scope.reservationID = $rootScope.reservationID;
		$scope.id = id;
		$scope.netWorkError = false;

	// already opted for late checkout, send him home with a msg
	$scope.returnHome = false;

	// data has/being posted
	$scope.posted = false;

	// data posted sucessfully
	$scope.success = false;

	// if no charges recorded (user tried to reload on success page)
	// show a message and give him option to go home
	if (!charges.length) {

		$state.go('checkOutOptions');
		$scope.returnHome = true;
		return;
	};

	// find the choosen option form list of options
	$scope.lateCheckOut = _.find(charges, function(charge) {
		if (id === charge.id) {
			return charge;
		};
	});

	var reservation_id = $scope.reservationID;
	var url = '/guest_web/apply_late_checkout';
	var id  = $scope.id; 

	LateCheckOutChargesService.postNewCheckoutOption(url,reservation_id,id).then(function(response) {
		$scope.success = response.status ? true : false;
	 	if($scope.success === true){
			$scope.posted = true;	
			$rootScope.checkoutTime = $scope.lateCheckOut.time +':00 '+$scope.lateCheckOut.ap
		 	$rootScope.checkoutTimessage = "Your new check out time is ";
		 	$rootScope.isLateCheckoutAvailable = false;
		}
	    else{
	    	$scope.netWorkError = true;	
	    }
		
	},function(){
		$scope.netWorkError = true;
		$scope.posted = true;
	});
	}		
};

var dependencies = [
'$scope',
'$http',
'$q',
'$stateParams',
'$state',
'$rootScope',
'LateCheckOutChargesService',
checkOutLaterSuccessController
];

snt.controller('checkOutLaterSuccessController', dependencies);
})();