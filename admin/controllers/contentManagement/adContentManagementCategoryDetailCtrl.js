admin.controller('ADContentManagementCategoryDetailCtrl',['$scope', '$state', '$stateParams', 'ADContentManagementSrv', 'ngTableParams','$filter', '$anchorScroll', '$timeout',  '$location', 
 function($scope, $state, $stateParams, ADContentManagementSrv, ngTableParams, $filter, $anchorScroll, $timeout, $location){
	
	$scope.errorMessage = '';
	BaseCtrl.call(this, $scope);
	$scope.fileName = "Choose file..."
	$scope.data = {	            
	            "type": "CATEGORY",
	            "status": false,
	            "name": "",
	            "icon": '',
	            "parent_category": [],
	            "parent_section": []
            }

    

	$scope.fetchCategory = function(){
		var fetchCategorySuccessCallback = function(data){
			$scope.$emit('hideLoader');
			$scope.data = data;
		}
		$scope.invokeApi(ADContentManagementSrv.fetchComponent, $stateParams.id , fetchCategorySuccessCallback);
	}

	if($stateParams.id != 'new'){
		$scope.isAddMode = false;
		$scope.fetchCategory();
	}
	else{
		$scope.isAddMode = true;
	}	

	$scope.goBack = function(){
        $state.go('admin.cmscomponentSettings');                  
	}

	$scope.saveCategory = function(){
		var saveCategorySuccessCallback = function(data){
			$scope.$emit('hideLoader');
			
		}
		$scope.invokeApi(ADContentManagementSrv.saveComponent, $scope.data , saveCategorySuccessCallback);
	}
		

}]);

