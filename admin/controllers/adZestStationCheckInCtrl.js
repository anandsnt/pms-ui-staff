admin.controller('ADZestStationCheckInCtrl',['$scope','$rootScope', '$state','$stateParams', 'ADZestStationSrv', '$filter',  function($scope, $state,$rootScope, $stateParams, ADZestStationSrv, $filter){
	BaseCtrl.call(this, $scope);
	$scope.$emit("changedSelectedMenu", 10);
        
        $scope.data = {};       
        
        $scope.fetchSettings = function(){
            var fetchSuccess = function(data){
                $scope.zestSettings = data;
                $scope.$emit('hideLoader');
            };
            $scope.invokeApi(ADZestStationSrv.fetch, {}, fetchSuccess);
        };
        $scope.saveSettings = function(){
            var saveSuccess = function(){
                $scope.successMessage = 'Success';
                $scope.$emit('hideLoader');
            };
            var saveFailed = function(response){
                $scope.errorMessage = 'Failed';
                $scope.$emit('hideLoader');
            };

            var dataToSend = {
                                'kiosk':
                                        {
                                            "registration_card":$scope.zestSettings.registration_card,
                                            "reg_card_text":$scope.zestSettings.reg_card_text,
                                            "enforce_deposit":$scope.zestSettings.enforce_deposit
                                        }

                             };
            $scope.invokeApi(ADZestStationSrv.save, dataToSend, saveSuccess, saveFailed);
        };
        
        $scope.init = function(){
            $scope.fetchSettings();
        };
        
        $scope.init();
    

}]);