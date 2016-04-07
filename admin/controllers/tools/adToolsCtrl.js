admin.controller('ADToolsCtrl',
    ['$scope',
    '$state',
    '$timeout',
    '$location',
    '$anchorScroll',
    'ADToolsSrv',
    function($scope, $state, $timeout, $location, $anchorScroll, ADToolsSrv){

    $scope.errorMessage = '';
    BaseCtrl.call(this, $scope);
    $scope.toolsData = {};
    $scope.isAddMode = false;
    $scope.addEditHeading = "";
   /*
    * To fetch list of tools
    */
    $scope.listTools = function(){
        var successCallbackFetch = function(data){
            $scope.$emit('hideLoader');
            $scope.auto_sync_inventories = data.auto_sync_inventories;
            $scope.currentClickedElement = -1;
            $scope.isAddMode = false;
        };
        $scope.invokeApi(ADToolsSrv.fetch, {} , successCallbackFetch);
    };
    //To list tools
    $scope.listTools();
   /*
    * To render edit department screen
    * @param {index} index of selected department
    * @param {id} id of the department
    */
    $scope.editTools = function(index, id)    {
        $scope.toolsData={};
        $scope.currentClickedElement = index;
        $scope.isAddMode = false;
        $scope.addEditHeading = "Edit";
        var successCallbackRender = function(data){
            $scope.toolsData = data;
            $scope.$emit('hideLoader');
        };
        var data = {"id":id };
        $scope.invokeApi(ADToolsSrv.getToolsDetails, data , successCallbackRender);
    };
   /*
    * Render add screen
    */
    $scope.addNew = function()  {
        $scope.toolsData={};
        $scope.currentClickedElement = "new";
        $scope.isAddMode = true;
        $scope.addEditHeading = "Add";
        $timeout(function() {
            $location.hash('new-form-holder');
            $anchorScroll();
        });
    };
   /*
    * To get the template of edit screen
    * @param {int} index of the selected tool
    * @param {string} id of the tool
    */
    $scope.getTemplateUrl = function(index, id){
        if(typeof index === "undefined" || typeof id === "undefined") {
            return "";
        }
        if($scope.currentClickedElement === index){
                return "/assets/partials/tools/adToolsAdd.html";
        }
    };
  /*
   * To save/update tools details
   */
   $scope.saveTools = function(){
        var successCallbackSave = function(data){
            $scope.$emit('hideLoader');
            $scope.currentClickedElement = -1;
            $scope.listTools();

        };
        if($scope.isAddMode){
            $scope.invokeApi(ADToolsSrv.saveTools, $scope.toolsData , successCallbackSave);
        } else {
            $scope.invokeApi(ADToolsSrv.updateTool, $scope.toolsData , successCallbackSave);
        }
    };
   /*
    * To handle click event
    */
    $scope.clickCancel = function(){
        $scope.currentClickedElement = -1;
        $scope.addEditHeading = "";
    };
   /*
    * To update auto sync from list
    * @param {obj} object of selected invetory    */
    $scope.onToggleAutoSync = function(index, inventory){
        var successCallbackUpdateInventory = function(data){
            $scope.$emit('hideLoader');
        };
        inventory.is_auto_sync = !inventory.is_auto_sync;
        $scope.invokeApi(ADToolsSrv.updateTool, inventory , successCallbackUpdateInventory);
    };
}]);

