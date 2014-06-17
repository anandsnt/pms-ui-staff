(function() {
	var checkOutLaterController = function($scope, LateCheckOutChargesService,$rootScope,$location) {

		$scope.pageValid = false;

		if($rootScope.isCheckedout){
			$location.path('/checkOutNowSuccess');
		}
		else if(!$rootScope.isLateCheckoutAvailable){
			$location.path('/checkOutNow');
		}
		else{
			$scope.pageValid = true;
		};

		if($scope.pageValid){

			$scope.showBackButtonImage = true;
			$scope.netWorkError = false;
			$scope.isFetching = true;

			// fetch details
			LateCheckOutChargesService.fetch().then(function(charges) {
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
		'LateCheckOutChargesService','$rootScope','$location',
		checkOutLaterController
		];

snt.controller('checkOutLaterController', dependencies);
})();