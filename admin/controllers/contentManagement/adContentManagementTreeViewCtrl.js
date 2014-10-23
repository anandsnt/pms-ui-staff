admin.controller('ADContentManagementTreeViewCtrl',['$scope', '$state', 'ADContentManagementSrv', 'ngTableParams','$filter', '$anchorScroll', '$timeout',  '$location', 
 function($scope, $state, ADContentManagementSrv, ngTableParams, $filter, $anchorScroll, $timeout, $location){
	
	$scope.errorMessage = '';
	BaseCtrl.call(this, $scope);
	
	 $scope.fetchTreeViewList= function(){
   		var successCallbackTreeFetch = function(data){
			$scope.$emit('hideLoader');
			$scope.contentList = data;
			$scope.setExpandStatus($scope.contentList);
						
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
   		
   		$scope.contentList[index].isExpanded = !$scope.contentList[index].isExpanded;
   }

   $scope.fetchTreeViewList();
	

}]);

