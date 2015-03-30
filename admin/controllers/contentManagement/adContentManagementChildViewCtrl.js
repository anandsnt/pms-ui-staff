admin.controller('ADContentManagementChildViewCtrl',['$scope', '$state', 'ADContentManagementSrv', 'ngTableParams','$filter', '$anchorScroll', '$timeout',  '$location', 
 function($scope, $state, ADContentManagementSrv, ngTableParams, $filter, $anchorScroll, $timeout, $location){
	
	$scope.errorMessage = '';
	BaseCtrl.call(this, $scope);
	
  /* Set the conten for this node as the elemnt with current index,
   * from the children of parent
   */
	$scope.contentList = $scope.contentList[$scope.$index].children;
   /* Function to toggle the expansion status for a node/component
    */
	$scope.toggleExpansion = function(index){
   		
   		$scope.contentList[index].isExpanded = !$scope.contentList[index].isExpanded;
   }   

   $scope.sortableOptions = {
 
     stop: function(e, ui){
        console.log("new list------"+ $scope.contentList);
   }

   }

}]);

