(function() {
	var checkOutLaterController = function($scope, LateCheckOutChargesService,$rootScope,$location,$window) {

		//if chekout is already done
		
 		if ($rootScope.isCheckedout) 
		$location.path('/checkOutNowSuccess')

	// if checkout later in unavailable
		else if (!$rootScope.isLateCheckoutAvailable) 
		 $location.path('/checkOutNow')
	

		$scope.showBackButtonImage = true


		$('#myModal').modal('hide')

		//reload page

		$scope.reloadPage=  function (){
			  $window.location.reload();
		}
		
		LateCheckOutChargesService.fetch().then(function(charges) {
			$scope.charges = charges;


			if(charges.length > 0)
				$scope.optionsAvailable = true;
			else
				$('#myModal').modal('show')

		});
	};

	var dependencies = [
		'$scope',
		'LateCheckOutChargesService','$rootScope','$location','$window',
		checkOutLaterController
	];

	snt.controller('checkOutLaterController', dependencies);
})();