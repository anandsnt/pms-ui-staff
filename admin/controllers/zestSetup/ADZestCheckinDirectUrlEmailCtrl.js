admin.controller('ADZestCheckinDirectUrlEmailCtrl',
    ['$scope', '$state', 'adZestCheckinCheckoutSrv','$filter',
    function($scope, $state, adZestCheckinCheckoutSrv,$filter){


    $scope.errorMessage = '';
    $scope.successMessage = '';

    BaseCtrl.call(this, $scope);

    var resetEditScreen  = function(){
        $scope.url                = {"name":"","path":"","is_active":false};
        $scope.editMode           = false;
        $scope.isAddMode          = false;
    };

    var init = function(){
      $scope.currentClickedUrl  = -1;
      resetEditScreen();
      $scope.urls               = [{'name':'direct','path':'direct','is_active':true},
                                    {'name':'text','path':'text','is_active':false}];
    };
    //hide if is addmode or editmode
    $scope.isAddOrEditMode = function(){
        return $scope.isAddMode || $scope.editMode;
    }
    //hide the row content if its clicked
    $scope.hideRow = function($index){
        return ($scope.currentClickedUrl === $index && $scope.editMode);
    };
   
    // display detail template
    $scope.getTemplateUrl = function() {
        return "/assets/partials/zestSetup/adZestUrlEdit.html";
    };
    //delete the selected url
    $scope.deleteUrl = function($index){
        $scope.urls.splice($index,1);
    };
    //toggle activation status
    $scope.switchActivation = function($index){
        $scope.urls[$index].is_active = !$scope.urls[$index].is_active;
    };
    //click on invidual row
    $scope.editSingle = function(index){
        $scope.currentClickedUrl = index;
        $scope.editMode = true;
        $scope.isAddMode            = false;
        $scope.url.name = $scope.urls[$scope.currentClickedUrl].name;
        $scope.url.path = $scope.urls[$scope.currentClickedUrl].path;
    };
    // add new button press
    $scope.addNew =  function(){
        resetEditScreen();
        $scope.currentClickedUrl = -1;
        $scope.editMode           = false;
        $scope.isAddMode          = true;
    };
    //canceling add/edit mode
    $scope.cancelAddEdit = function(){
        resetEditScreen();
        $scope.currentClickedUrl = -1;
    };
    // save/update  success
    $scope.saveAddEdit = function(){
        var newItem = angular.copy($scope.url);
        if($scope.isAddMode){
            $scope.urls.push(newItem);
        }
        else{
            $scope.urls[$scope.currentClickedUrl].name = newItem.name;
            $scope.urls[$scope.currentClickedUrl].path = newItem.path;
        }
        resetEditScreen();
        $scope.currentClickedUrl = -1;
    };

    init();

}]);