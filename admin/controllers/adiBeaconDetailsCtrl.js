admin.controller('ADiBeaconDetailsCtrl',['$scope','$stateParams','$rootScope','$state',function($scope,$stateParams,$rootScope,$state){

	BaseCtrl.call(this, $scope);
	$scope.addmode = ($stateParams.action === "add")? true : false;
  $scope.displayMessage = $scope.addmode ? "Add new iBeacon" :"Edit"+" "+$stateParams.action;
	$scope.isIpad = navigator.userAgent.match(/iPad/i) != null;
	$scope.isIpad = true;

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

}]);