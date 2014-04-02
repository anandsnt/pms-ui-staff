admin.controller('ADDepartmentDetailsCtrl',['$scope', '$state', 'ADDepartmentSrv',   function($scope, $state, ADDepartmentSrv){
	console.log('here in ADDepartmentDetailsCtrl');
	BaseCtrl.call(this, $scope);

	
	
    
    // $scope.$on("departmentIdChanged", function(event, id){
    	// var data = {"id":id };
	 	// var successCallbackRender = function(data){
	 		// $scope.currentClickedElement = index;
	 		// $scope.$emit('hideLoader');
	 		// console.log(data);
	 		// $scope.departmentData = data;
	 	// };
	 	// $scope.invokeApi(ADDepartmentSrv.getDepartmentDetails, data , successCallbackRender);    	
    // });
	// $scope.successCallback = function(){
// 		
	// };
// 	
	// $scope.failureCallback = function(){
// 		
	// };
// 	
	// $scope.saveDepartment = function(){
		// var data = {
			// "name": $scope.departmentName,
			// "value": $scope.value
		// };
		// $scope.invokeApi(ADDepartmentSrv.postDepartmentDetails, data , successCallback, failureCallback);
// 		
	// };
	
	

	
	
}]);