admin.controller('ADContentManagementChildViewCtrl',['$scope', '$state', 'ADContentManagementSrv', 'ngTableParams','$filter', '$anchorScroll', '$timeout',  '$location', 
 function($scope, $state, ADContentManagementSrv, ngTableParams, $filter, $anchorScroll, $timeout, $location){
	
	$scope.errorMessage = '';
	BaseCtrl.call(this, $scope);
	
	$scope.contentList = $scope.selectedContent.children;

	$scope.toggleExpansion = function(index){
   		$scope.selectedContent = $scope.contentList[index];
   		if($scope.selectedContent.isExpanded)
   			$scope.setExpandStatus($scope.selectedContent.children);
   		$scope.selectedContent.isExpanded = !$scope.selectedContent.isExpanded;
   }

}]);

