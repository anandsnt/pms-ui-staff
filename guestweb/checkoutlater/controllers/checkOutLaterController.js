(function() {
	var checkOutLaterController = function($scope, LateCheckOutChargesService,$rootScope,$location) {

		//if chekout is already done
		
 		if ($rootScope.isCheckedout) 
		$location.path('/checkOutNowSuccess')

	// if checkout later in unavailable
		else if (!$rootScope.isLateCheckoutAvailable) 
		 $location.path('/checkOutNow')
	

		$scope.showBackButtonImage = true


		$scope.hidePopup = function (){

			$('#myModal').modal('hide')
			$(".modal-backdrop").remove()
		}

		$scope.hidePopup();

		//reload page

		$scope.reloadPage=  function (){
			  $scope.fetch();
		}

		$scope.fetch = function(){
		
		LateCheckOutChargesService.fetch().then(function(charges) {
			$scope.charges = charges;


			if($scope.charges.length > 0){
				$scope.optionsAvailable = true;
				$scope.hidePopup();

			}
			else
				$('#myModal').modal('show')

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