admin.controller('ADAddRateRangeCtrl',['$scope','$filter','dateFilter',function($scope,$filter,dateFilter){
	$scope.saveStep3 = function(){
	$scope.save(2);
 }

 $scope.date = dateFilter(new Date(), 'yyyy-MM-dd');
}]);
