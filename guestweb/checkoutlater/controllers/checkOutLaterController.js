(function() {
	var checkOutLaterController = function($scope, LateCheckOutChargesService,$rootScope,$location) {

		$scope.pageValid = true;

		//TO DO : navigations

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