admin.controller('ADAddnewRate', ['$scope', function($scope) {
	

	$scope.init = function(){
	BaseCtrl.call(this, $scope);
	$scope.currentIndex = -1;
	$scope.addNewRateSteps = ["Details","Type","Range"];

    }
    $scope.init();

    $scope.clickedStep =  function(index){

    	$scope.currentIndex = index;

    }

    $scope.includeTemplate = function(index){

	    switch ($scope.currentIndex){
			case 0:
			  return "/assets/partials/rates/adRatesAddDetails.html";
			  break;
			case 1:
				return "/assets/partials/rates/adRatesAddTypes.html";
			  break;
			 case 2:
			 	return "/assets/partials/rates/adRatesAddRange.html";
			  break;
		}

   

    }

	


}]);
