admin.controller('ADDepartmentDetailsCtrl',['$scope', '$state',   function($scope, $state){
	
	$scope.saveDepartment = function(){
		console.log($scope.departmentName);
	};
}]);