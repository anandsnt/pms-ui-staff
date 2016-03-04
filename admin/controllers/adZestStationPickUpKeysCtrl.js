admin.controller('ADZestStationPickUpKeysCtrl',['$scope','$rootScope', '$state','$stateParams', 'ADZestStationSrv', '$filter',  function($scope, $state,$rootScope, $stateParams, ADZestStationSrv, $filter){
	BaseCtrl.call(this, $scope);
	$scope.$emit("changedSelectedMenu", 10);
        
        $scope.data = {};       
        
        $scope.fetchSettings = function(){
            var fetchSuccess = function(data){
                console.info('updaing for guest bill');
                $scope.zestSettings = data;
                if (typeof $scope.zestSettings.pickup_qr_scan === typeof undefined){$scope.zestSettings.pickup_qr_scan=false;};
                
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
                        "pickup_qr_scan":$scope.zestSettings.pickup_qr_scan
                    }

            };
            $scope.invokeApi(ADZestStationSrv.save, dataToSend, saveSuccess, saveFailed);
        };
        
        $scope.init = function(){
            $scope.fetchSettings();
        };
        
        $scope.init();
    

}]);