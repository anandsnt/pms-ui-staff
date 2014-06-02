admin.controller('ADReservationSettingsCtrl',['$scope', '$rootScope','$state','ADReservationSettingsSrv','reservationSettingsData' ,function($scope,$rootScope,$state,ADReservationSettingsSrv,reservationSettingsData){
	
  BaseCtrl.call(this, $scope);
  $scope.errorMessage = "";	

//TO DO:
  //for drop down list
  //$scope.defaultRateDisplays     = reservationSettingsData.defaultRateDisplays;

  //settings data
  //$scope.reservationSettingsData = reservationSettingsData.reservationSettingsData;
  
//TO DO:delete this line
  $scope.reservationSettingsData = reservationSettingsData;

/**
  *  Method to go back to previous state.
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
  *  save reservation settings changes
  */

  $scope.saveChanges = function(){

  	var saveChangesSuccessCallback = function(data){
        $scope.$emit('hideLoader');
    };
    var saveChangesFailureCallback = function(data){
    	$scope.errorMessage = data;
        $scope.$emit('hideLoader');
    };
    var data = $scope.reservationSettingsData;
    $scope.invokeApi(ADReservationSettingsSrv.saveChanges,data,saveChangesSuccessCallback,saveChangesFailureCallback); 

  };


}]);