admin.controller('ADReservationSettingsCtrl',['$scope', '$rootScope','$state','ADReservationSettingsSrv','reservationSettingsData' ,function($scope,$rootScope,$state,ADReservationSettingsSrv,reservationSettingsData){
	
  BaseCtrl.call(this, $scope);
  $scope.errorMessage = "";	


  $scope.defaultRateDisplays =  [  {
                                      "value": 0,
                                      "name": "Recommended"
                                    },
                                    {
                                     "value": 1,
                                     "name": "By Room Type"
                                   },
                                   {
                                     "value": 2,
                                     "name": "By Rate"
                                   }
                                 ];
 $scope.reservationSettingsData = reservationSettingsData;


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