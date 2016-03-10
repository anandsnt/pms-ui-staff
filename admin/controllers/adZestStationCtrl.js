admin.controller('ADZestStationCtrl',['$scope','$rootScope', '$state','$stateParams', 'ADZestStationSrv', '$filter',  function($scope, $state,$rootScope, $stateParams, ADZestStationSrv, $filter){
	BaseCtrl.call(this, $scope);
	$scope.$emit("changedSelectedMenu", 10);

        $scope.data = {};


        $scope.fetchSettings = function(){
            var fetchSuccess = function(data){
                $scope.zestSettings = data;
                $scope.$emit('hideLoader');

                if (!$scope.zestSettings.zest_lang){$scope.zestSettings.zest_lang={}};
                if (!$scope.zestSettings.zest_lang.English){$scope.zestSettings.zest_lang.English=false};
                if (!$scope.zestSettings.zest_lang.French){$scope.zestSettings.zest_lang.French=false};
                if (!$scope.zestSettings.zest_lang.Spanish){$scope.zestSettings.zest_lang.Spanish=false};
                if (!$scope.zestSettings.zest_lang.German){$scope.zestSettings.zest_lang.German=false};
                if (!$scope.zestSettings.zest_lang.Italian){$scope.zestSettings.zest_lang.Italian=false};
                if (!$scope.zestSettings.zest_lang.enabled){$scope.zestSettings.zest_lang.enabled=false};

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
                                            "home_screen":$scope.zestSettings.home_screen,
                                            "zest_station_message_texts" :$scope.zestSettings.zest_station_message_texts,
                                            "zest_lang":$scope.zestSettings.zest_lang
                                        }

                             };
            $scope.invokeApi(ADZestStationSrv.save, dataToSend, saveSuccess, saveFailed);
        };
        $scope.init = function(){
            $scope.fetchSettings();
        };

        $scope.init();


}]);
