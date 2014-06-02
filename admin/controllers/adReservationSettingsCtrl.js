admin.controller('ADReservationSettingsCtrl',['$scope', '$rootScope','$state','ADReservationSettingsSrv','reservationSettingsData' ,function($scope,$rootScope,$state,ADReservationSettingsSrv,reservationSettingsData){
	
  BaseCtrl.call(this, $scope);
  $scope.errorMessage = "";	
  $scope.defaultRateDisplays     = reservationSettingsData.defaultRateDisplays;
  $scope.reservationSettingsData = reservationSettingsData.reservationSettingsData;

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



  // $scope.defaultRateDisplays = {
  // 	"default_rate_displays": [
  // 	{
  // 		"value": 0,
  // 		"name": "Recommended"
  // 	},
  // 	{
  // 		"value": 1,
  // 		"name": " By Room Type"
  // 	},
  // 	{
  // 		"value": 2,
  // 		"name": " By Rate"
  // 	}
  // 	]
  // };


  // $scope.reservationSettingsData = {
  // 	"recommended_rate_display": true,
  // 	"default_rate_display_id": 1,
  // 	"max_guests": {
  // 		"max_adults": 3,
  // 		"max_children": 2,
  // 		"max_infants": 1
  // 	}
  // };


}]);