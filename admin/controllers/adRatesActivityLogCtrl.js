admin.controller('ADRatesActivityLogCtrl',['$scope', '$state','$stateParams', 'ADRateActivityLogSrv', 'ngTableParams', '$filter',  
    function($scope, $state, $stateParams, ADRateActivityLogSrv, ngTableParams, $filter){
	BaseCtrl.call(this, $scope);
        $scope.showActivityLog = false;
        $scope.logData = {};
        $scope.getRateLog = function(){
            $scope.showActivityLog = true;
            $scope.$emit('showLoader');
            var rateId = $stateParams.rateId;
            var callback = function(response){
                $scope.logData = response;
                $scope.$emit('hideLoader');
            };
            $scope.invokeApi(ADRateActivityLogSrv.fetchRateLog, {'id':rateId},callback);
        };
        
        $scope.toggleActivityLog = function(){
            if ($scope.detailsMenu !== 'adRateActivityLog'){
                $scope.detailsMenu = 'adRateActivityLog';
                $scope.getRateLog();
            } else {
                $scope.detailsMenu = '';
            }
        };

}]);