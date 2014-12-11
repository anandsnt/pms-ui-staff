admin.controller('settingsAndParamsCtrl',['$scope','settingsAndParamsSrv','settingsAndParamsData','chargeCodes', function($scope,settingsAndParamsSrv,settingsAndParamsData,chargeCodes){

	BaseCtrl.call(this, $scope);
	$scope.hours = ["01","02","03","04","05","06","07","08","09","10","11","12"];
	$scope.minutes = ["00","15","30","45"];


    $scope.data = settingsAndParamsData.business_date;
    $scope.chargeCodes = chargeCodes;
    $scope.selected_charge_code = settingsAndParamsData.no_show_charge_code_id;
  
    /**
    * To handle save button action
    *
    */ 
    $scope.saveClick = function(){

        var saveDetailsSuccessCallback = function(){
             $scope.$emit('hideLoader');
             $scope.goBackToPreviousState();
        }
        var selectedChargeCode = ( typeof $scope.selected_charge_code == 'undefined' ) ? "" : $scope.selected_charge_code;
        var dataToSend = { "no_show_charge_code_id" : selectedChargeCode , "business_date" : $scope.data };
        
        $scope.invokeApi(settingsAndParamsSrv.saveSettingsAndParamsSrv, dataToSend ,saveDetailsSuccessCallback);
    };


}]);