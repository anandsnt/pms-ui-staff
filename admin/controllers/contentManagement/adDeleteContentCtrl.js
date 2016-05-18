admin.controller('adDeleteContentController',['$scope', '$rootScope', 'ADContentManagementSrv', 'ngDialog',
 function($scope, $rootScope, ADContentManagementSrv,ngDialog){

	$scope.errorMessage = '';
	BaseCtrl.call(this, $scope);
	/* Function to delete the component and
	 *trigger the appropriate notification
	 * other screens
    */
	$scope.confirmDelete = function(){

		var successCallbackdeleteSection = function(){
			$scope.$emit('hideLoader');
			ngDialog.close();
			$rootScope.$broadcast('componentDeleted',{'id':$scope.componentIdToDelete});
		};

		$scope.invokeApi(ADContentManagementSrv.deleteSection, {'id':$scope.componentIdToDelete} , successCallbackdeleteSection);
    };

    $scope.cancelDelete = function(){
   	 	ngDialog.close();
    };

    $scope.getComponentType = function(component){

    	return component.component_type == "PAGE"? "ITEM" : component.component_type;

    }

}]);