admin.controller('ADContentManagementChildViewCtrl',['$scope', '$state', 'ADContentManagementSrv', 'ngTableParams','$filter', '$anchorScroll', '$timeout',  '$location', 
 function($scope, $state, ADContentManagementSrv, ngTableParams, $filter, $anchorScroll, $timeout, $location){
	
	$scope.errorMessage = '';
	BaseCtrl.call(this, $scope);
	
	$scope.contentList = $scope.contentList[$scope.$index].children;

	$scope.toggleExpansion = function(index){
   		
   		$scope.contentList[index].isExpanded = !$scope.contentList[index].isExpanded;
   }

}]);

