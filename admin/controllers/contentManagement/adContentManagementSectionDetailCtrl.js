admin.controller('ADContentManagementSectionDetailCtrl',['$scope', '$state', '$stateParams', 'ADContentManagementSrv', 'ngTableParams','$filter', '$anchorScroll', '$timeout',  '$location', 
 function($scope, $state, $stateParams, ADContentManagementSrv, ngTableParams, $filter, $anchorScroll, $timeout, $location){
	
	$scope.errorMessage = '';
	BaseCtrl.call(this, $scope);
	$scope.data = {	            
	            "type": "SECTION",
	            "availability_status": "AVAILABLE",
	            "name": "",
	            "icon_file_name": ''
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

	$scope.$watch(
		function(){
		return $scope.data.icon_file_name;
	}, function(logo) {
				if(logo == '' || logo == null)
					$scope.fileName = "Choose File....";
				else 
					$scope.fileName = logo;
				$scope.icon_file_name = $scope.fileName;
			}
		);

	$scope.goBack = function(){
        $state.go('admin.cmscomponentSettings');                  
	}

	$scope.saveSection = function(){
		var saveSectionSuccessCallback = function(data){
			$scope.$emit('hideLoader');
			
		}
		$scope.invokeApi(ADContentManagementSrv.saveComponent, $scope.data , saveSectionSuccessCallback);
	}	

}]);

