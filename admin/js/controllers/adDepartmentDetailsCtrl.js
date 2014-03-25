admin.controller('ADDepartmentDetailsCtrl',['$scope', '$state', 'ADDepartmentSrv',   function($scope, $state, ADDepartmentSrv){
	
	$scope.saveDepartment = function(){
		var data = {
			"name": $scope.departmentName,
			"value": $scope.value
		};
		console.log("+++==========++++");
		console.log(data);
		ADDepartmentSrv.postDepartmentDetails(data).then(function(data) {
			
		}, function(){
			console.log("post failed");
	
		});	
		
	};
	
	
	
}]);