admin.controller('ADContentManagementSectionDetailCtrl',['$scope', '$state', '$stateParams', 'ADContentManagementSrv', 'ngTableParams','$filter', '$anchorScroll', '$timeout',  '$location', 
 function($scope, $state, $stateParams, ADContentManagementSrv, ngTableParams, $filter, $anchorScroll, $timeout, $location){
	
	$scope.errorMessage = '';
	BaseCtrl.call(this, $scope);
	
	 
	$scope.fetchSection = function(){
		var fetchSectionSuccessCallback = function(data){
			$scope.$emit('hideLoader');
			$scope.data = data;
		}
		$scope.invokeApi(ADContentManagementSrv.fetchComponent, {} , fetchSectionSuccessCallback);
	}

	if($stateParams.id != 'new')
		$scope.fetchSection();
	else{
		$scope.data = {	            
	            "type": "SECTION",
	            "availability_status": "AVAILABLE",
	            "name": "",
	            "icon_file_name": null
            }

	}

	
	

}]);

