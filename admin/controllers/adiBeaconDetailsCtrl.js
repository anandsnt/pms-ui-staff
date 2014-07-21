admin.controller('ADiBeaconDetailsCtrl',['$scope','$stateParams','$rootScope','$state',function($scope,$stateParams,$rootScope,$state){

  $scope.init = function(){
    BaseCtrl.call(this, $scope);
    $scope.addmode = ($stateParams.action === "add")? true : false;
    $scope.displayMessage = $scope.addmode ? "Add new iBeacon" :"Edit"+" "+$stateParams.action;
    $scope.isIpad = navigator.userAgent.match(/iPad/i) != null;
    $scope.isIpad = true;
    $scope.message ={};
    $scope.message.description ="";
    $scope.message.title ="";
  };
  $scope.init();

	/**
    *   Method to go back to previous state.
    */
  $scope.backClicked = function(){
    
    if($rootScope.previousStateParam){
      $state.go($rootScope.previousState, { menu:$rootScope.previousStateParam});
    }
    else if($rootScope.previousState){
      $state.go($rootScope.previousState);
    }
    else 
    {
      $state.go('admin.dashboard', {menu : 0});
    }
  
  };

  /**
    *   Activate option is only available when description and title are filled.
    */

  $scope.toggleStatus = function(){

    if($scope.isActive){
      $scope.isActive = false;
    }
    else if($scope.message.description.length>0 && $scope.message.title.length>0){
      $scope.isActive = ! $scope.isActive;
    }
      
  };

}]);