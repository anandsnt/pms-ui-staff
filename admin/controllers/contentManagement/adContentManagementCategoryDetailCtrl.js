admin.controller('ADContentManagementCategoryDetailCtrl',['$scope', '$state', 'ngDialog', '$stateParams', 'ADContentManagementSrv', 'ngTableParams','$filter', '$anchorScroll', '$timeout',  '$location', 
 function($scope, $state, ngDialog, $stateParams, ADContentManagementSrv, ngTableParams, $filter, $anchorScroll, $timeout, $location){
	
	$scope.errorMessage = '';
	BaseCtrl.call(this, $scope);
	$scope.fileName = "Choose file..."
	$scope.data = {	            
	            "component_type": "CATEGORY",
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

	$scope.saveCategory = function(){
		var saveCategorySuccessCallback = function(data){
			$scope.$emit('hideLoader');
			
		}
		$scope.invokeApi(ADContentManagementSrv.saveComponent, $scope.data , saveCategorySuccessCallback);
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

	$scope.$on('componentDeleted', function(event, data) {   

      $scope.goBack();

   });
		

}]);

