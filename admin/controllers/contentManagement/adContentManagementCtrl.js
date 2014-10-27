admin.controller('ADContentManagementCtrl',['$scope', '$state', 'ngDialog', 'ADContentManagementSrv', 'ngTableParams','$filter', '$anchorScroll', '$timeout',  '$location', 
 function($scope, $state, ngDialog, ADContentManagementSrv, ngTableParams, $filter, $anchorScroll, $timeout, $location){
	
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

   /* delete component starts here*/

	$scope.deleteItem = function(id){
		var successCallbackFetchDeleteDetails = function(data){
			$scope.assocatedChildComponents = [];
			$scope.assocatedChildComponents = data.results;
			$scope.$emit('hideLoader');
			ngDialog.open({
				template: '/assets/partials/contentManagement/adDeleteContent.html',
				className: '',
				controller:'adDeleteContentController',
				scope:$scope,
				closeByDocument:true
			});
			$scope.componentIdToDelete = id;
		}
		$scope.invokeApi(ADContentManagementSrv.fetchChildList, {'id':id} , successCallbackFetchDeleteDetails);

	}

}]);