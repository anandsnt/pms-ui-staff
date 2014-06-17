(function() {
		var checkOutLaterController = function($scope, LateCheckOutChargesService,$rootScope,$location,$state) {

			$scope.pageValid = true;

	//TO DO : navigations

	if($scope.pageValid){

		$scope.showBackButtonImage = true;
		$scope.netWorkError = false;
		$scope.isFetching = true;


	$scope.gotToNextStep = function(fee,chargeId){
		if($rootScope.isCCOnFile){
			$state.go('ccVerification',{'fee':fee,'message':"Late check-out fee",'currency':'$','isFromCheckoutNow':false});
		}				
		else{
			$state.go('checkOutLaterSuccess',{id:chargeId});
		}
				
	}

	// fetch details
	LateCheckOutChargesService.fetchLateCheckoutOptions().then(function(charges) {
		$scope.charges = charges;
		$scope.netWorkError = false;
		$scope.isFetching = false;    	
		if($scope.charges.length > 0)
			$scope.optionsAvailable = true;
	},function(){
		$scope.netWorkError = true;
		$scope.isFetching = false;
	});
	}
	};

var dependencies = [
'$scope',
'LateCheckOutChargesService','$rootScope','$location','$state',
checkOutLaterController
];

snt.controller('checkOutLaterController', dependencies);
})();