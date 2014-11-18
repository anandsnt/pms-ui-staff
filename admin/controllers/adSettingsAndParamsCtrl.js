admin.controller('settingsAndParamsCtrl',['$scope','settingsAndParamsSrv','settingsAndParamsData','chargeCodes', function($scope,settingsAndParamsSrv,settingsAndParamsData,chargeCodes){

	BaseCtrl.call(this, $scope);
	$scope.hours = ["HH","01","02","03","04","05","06","07","08","09","10","11","12"];
	$scope.minutes = ["00","15","30","45"];


    $scope.data = settingsAndParamsData.business_date;
    $scope.chargeCodes = chargeCodes.charge_codes;

 /**
    * To handle save button action
    *
    */ 
    $scope.saveClick = function(){

        var saveDetailsSuccessCallback = function(){
             $scope.$emit('hideLoader');
             $scope.goBackToPreviousState();
        }
    
        $scope.invokeApi(settingsAndParamsSrv.saveSettingsAndParamsSrv, $scope.data,saveDetailsSuccessCallback);
    };


}]);