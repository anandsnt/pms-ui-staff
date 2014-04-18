admin.controller('ADAddRateRangeCtrl',['$scope','$filter','$locale','dateFilter',function($scope,$filter,$locale,dateFilter){
	$scope.saveStep3 = function(){
	$scope.save(2);
 }


$scope.dayNames    = $locale.DATETIME_FORMATS['SHORTDAY'];
$scope.Sets = [{"setName":"set1",'days':[{'name':'SUN','checked':true},
				{'name':'MON','checked':true},
				{'name':'TUE','checked':true},
				{'name':'WED','checked':true},
				{'name':'THU','checked':true},
				{'name':'FRI','checked':true},
				{'name':'SAT','checked':true}]}];

 $scope.date = dateFilter(new Date(), 'yyyy-MM-dd');
 $scope.minDate =$scope.date;
 $scope.thisMonthDate = new Date();

 currentDate   = new Date();
 currentDate.setDate(1);
 currentDate.setMonth(currentDate.getMonth() +1);
 $scope.nextMonthDate = currentDate;

 $scope.nextMonthDateFormated = dateFilter(currentDate, 'yyyy-MM-dd');
 console.log($scope.nextMonthDate)


 $scope.$watch('nextMonthDateFormated',function(){

 	console.log($scope.nextMonthDateFormated)
 })

 $scope.$watch('date',function(){

 	console.log($scope.date)
 })

 $scope.addNewSet = function (index){

if($scope.Sets.length <7){
 	var newSet = {};
 	newSet.setName = "Set"+(index+2);


 	var checkedDays = [];

 	angular.forEach($scope.Sets, function(set, key){
 		console.log(set.days);
 		angular.forEach(set.days, function(day, key){
 			console.log(day.checked);
 			console.log(day.name);
 			if(day.checked)
 				checkedDays.push(day.name);
 		});
       
     });

 	console.log(checkedDays)

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

 $scope.deleteSet =  function(index){

 	$scope.Sets.splice(index,1);
 };

 $scope.checkboxClicked =function(dayIndex,SetIndex){

 	var temp = $scope.Sets[SetIndex].days[dayIndex].checked;

 	angular.forEach($scope.Sets, function(set, key){
 		angular.forEach(set.days, function(day, key){
 		if($scope.Sets[SetIndex].days[dayIndex].name === day.name )
 			day.checked = false;
 	});
 	});

 	$scope.Sets[SetIndex].days[dayIndex].checked = temp;

 }


}]);
