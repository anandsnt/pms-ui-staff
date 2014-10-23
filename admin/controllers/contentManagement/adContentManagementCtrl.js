admin.controller('ADContentManagementCtrl',['$scope', '$state', 'ADContentManagementSrv', 'ngTableParams','$filter', '$anchorScroll', '$timeout',  '$location', 
 function($scope, $state, ADContentManagementSrv, ngTableParams, $filter, $anchorScroll, $timeout, $location){
	
	$scope.errorMessage = '';
	BaseCtrl.call(this, $scope);
	$scope.isGridView = true;
	 

	 $scope.componentSelected = function(component_type, id){
   		if(component_type == 'section'){
   			$state.go("admin.contentManagementSectionDetails", {
				id: id
			});
   		}else if(component_type == 'category'){
   			$state.go("admin.contentManagementCategoryDetails", {
				id: id
			});
   		}else if(component_type == 'item'){
   			$state.go("admin.contentManagementItemDetails", {
				id: id
			});
   		}
   }

}]);