admin.controller('ADAddRateRangeCtrl',['$scope','$filter','dateFilter',function($scope,$filter,dateFilter){
	$scope.saveStep3 = function(){
	$scope.save(2);
 }




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
}]);
