admin.controller('ADAddnewRate', ['$scope','ADRatesRangeSrv', function($scope,ADRatesRangeSrv) {
	

$scope.init = function(){

	BaseCtrl.call(this, $scope);
	var initialContent = {
							'title': 'Details',
							'type' : 'Details',
							'id'   : 'Details'
						};
	$scope.currentStepIndexList = [initialContent];
	$scope.currentRateStepIndex = 0;
	$scope.errorMessage = '';
	$scope.newRateId = '';
	$scope.showAddNewDateRangeOptions =false;
};
 /*
	* init function
	*/
    $scope.init();
 /*
   * click action to switch between steps
   */
$scope.clickedStep =  function(index,id){
	$scope.currentRateStepIndex = index;
	if(parseInt(id)){

		console.log(14);
	}
};

  /*
   	* to be updated from child classes 
	*/
$scope.$on("updateIndex", function(e,value){
	var nextContent = {}
	if(value.id == 1){
	$scope.newRateId= value.rateId;
	if($scope.currentStepIndexList.length< 2){	

	    nextContent = {
							'title': 'Type',
							'type' : 'Type',
							'id'   : 'Type'
						};
    	$scope.currentStepIndexList.push(nextContent);
		 }
		 $scope.clickedStep(parseInt(value.id));
	}
	else if(value ==2){
	if($scope.currentStepIndexList.length< 3){
    	nextContent = {
							'title': 'Range',
							'type' : 'Range',
							'id'   : 'Range'
						};
    	$scope.currentStepIndexList.push(nextContent);
    	$scope.clickedStep(parseInt(value));   	
    }
	}
    else if(value ==3){
    $scope.showAddNewDateRangeOptions = false;



		var getDateRangeIds = ADRatesRangeSrv.getDateRangeIds();
		var nextContents= [];

		angular.forEach(getDateRangeIds, function(value, key){
       	var id =value;
		 var nextContent = {
							'title': 'Configure',
							'type' : 'Configure',
							'id'   : id
							};
		nextContents.push(nextContent);	

   		  });
		angular.forEach(nextContents, function(value, key){
			$scope.currentStepIndexList.push(value);
		});
	
		if($scope.currentStepIndexList[2].title === 'Range')
    	  $scope.currentStepIndexList.splice(2,1);

    	$scope.clickedStep($scope.currentStepIndexList.length-1);  	
    
	}

	
});

$scope.hideAddNewDateRange = function(){

	if($scope.currentStepIndexList.length >= 3){
		if(parseInt($scope.currentStepIndexList[2].id))
			return false;
		else
		return true;
	}
	else
		return true;
}
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
		 	if($scope.currentStepIndexList[2].title === "Configure")
		 	  return "/assets/partials/rates/adRatesAddConfigure.html";
		 	else
		 	  return "/assets/partials/rates/adRatesAddRange.html";	
		  break;
	};
};

$scope.addNewDateRange =  function(){
	 $scope.showAddNewDateRangeOptions = true;
}

}]);
