admin.controller('ADReservationSettingsCtrl',['$scope', '$rootScope','$state' ,function($scope,$rootScope,$state){
	
	BaseCtrl.call(this, $scope);
	
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