admin.controller('ADAddRateRangeCtrl',['$scope','$filter','dateFilter','ADRatesRangeSrv',function($scope,$filter,dateFilter,ADRatesRangeSrv){

	$scope.saveStep3 = function(){


      var setData = [];

angular.forEach($scope.Sets, function(set, key){
      var setDetails ={};
      setDetails.name = set.setName;
      setDetails.monday = set.days[0].checked;
      setDetails.tuesday = set.days[1].checked;
      setDetails.wednesday = set.days[2].checked;
      setDetails.thursday = set.days[3].checked;
      setDetails.friday = set.days[4].checked;
      setDetails.saturday = set.days[5].checked;
      setDetails.sunday = set.days[6].checked;

      setData.push(setDetails);

});
      var dateRangeData = 
      {
      'id': $scope.newRateId ,
      'data':{  
            'begin_date': $scope.date,
            'end_date': $scope.nextMonthDateFormated,
            'sets': setData
             }
      };

   var postDateRangeSuccessCallback = function(){
      $scope.$emit('hideLoader');
      $scope.$emit("updateIndex","3");
   };
   var postDateRangeFailureCallback = function(){
      $scope.$emit('hideLoader');
   };
   $scope.invokeApi(ADRatesRangeSrv.postDateRange,dateRangeData,postDateRangeSuccessCallback,postDateRangeFailureCallback);   
	};

 /*
   * set up data to be displayed
   */

   $scope.setUpData = function(){

         $scope.isFromDateSelected = false;
         $scope.isToDateSelected   = false;

	   	$scope.Sets = 
		   	[{"setName":"Set 1",
		   	'days':[
			   	{'name':'MON','checked':true},
			   	{'name':'TUE','checked':true},
			   	{'name':'WED','checked':true},
			   	{'name':'THU','checked':true},
			   	{'name':'FRI','checked':true},
			   	{'name':'SAT','checked':true},
               {'name':'SUN','checked':true}
		   	]}];
	   	$scope.date = dateFilter(new Date(), 'yyyy-MM-dd');
	   	$scope.minDate =dateFilter(new Date(), 'yyyy-MM-dd');;
	   	$scope.thisMonthDate = new Date();
	   	currentDate   = new Date();
	   	currentDate.setDate(1);
	   	currentDate.setMonth(currentDate.getMonth() +1);
	   	$scope.nextMonthDate = currentDate;
	   	$scope.nextMonthDateFormated = dateFilter(currentDate, 'yyyy-MM-dd');
         $scope.nextMonthMinDate = dateFilter(currentDate, 'yyyy-MM-dd');
   };
   $scope.setUpData();

 /*
   * watch for date selection
   */
   $scope.$watch('nextMonthDateFormated',function(){

   	console.log($scope.nextMonthDateFormated)
   });
 /*
   * watch for date selection
   */

   $scope.$watch('date',function(){

   	console.log($scope.date)
   });

 /*
   * add new set 
   */

   $scope.addNewSet = function (index){

   	if($scope.Sets.length <7){
   		var newSet = {};
   		newSet.setName = "";
   		var checkedDays = [];
 	/*
   * check if any day has already been checked,if else check it in new set
   */
   angular.forEach($scope.Sets, function(set, key){
   
   	angular.forEach(set.days, function(day, key){
   		if(day.checked)
   			checkedDays.push(day.name);
   	});

   });
   newSet.days =[
   {'name':'MON','checked':true},
   {'name':'TUE','checked':true},
   {'name':'WED','checked':true},
   {'name':'THU','checked':true},
   {'name':'FRI','checked':true},
   {'name':'SAT','checked':true},
   {'name':'SUN','checked':true}];

   angular.forEach(checkedDays, function(uncheckedDay, key){
   	angular.forEach(newSet.days, function(day, key){
   		if(uncheckedDay === day.name){
   			day.checked = false;
   		}
   	});
   });
   $scope.Sets.push(newSet)
}
};
 /*
   * delete set 
   */

   $scope.deleteSet =  function(index){
   	$scope.Sets.splice(index,1);
   };
 /*
   * checkbox click action,uncheck all other set's day 
   */
   $scope.checkboxClicked =function(dayIndex,SetIndex){
   	var temp = $scope.Sets[SetIndex].days[dayIndex].checked;
   	angular.forEach($scope.Sets, function(set, key){
   		angular.forEach(set.days, function(day, key){
   			if($scope.Sets[SetIndex].days[dayIndex].name === day.name)
   				day.checked = false;
   		});
   	});
   	$scope.Sets[SetIndex].days[dayIndex].checked = temp;
   }


   $scope.allFieldsFilled  = function(){

   		var anyOneDayisChecked = false;
   		angular.forEach($scope.Sets, function(set, key){
   		angular.forEach(set.days, function(day, key){
   			if(day.checked)
   				anyOneDayisChecked = true;
   		});
   		});

   		if($scope.isFromDateSelected && $scope.isToDateSelected && anyOneDayisChecked){
     			if($scope.date <= $scope.nextMonthDateFormated)
     			  return false;
     			else
     			  return true;
   		}
   		else
   			return true;
   };
}]);
