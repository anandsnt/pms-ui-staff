admin.controller('ADAddnewRate', ['$scope', function($scope) {
	

$scope.init = function(){

	BaseCtrl.call(this, $scope);
	$scope.currentRateStepIndex = -1;
	$scope.currentStepIndexList = ["Details"];

};
 /*
	* init function
	*/
    $scope.init();

 /*
   * init function
   */

$scope.clickedStep =  function(index){

	$scope.currentRateStepIndex = index;

};
  /*
   	* to be updated from child classes 
	*/

$scope.$on("updateIndex", function(e,value){

	if(value == 1){
	if($scope.currentStepIndexList.length< 2){
    	
    	$scope.currentStepIndexList.push("Type");
		 }
	}
	else if(value ==2){
	if($scope.currentStepIndexList.length< 3){
    	$scope.currentStepIndexList.push("Range");
    	
    }
	}

	$scope.clickedStep(parseInt(value));

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
			return "/assets/partials/rates/adRatesAddTypes.html";
		  break;
		 case 2:
		 	return "/assets/partials/rates/adRatesAddRange.html";
		  break;
	};
};

}]);
