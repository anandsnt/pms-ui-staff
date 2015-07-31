admin.controller('ADContentManagementAssignComponentCtrl',['$scope', 'ngDialog', 'ADContentManagementSrv', 'ngTableParams','$filter', '$anchorScroll', '$timeout',  '$location',
 function($scope, ngDialog, ADContentManagementSrv, ngTableParams, $filter, $anchorScroll, $timeout, $location){

	$scope.errorMessage = '';
	BaseCtrl.call(this, $scope);
	$scope.categories = [];
	$scope.sections = [];
	$scope.selectedCategories = [];
	$scope.selectedSections = [];
  $scope.isDataFetched = false;

   /*Function to fetch the components,
    *to provide the option to assign parent
    */
	$scope.fetchComponents= function(){
   		var successCallComponentFetch = function(data){
			$scope.$emit('hideLoader');
			$scope.componentList = data;
			$scope.setUpLists();
      $scope.isDataFetched = true;
		};
	   $scope.invokeApi(ADContentManagementSrv.fetchGridViewList, {} , successCallComponentFetch);
   }
   /*Function to split the fetched components to categories and sections,
    *to provide the option to assign parent
    */
   $scope.setUpLists =function(){
   		for(var i= 0; i < $scope.componentList.length; i++){
   			if($scope.componentList[i].component_type === 'SECTION'){
   				$scope.sections.push($scope.componentList[i]);
   			}else if($scope.componentList[i].component_type === 'CATEGORY'){
   				$scope.categories.push($scope.componentList[i]);
   			}
   		}
   }
   /*Function to check if the component is the same as the child component,
    *or if the component is already assigned
    */
   $scope.isComponentAvailable = function(component){
   		if(component.component_type === "SECTION") {
   			return component.id !== $scope.data.id && $scope.isElementOfArray($scope.data.parent_section, component) === -1;
      }
   		else {
   			return component.id !== $scope.data.id && $scope.isElementOfArray($scope.data.parent_category, component) === -1;
      }
   	}
   /*Function to check if a component is already present in the array
   */
   $scope.isElementOfArray = function(array, component){
         if(array.length === 0) {
            return -1;
         }
         for(var i =0; i < array.length; i++){
            if(array[i].id === component.id) {
               return i;
            }
         }
         return -1;
      }
   $scope.fetchComponents();

   /*Function to toggle the add section,
    *If section not selected, it will be selected. Otherwise it will deselect the section.
    */
   $scope.sectionAdded = function(index){
   		if($scope.selectedSections.indexOf($scope.sections[index]) === -1) {
   			$scope.selectedSections.push($scope.sections[index]);
      }
   		else {
   			$scope.selectedSections.splice($scope.selectedSections.indexOf($scope.sections[index]), 1);
      }
   }
   /*Function to toggle the add category,
    *If category not selected, it will be selected. Otherwise it will deselect the category.
    */
   $scope.categoryAdded = function(index){
   		if($scope.selectedCategories.indexOf($scope.categories[index]) === -1) {
   			$scope.selectedCategories.push($scope.categories[index]);
      }
   		else {
   			$scope.selectedCategories.splice($scope.selectedCategories.indexOf($scope.categories[index]), 1);
      }
   }
   /*Function to know the selection status for a section
    */
   $scope.isSectionSelected = function(index){
   		return $scope.selectedSections.indexOf($scope.sections[index]) !== -1
   }
   /*Function to know the selection status for a category
    */
   $scope.isCategorySelected = function(index){
   		return $scope.selectedCategories.indexOf($scope.categories[index]) !== -1
   }
   /*Function to add the selected sections and categories to the parent sections and and categories
    *of the component, on clicking the confirm button.
    */
   $scope.confirmClicked = function(){
      if($scope.selectedCategories.length > 0) {
   		 $scope.data.parent_category = $scope.data.parent_category.concat($scope.selectedCategories);
      }
   		if($scope.selectedSections.length > 0) {
        $scope.data.parent_section = $scope.data.parent_section.concat($scope.selectedSections);
      }
   		ngDialog.close();
   }
   /*Function to cancel the actions and dismiss the dialog
    */
   $scope.cancelClicked = function(){
   		ngDialog.close();
   }

}]);