admin.controller('ADAddnewRate', ['$scope', function($scope) {
	

$scope.init = function(){

	BaseCtrl.call(this, $scope);
	$scope.currentStepIndexList = ["Details"];
	$scope.currentRateStepIndex = 0;
	$scope.errorMessage = '';
	$scope.newRateId = '';
};
 /*
	* init function
	*/
    $scope.init();
 /*
   * click action to switch between steps
   */
$scope.clickedStep =  function(index){
	$scope.currentRateStepIndex = index;
};

  /*
   	* to be updated from child classes 
	*/
$scope.$on("updateIndex", function(e,value){
	if(value.id == 1){
	$scope.newRateId= value.rateId;
	if($scope.currentStepIndexList.length< 2){	
    	$scope.currentStepIndexList.push("Type");
		 }
		 $scope.clickedStep(parseInt(value.id));
	}
	else if(value ==2){
	if($scope.currentStepIndexList.length< 3){
    	$scope.currentStepIndexList.push("Configure"); 	 	
    }
    $scope.clickedStep(parseInt(value));  
	}
    else if(value ==3){
	if($scope.currentStepIndexList.length< 4){
    	$scope.currentStepIndexList[2] = "Configure"; 
    	$scope.clickedStep(2);  	
    }
	}

	
});
  $scope.$watch('currentRateStepIndex', function () {
  	$scope.currentRateStepIndex =$scope.currentRateStepIndex;
 });
  
  /*
   	* to include template
	*/

$scope.includeTemplate = function(index){

    switch (index){
		case 0:
		  return "/assets/partials/rates/adRatesAddDetails.html";
		  break;
		case 1:
			return "/assets/partials/rates/adRatesAddRoomTypes.html";
		  break;
		 case 2:
		 	if($scope.currentStepIndexList[2] === "Configure")
		 	  return "/assets/partials/rates/adRatesAddConfigure.html";
		 	else
		 	  return "/assets/partials/rates/adRatesAddRange.html";	
		  break;
	};
};

}]);
