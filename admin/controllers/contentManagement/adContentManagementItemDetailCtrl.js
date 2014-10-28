admin.controller('ADContentManagementItemDetailCtrl',['$scope', '$state', '$stateParams', 'ngDialog', 'ADContentManagementSrv', 'ngTableParams','$filter', '$anchorScroll', '$timeout',  '$location', 
 function($scope, $state, $stateParams, ngDialog, ADContentManagementSrv, ngTableParams, $filter, $anchorScroll, $timeout, $location){
	
	$scope.errorMessage = '';
	BaseCtrl.call(this, $scope);
	
	 $scope.fileName = "Choose file..."
	$scope.data = {	            
	            "component_type": "PAGE",
	            "status": false,
	            "name": "",
	            "image": '',
	            "address": "",
	            "phone": "",
	            "page_template": "POI",
	            "website_url": "",
	            "description": "",
	            "parent_category": []
            }

    

	$scope.fetchItem = function(){
		var fetchItemSuccessCallback = function(data){
			$scope.$emit('hideLoader');
			$scope.data = data;
		}
		$scope.invokeApi(ADContentManagementSrv.fetchComponent, $stateParams.id , fetchItemSuccessCallback);
	}

	if($stateParams.id != 'new'){
		$scope.isAddMode = false;
		$scope.fetchItem();
	}
	else{
		$scope.isAddMode = true;
	}	

	$scope.goBack = function(){
        $state.go('admin.cmscomponentSettings');                  
	}

	$scope.openAddCategoryModal = function(){
		$scope.isSection = false;
		
          ngDialog.open({
                template: '/assets/partials/contentManagement/adContentManagementAssignComponentModal.html',
                controller: 'ADContentManagementAssignComponentCtrl',
                className: '',
                scope: $scope
            });              
	}

	$scope.saveItem = function(){
		var saveItemSuccessCallback = function(data){
			$scope.$emit('hideLoader');
			$scope.goBack();
		}
		$scope.invokeApi(ADContentManagementSrv.saveComponent, $scope.data , saveItemSuccessCallback);
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

	$scope.deleteParentCategory = function(index){
		$scope.data.parent_category.splice(index, 1);
	}

	$scope.$on('componentDeleted', function(event, data) {   

      $scope.goBack();

   });

}]);

