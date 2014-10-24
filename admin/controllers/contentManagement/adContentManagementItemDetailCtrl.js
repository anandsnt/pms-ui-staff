admin.controller('ADContentManagementItemDetailCtrl',['$scope', '$state', '$stateParams', 'ADContentManagementSrv', 'ngTableParams','$filter', '$anchorScroll', '$timeout',  '$location', 
 function($scope, $state, $stateParams, ADContentManagementSrv, ngTableParams, $filter, $anchorScroll, $timeout, $location){
	
	$scope.errorMessage = '';
	BaseCtrl.call(this, $scope);
	
	 $scope.fileName = "Choose file..."
	$scope.data = {	            
	            "type": "SECTION",
	            "status": "AVAILABLE",
	            "name": "",
	            "icon": ''
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

	$scope.saveItem = function(){
		var saveItemSuccessCallback = function(data){
			$scope.$emit('hideLoader');
			
		}
		$scope.invokeApi(ADContentManagementSrv.saveComponent, $scope.data , saveItemSuccessCallback);
	}

	

}]);

