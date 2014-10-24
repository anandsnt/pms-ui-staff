admin.controller('adDeleteContentController',['$scope', 'ADContentManagementSrv', 'ngDialog',
 function($scope, ADContentManagementSrv,ngDialog){
	
	$scope.errorMessage = '';
	BaseCtrl.call(this, $scope);

	$scope.confirmDelete = function(){

		var successCallbackdeleteSection = function(){
			$scope.$emit('hideLoader');
			ngDialog.close();
			$scope.$emit('componentDeleted',{'id':$scope.componentIdToDelete});
		}
		
		$scope.invokeApi(ADContentManagementSrv.deleteSection, {'id':$scope.componentIdToDelete} , successCallbackdeleteSection);
    }

    $scope.cancelDelete = function(){
   	 	ngDialog.close();
    }

}]);