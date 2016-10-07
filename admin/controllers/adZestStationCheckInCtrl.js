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
            var saveSuccess = function(response){
                $scope.successMessage = 'Success';
                $scope.$emit('hideLoader');
            };
            var saveFailed = function(response){
                console.warn(response);
                var message = '';
                if (response){
                    message = response;
                }
                $scope.errorMessage = message;
                $scope.$emit('hideLoader');
            };

            var params = {
                                'kiosk':$scope.zestSettings
                             };
            $scope.invokeApi(ADZestStationSrv.save, params, saveSuccess, saveFailed);
        };

        $scope.init = function(){
            $scope.fetchSettings();
        };

        $scope.init();


}]);
