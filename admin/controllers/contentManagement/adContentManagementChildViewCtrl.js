admin.controller('ADContentManagementChildViewCtrl',['$scope', '$state', 'ADContentManagementSrv', 'ngTableParams','$filter', '$anchorScroll', '$timeout',  '$location',
 function($scope, $state, ADContentManagementSrv, ngTableParams, $filter, $anchorScroll, $timeout, $location){

	$scope.errorMessage = '';
	BaseCtrl.call(this, $scope);

  $scope.parent_id = $scope.contentList[$scope.$index].id;

  /* Set the conten for this node as the elemnt with current index,
   * from the children of parent
   */
	$scope.contentList = $scope.contentList[$scope.$index].children;
   /* Function to toggle the expansion status for a node/component
    */
	$scope.toggleExpansion = function(index){

   		$scope.contentList[index].isExpanded = !$scope.contentList[index].isExpanded;
   }

   /* save new order*/

  $scope.saveNewPosition = function(id, position, prevPosition){
    var successCallbackSavePosition = function(data){

      $scope.$emit('hideLoader');
    }
    var data = {};
    data.id = id;
    data.parent_id = $scope.parent_id;
    data.position = position +1;
    data.previous_position = prevPosition +1;
    $scope.invokeApi(ADContentManagementSrv.saveComponentOrder, data , successCallbackSavePosition);

  }

   $scope.sortableOptions = {

     stop: function(e, ui){
      if(ui.item.sortable.dropindex != ui.item.sortable.index && ui.item.sortable.dropindex  !=  null){
        $scope.saveNewPosition(ui.item.sortable.model.id, ui.item.sortable.dropindex, ui.item.sortable.index);
      }
   }

   }

}]);

