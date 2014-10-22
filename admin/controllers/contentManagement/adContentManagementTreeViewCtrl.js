admin.controller('ADContentManagementTreeViewCtrl',['$scope', '$state', 'ADContentManagementSrv', 'ngTableParams','$filter', '$anchorScroll', '$timeout',  '$location', 
 function($scope, $state, ADContentManagementSrv, ngTableParams, $filter, $anchorScroll, $timeout, $location){
	
	$scope.errorMessage = '';
	BaseCtrl.call(this, $scope);
	
	 $scope.fetchTreeViewList= function(){
   		var successCallbackTreeFetch = function(data){
			$scope.$emit('hideLoader');
			$scope.data = data;
			$scope.setExpandStatus($scope.data);
						
		};
	   $scope.invokeApi(ADContentManagementSrv.fetchTreeViewList, {} , successCallbackTreeFetch);
   }
   $scope.setExpandStatus = function(data){
   		if(data.length == 0)
   			return;
   		for(var i = 0; i < data.length; i++ ){
   			data[i].isExpanded = false;
   			$scope.setExpandStatus(data[i].children);
   		}
   }   

   $scope.toggleExpansion = function(index){
   		$scope.selectedContent = $scope.data[index];
   		if($scope.selectedContent.isExpanded)
   			$scope.setExpandStatus($scope.selectedContent.children);
   		$scope.selectedContent.isExpanded = !$scope.selectedContent.isExpanded;
   }

   $scope.fetchTreeViewList();
	

}]);

