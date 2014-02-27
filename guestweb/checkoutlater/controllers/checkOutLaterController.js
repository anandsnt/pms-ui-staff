(function() {
	var checkOutLaterController = function($scope, LateCheckOutChargesService,$rootScope,$location) {

		//if chekout is already done
		
 		if ($rootScope.isCheckedout) 
		$location.path('/checkOutNowSuccess')

	// if checkout later in unavailable
		else if (!$rootScope.isLateCheckoutAvailable) 
		 $location.path('/checkOutNow')
	

		$scope.showBackButtonImage = true
		$scope.showAlert = false;


		//reload page

		$scope.reloadPage=  function (){
			  $scope.showAlert = false;
			  $scope.fetch();

		}
		$scope.closeAlert = function(){

			$scope.showAlert = false
		}


		$scope.fetch = function(){
		
		LateCheckOutChargesService.fetch().then(function(charges) {
			$scope.charges = charges;


			if($scope.charges.length > 0){
				$scope.optionsAvailable = true;
				$scope.hidePopup();

			}
			else
				$scope.showAlert = true;

		});
		}

		$scope.fetch();
	};

	var dependencies = [
		'$scope',
		'LateCheckOutChargesService','$rootScope','$location',
		checkOutLaterController
	];

	snt.controller('checkOutLaterController', dependencies);
})();