admin.controller('ADDepartmentDetailsCtrl',['$scope', '$state', 'ADDepartmentSrv',   function($scope, $state, ADDepartmentSrv){
	
	BaseCtrl.call(this, $scope);

	$scope.errorMessage = '';

	var data = {
		"name": $scope.departmentName,
		"value": $scope.value
	};	
	$scope.sc = function(){
		$scope.$emit('hideLoader');
		console.log('in success call');
	};
	$scope.fc = function(errorMessage){
		$scope.$emit('hideLoader');
		console.log('in fail call');
	};

	$scope.executeApi(ADDepartmentSrv.postDepartmentDetails, data, $scope.sc, $scope.fc);
	



	$scope.saveDepartment = function(){
		var data = {
			"name": $scope.departmentName,
			"value": $scope.value
		};
		ADDepartmentSrv.postDepartmentDetails(data).then(function(data) {
			
		}, function(){
			console.log("post failed");
	
		});	
		
	};
	
	
	
}]);