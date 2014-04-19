admin.controller('ADAddRateRangeCtrl',['$scope','$filter','dateFilter',function($scope,$filter,dateFilter){

	$scope.saveStep3 = function(){
		$scope.$emit("updateIndex","3");

	};

 /*
   * set up data to be displayed
   */

   $scope.setUpData = function(){

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
	   	$scope.minDate =$scope.date;
	   	$scope.thisMonthDate = new Date();
	   	currentDate   = new Date();
	   	currentDate.setDate(1);
	   	currentDate.setMonth(currentDate.getMonth() +1);
	   	$scope.nextMonthDate = currentDate;
	   	$scope.nextMonthDateFormated = dateFilter(currentDate, 'yyyy-MM-dd');
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
   newSet.days =[{'name':'SUN','checked':true},
   {'name':'MON','checked':true},
   {'name':'TUE','checked':true},
   {'name':'WED','checked':true},
   {'name':'THU','checked':true},
   {'name':'FRI','checked':true},
   {'name':'SAT','checked':true}];

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

   		if($scope.date && $scope.nextMonthDateFormated && anyOneDayisChecked){
     			if($scope.date <= $scope.nextMonthDateFormated)
     			  return false;
     			else
     			  return true;
   		}
   		else
   			return true;
   };
}]);
