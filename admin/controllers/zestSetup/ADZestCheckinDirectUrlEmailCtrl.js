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


    $scope.hideRow = function($index){
        return ($scope.currentClickedUrl === $index && $scope.editMode);
    };

    $scope.showEditRow = function($index){
        return ($scope.currentClickedUrl === $index && $scope.editMode);
    };

    $scope.getTemplateUrl = function() {
        return "/assets/partials/zestSetup/adZestUrlEdit.html";
    };

    $scope.deleteUrl = function($index){
        $scope.urls.splice($index,1);
    };

    $scope.switchActivation = function($index){
        $scope.urls[$index].is_active = !$scope.urls[$index].is_active;
    };

    $scope.editSingle = function(index){
        $scope.currentClickedUrl = index;
        $scope.editMode = true;
        $scope.isAddMode            = false;
        $scope.url.name = $scope.urls[$scope.currentClickedUrl].name;
        $scope.url.path = $scope.urls[$scope.currentClickedUrl].path;
    };

    $scope.addNew =  function(){
        resetEditScreen();
        $scope.currentClickedUrl = -1;
        $scope.editMode           = false;
        $scope.isAddMode          = true;
    };

    $scope.cancelAddEdit = function(){
        resetEditScreen();
        $scope.currentClickedUrl = -1;
    };

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