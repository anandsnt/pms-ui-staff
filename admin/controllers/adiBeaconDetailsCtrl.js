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