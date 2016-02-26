admin.controller('ADZestStationCheckOutCtrl',['$scope','$rootScope', '$state','$stateParams', 'ADZestStationSrv', '$filter',  function($scope, $state,$rootScope, $stateParams, ADZestStationSrv, $filter){
	BaseCtrl.call(this, $scope);
	$scope.$emit("changedSelectedMenu", 1);
        
        $scope.data = {};       
        
        $scope.fetchSettings = function(){
            var fetchSuccess = function(data){
                if (data.colors){
                    $scope.data = data.colors;
                }
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
            var hasTagsRemoved = function(str){
                var regexp = new RegExp('#','g');
                str = str.replace(regexp, '');
                return str;
            };
            
            var data = $scope.zestSettings.colors;           
            var dataToSend = {
                                'kiosk':
                                        {
                                            "guest_bill":$scope.zestSettings.guest_bill
                                        }

                             };
            $scope.invokeApi(ADZestStationSrv.save, dataToSend, saveSuccess, saveFailed);
        };
        
        $scope.init = function(){
            $scope.fetchSettings();
        };
        
        $scope.init();
    

}]);