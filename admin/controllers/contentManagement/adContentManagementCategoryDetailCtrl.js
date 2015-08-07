admin.controller('ADContentManagementCategoryDetailCtrl',['$scope', '$state', 'ngDialog', '$stateParams', 'ADContentManagementSrv', 'ngTableParams','$filter', '$anchorScroll', '$timeout',  '$location',
 function($scope, $state, ngDialog, $stateParams, ADContentManagementSrv, ngTableParams, $filter, $anchorScroll, $timeout, $location){

	$scope.errorMessage = '';
	BaseCtrl.call(this, $scope);
	$scope.fileName = "Choose file..."
	$scope.initialIcon = "";
	/*Initializing data, for adding a new category.
    */
	$scope.data = {
	            "component_type": "CATEGORY",
	            "status": false,
	            "name": "",
	            "icon": '',
	            "parent_category": [],
	            "parent_section": []
            }


    /*Function to fetch the category details
    */
	$scope.fetchCategory = function(){
		var fetchCategorySuccessCallback = function(data){
			$scope.$emit('hideLoader');
			$scope.data = data;
			$scope.initialIcon = $scope.data.icon;
		}
		$scope.invokeApi(ADContentManagementSrv.fetchComponent, $stateParams.id , fetchCategorySuccessCallback);
	}
	/*Checkin if the screen is loaded for a new category or,
	 * for existing category.
    */
	if($stateParams.id !== 'new'){
		$scope.isAddMode = false;
		$scope.fetchCategory();
	}
	else{
		$scope.isAddMode = true;
	}
	/*Function to return to preveous state
    */
	$scope.goBack = function(){
        $state.go('admin.cmscomponentSettings');
	}
	/*Function to popup the assign parent modal.
	 *The param isSection === true, implies the modal is for assigning sections
	 *Otherwise the modal is for assigning categories
    */
	$scope.openAddParentModal = function(isSection){
		$scope.isSection = isSection;
		$scope.componentList = [];
          ngDialog.open({
                template: '/assets/partials/contentManagement/adContentManagementAssignComponentModal.html',
                controller: 'ADContentManagementAssignComponentCtrl',
                className: '',
                scope: $scope
            });
	}
	/*Function to save a category
    */
	$scope.saveCategory = function(){
		var saveCategorySuccessCallback = function(data){
			$scope.$emit('hideLoader');
			$scope.goBack();
		}
		var unwantedKeys = ["image"];
		if($scope.initialIcon === $scope.data.icon) {
			unwantedKeys = ["icon", "image"];
		}
		var data = dclone($scope.data, unwantedKeys);
		$scope.invokeApi(ADContentManagementSrv.saveComponent, data , saveCategorySuccessCallback);
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
	/* Function to remove the category from selected list*/
	$scope.deleteParentCategory = function(index){
		$scope.data.parent_category.splice(index, 1);
	}
	/* Function to remove the section from selected list*/
	$scope.deleteParentSection = function(index){
		$scope.data.parent_section.splice(index, 1);
	}
	/* Listener to know that the current category is deleted.
	 * Need to go back to preveous state in this case
	 */
	$scope.$on('componentDeleted', function(event, data) {

      $scope.goBack();

   });


}]);

