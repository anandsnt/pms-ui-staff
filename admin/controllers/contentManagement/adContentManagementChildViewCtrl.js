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
   /* Function to save the availability status
    */
   $scope.saveAvailabilityStatus = function(id, status){
         var successCallbackAvailabilityStatus = function(data){
         $scope.$emit('hideLoader');                 
      };
      var data = {};
      data.status = status;
      data.id = id;
      
      $scope.invokeApi(ADContentManagementSrv.saveComponent, data , successCallbackAvailabilityStatus);
   } 

}]);

