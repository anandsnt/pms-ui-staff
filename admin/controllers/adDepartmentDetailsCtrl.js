admin.controller('ADDepartmentDetailsCtrl',['$scope', '$state', 'ADDepartmentSrv',   function($scope, $state, ADDepartmentSrv){
	
	BaseCtrl.call(this, $scope);

	$scope.successCallback = function(){
		
	};
	
	$scope.failureCallback = function(){
		
	};
	
	$scope.saveDepartment = function(){
		var data = {
			"name": $scope.departmentName,
			"value": $scope.value
		};
		$scope.invokeApi(ADDepartmentSrv.postDepartmentDetails, data , successCallback, failureCallback);
		
	};
	
	

	
	
}]);