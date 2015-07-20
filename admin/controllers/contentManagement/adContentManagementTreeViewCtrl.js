admin.controller('ADContentManagementTreeViewCtrl',['$scope', '$state', 'ADContentManagementSrv', 'ngTableParams','$filter', '$anchorScroll', '$timeout',  '$location',
 function($scope, $state, ADContentManagementSrv, ngTableParams, $filter, $anchorScroll, $timeout, $location){

	$scope.errorMessage = '';
	BaseCtrl.call(this, $scope);

   /* Function to fetch the components to be listed in the tree view
    */
	 $scope.fetchTreeViewList= function(){
   		var successCallbackTreeFetch = function(data){
			$scope.$emit('hideLoader');
			$scope.contentList = data;
			$scope.setExpandStatus($scope.contentList);

		};
	   $scope.invokeApi(ADContentManagementSrv.fetchTreeViewList, {} , successCallbackTreeFetch);
   }
   /* Function to set the expansion status as false for all the components
    */
   $scope.setExpandStatus = function(data){
   		if(data.length === 0) {
   			return;
      }
   		for(var i = 0; i < data.length; i++ ){
   			data[i].isExpanded = false;
   			$scope.setExpandStatus(data[i].children);
   		}
   }
   /* Function to toggle the expansion status
    */
   $scope.toggleExpansion = function(index){

   		$scope.contentList[index].isExpanded = !$scope.contentList[index].isExpanded;
   }

   $scope.fetchTreeViewList();
   /* Listener for the component deletion.
    */
   $scope.$on('componentDeleted', function(event, data) {

      $scope.deleteComponentFromTree($scope.contentList, data.id);

   });

   /* Function to delete a component from all the nodes in the tree, reccursively
    */
   $scope.deleteComponentFromTree = function(data, id){
         if(data.length === 0) {
            return;
         }
         for(var i = 0; i < data.length; i++ ){
            if(data[i].children.length > 0) {
               $scope.deleteComponentFromTree(data[i].children, id);
            }
            if(data[i].id === id){
               data.splice(i, 1);
               break;
            }
         }
   }
   /* Listener for the component status update.
    */
   $scope.$on('statusUpdated', function(event, data) {

      $scope.updateComponentStatusForTree($scope.contentList, data);

   });

   /* Function to update status of a component for all the appearances in the tree, reccursively
    */
   $scope.updateComponentStatusForTree = function(data, params){
         if(data.length === 0) {
            return;
         }
         for(var i = 0; i < data.length; i++ ){
            if(data[i].children.length > 0) {
               $scope.updateComponentStatusForTree(data[i].children, params);
            }
            if(data[i].id === params.id){
               data[i].status = params.status;
               break;
            }
         }
   }

}]);

