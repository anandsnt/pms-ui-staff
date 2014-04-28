admin.controller('ADAddnewRate', ['$scope','ADRatesRangeSrv', function($scope,ADRatesRangeSrv) {
	

$scope.init = function(){

	BaseCtrl.call(this, $scope);
	ADRatesRangeSrv.emptyDateRangeData();
	var initialContent = {
							'title': 'Rate',
							'subtitle':'Details',
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

		console.log(id);
	}
};

$scope.$on("errorReceived", function(e,value){
	
	$scope.errorMessage = value;
});
  /*
   	* to be updated from child classes 
	*/
$scope.$on("updateIndex", function(e,value){
	var nextContent = {}
	if(value.id == 1){
	$scope.newRateId= value.rateId;
	if($scope.currentStepIndexList.length< 2){	

	    nextContent = {
							'title': 'Room',
							'subtitle':'Types',
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
							'title': 'Date',
							'subtitle': 'Range',
							'type' : 'Range',
							'id'   : 'Range'
						};
    	$scope.currentStepIndexList.push(nextContent);
    }
    $scope.clickedStep(parseInt(value));  
	}
    else if(value ==3){
    if($scope.currentStepIndexList[2].title === 'Date')
    	  $scope.currentStepIndexList.splice(2,1);
    $scope.showAddNewDateRangeOptions = false;
		var getDateRangeData = ADRatesRangeSrv.getDateRangeData();

		angular.forEach(getDateRangeData, function(value, key){
		
   
		 var nextContent = {
							'title': 'Configure',
							'type' : 'Configure',
							'id'   : value.id,
							'begin_date' : value.data.begin_date,
							'end_date':value.data.end_date
							};
	   	$scope.isAlreadyIncurrentStepIndexList = false;
		angular.forEach($scope.currentStepIndexList, function(stepValue, key){

		if(stepValue.id == nextContent.id){
			$scope.isAlreadyIncurrentStepIndexList = true;
		}
		});
		if(!$scope.isAlreadyIncurrentStepIndexList)
		   $scope.currentStepIndexList.push(nextContent);

   		  });	
	
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
		 default:
		 	if($scope.currentStepIndexList[2].title === "Configure")
		 	  return "/assets/partials/rates/adRatesAddConfigure.html";
		 	else
		 	  return "/assets/partials/rates/adRatesAddRange.html";	
		  break;
	};
};

$scope.addNewDateRange =  function(){
	 $scope.showAddNewDateRangeOptions = true;
	 $scope.$broadcast ('resetCalendar');
	 $scope.currentRateStepIndex =-1;
}

}]);
