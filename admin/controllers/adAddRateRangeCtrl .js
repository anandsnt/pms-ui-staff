admin.controller('ADAddRateRangeCtrl',['$scope','$filter','dateFilter','ADRatesRangeSrv',function($scope,$filter,dateFilter,ADRatesRangeSrv){


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
	   	$scope.fromDate = dateFilter(new Date(), 'yyyy-MM-dd');
	   	$scope.fromMinDate =dateFilter(new Date(), 'yyyy-MM-dd');
	  
	   	currentDate   = new Date();
	   	currentDate.setDate(1);
	   	currentDate.setMonth(currentDate.getMonth() +1);
	   	$scope.toMonthDate = currentDate;
	   	$scope.toMonthDateFormated = dateFilter(currentDate, 'yyyy-MM-dd');
         $scope.toMonthMinDate = dateFilter(currentDate, 'yyyy-MM-dd');
   };

   $scope.setUpData();

   $scope.$on('resetCalendar', function(e) {  
        $scope.setUpData();            
    });


 /*
   * to save rate range
   */

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
            'begin_date': $scope.fromDate,
            'end_date': $scope.toMonthDateFormated,
            'sets': setData
             }
      };

      var postDateRangeSuccessCallback = function(){
         $scope.$emit('hideLoader');
         $scope.showAddNewDateRangeOptions = false;
         $scope.$emit("updateIndex","3");
      
      };
      var postDateRangeFailureCallback = function(data){
         $scope.$emit('hideLoader');
         $scope.$emit("errorReceived",data);
      };
      $scope.invokeApi(ADRatesRangeSrv.postDateRange,dateRangeData,postDateRangeSuccessCallback,postDateRangeFailureCallback);   
   };


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
     			  return false;	
   		}
   		else
   			return true;
   };
}]);
