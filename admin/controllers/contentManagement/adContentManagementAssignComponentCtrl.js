admin.controller('ADContentManagementAssignComponentCtrl',['$scope', 'ngDialog', 'ADContentManagementSrv', 'ngTableParams','$filter', '$anchorScroll', '$timeout',  '$location', 
 function($scope, ngDialog, ADContentManagementSrv, ngTableParams, $filter, $anchorScroll, $timeout, $location){
	
	$scope.errorMessage = '';
	BaseCtrl.call(this, $scope);
	$scope.categories = [];
	$scope.sections = [];
	$scope.selectedCategories = [];
	$scope.selectedSections = [];
	
	$scope.fetchComponents= function(){
   		var successCallComponentFetch = function(data){
			$scope.$emit('hideLoader');
			$scope.componentList = data;
			$scope.setUpLists();			
		};
	   $scope.invokeApi(ADContentManagementSrv.fetchGridViewList, {} , successCallComponentFetch);
   }

   $scope.setUpLists =function(){
   		for(var i= 0; i < $scope.componentList.length; i++){
   			if($scope.componentList[i].component_type == 'SECTION'){
   				$scope.sections.push($scope.componentList[i]);
   			}else if($scope.componentList[i].component_type == 'CATEGORY'){
   				$scope.categories.push($scope.componentList[i]);   				
   			}
   		}
   }

   $scope.isComponentAvailable = function(component){
   		if(component.component_type == "SECTION")
   			return component.id != $scope.data.id && $scope.data.parent_section.indexOf(component) == -1;
   		else
   			return component.id != $scope.data.id && $scope.data.parent_category.indexOf(component) == -1;
   	}
   $scope.fetchComponents();
   $scope.sectionAdded = function(index){
   		if($scope.selectedSections.indexOf($scope.sections[index]) == -1)
   			$scope.selectedSections.push($scope.sections[index]);
   		else
   			$scope.selectedSections.splice($scope.selectedSections.indexOf($scope.sections[index]), 1);
   }
   $scope.categoryAdded = function(index){
   		if($scope.selectedCategories.indexOf($scope.categories[index]) == -1)
   			$scope.selectedCategories.push($scope.categories[index]);
   		else
   			$scope.selectedCategories.splice($scope.selectedCategories.indexOf($scope.categories[index]), 1);
   }
   $scope.isSectionSelected = function(index){
   		return $scope.selectedSections.indexOf($scope.sections[index]) != -1
   }
   $scope.isCategorySelected = function(index){
   		return $scope.selectedCategories.indexOf($scope.categories[index]) != -1
   }

   $scope.confirmClicked = function(){
   		$scope.data.parent_category = $scope.data.parent_category.concat($scope.selectedCategories);
   		$scope.data.parent_section = $scope.data.parent_section.concat($scope.selectedSections);
   		ngDialog.close();
   }
   $scope.cancelClicked = function(){
   		ngDialog.close();
   }	 

}]);