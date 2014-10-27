admin.controller('ADContentManagementSectionDetailCtrl',['$scope', '$state', 'ngDialog', '$stateParams', 'ADContentManagementSrv', 'ngTableParams','$filter', '$anchorScroll', '$timeout',  '$location', 
 function($scope, $state, ngDialog, $stateParams, ADContentManagementSrv, ngTableParams, $filter, $anchorScroll, $timeout, $location){
	
	$scope.errorMessage = '';
	BaseCtrl.call(this, $scope);
	$scope.fileName = "Choose file..."
	$scope.data = {	            
	            "component_type": "SECTION",
	            "status": false,
	            "name": "",
	            "icon": ''
            }

    

	$scope.fetchSection = function(){
		var fetchSectionSuccessCallback = function(data){
			$scope.$emit('hideLoader');
			$scope.data = data;
		}
		$scope.invokeApi(ADContentManagementSrv.fetchComponent, $stateParams.id , fetchSectionSuccessCallback);
	}

	if($stateParams.id != 'new'){
		$scope.isAddMode = false;
		$scope.fetchSection();
	}
	else{
		$scope.isAddMode = true;
	}	

	$scope.goBack = function(){
        $state.go('admin.cmscomponentSettings');                  
	}

	$scope.saveSection = function(){
		var saveSectionSuccessCallback = function(data){
			$scope.$emit('hideLoader');
			
		}
		$scope.invokeApi(ADContentManagementSrv.saveComponent, $scope.data , saveSectionSuccessCallback);
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

