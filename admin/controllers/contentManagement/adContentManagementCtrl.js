admin.controller('ADContentManagementCtrl',['$scope', '$state', '$rootScope', 'ngDialog', 'ADContentManagementSrv', 'ngTableParams','$filter', '$anchorScroll', '$timeout',  '$location',
 function($scope, $state, $rootScope, ngDialog, ADContentManagementSrv, ngTableParams, $filter, $anchorScroll, $timeout, $location){

	$scope.errorMessage = '';
	BaseCtrl.call(this, $scope);
	$scope.isGridView = true;

	/* Function to load the detail page for sections/categories/items
	 * Can be used from either grid view or tree view
    */
	 $scope.componentSelected = function(component){

	 	if(component.is_system_defined)
	 		return;
	 	var component_type = component.component_type,
	 	id = component.id;

   		if(component_type === 'section' || component_type === 'SECTION'){
   			$state.go("admin.contentManagementSectionDetails", {
				id: id
			});
   		}else if(component_type === 'category' || component_type === 'CATEGORY'){
   			$state.go("admin.contentManagementCategoryDetails", {
				id: id
			});
   		}else if(component_type === 'item' || component_type === 'PAGE'){
   			$state.go("admin.contentManagementItemDetails", {
				id: id
			});
   		}
   };

   /* delete component starts here*/

	$scope.deleteItem = function(id){
		var successCallbackFetchDeleteDetails = function(data){
			$scope.assocatedChildComponents = [];
			$scope.assocatedChildComponents = data.data.results;
			$scope.$emit('hideLoader');
			ngDialog.open({
				template: '/assets/partials/contentManagement/adDeleteContent.html',
				className: '',
				controller:'adDeleteContentController',
				scope:$scope,
				closeByDocument:true
			});
			$scope.componentIdToDelete = id;
		};
		$scope.invokeApi(ADContentManagementSrv.fetchChildList, {'id':id} , successCallbackFetchDeleteDetails);

	};

	/* Function to set the availability status
    */
   $scope.saveAvailabilityStatus = function(id, status){
      var successCallbackAvailabilityStatus = function(data){
        $rootScope.$broadcast('statusUpdated',{'id':id, 'status':status});
        $scope.$emit('hideLoader');
      };
      var data = {};
      data.status = status;
      data.id = id;

      $scope.invokeApi(ADContentManagementSrv.saveComponent, data , successCallbackAvailabilityStatus);
   };

	$scope.getFormattedTime = function(time){
		return $filter('date')(time, $rootScope.dateFormat);
	};

}]);