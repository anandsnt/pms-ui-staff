admin.controller('ADAddnewRate', ['$scope', function($scope) {
	

	$scope.init = function(){
	BaseCtrl.call(this, $scope);
	$scope.currentIndex = -1;
	$scope.addNewRateSteps = ["Details"];

    }
    $scope.init();

    $scope.clickedStep =  function(index){

    	$scope.currentIndex = index;

    }

    $scope.save = function(index){

    	if(index == 0){
    	if($scope.addNewRateSteps.length< 2){
	    	$scope.currentIndex =1;
	    	$scope.addNewRateSteps.push("Type");
  		 }
    	}
    	else if(index ==1){
    	if($scope.addNewRateSteps.length< 3){
	    	$scope.addNewRateSteps.push("Range");
	    	$scope.currentIndex=2;
	    }
    	}

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
