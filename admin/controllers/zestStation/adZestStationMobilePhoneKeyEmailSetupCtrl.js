admin.controller('ADZestStationMobilePhoneKeyEmailSetupCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'ADZestStationSrv', '$filter', function($scope, $state, $rootScope, $stateParams, ADZestStationSrv, $filter) {
    BaseCtrl.call(this, $scope);
    $scope.$emit('changedSelectedMenu', 10);

    $scope.data = {};

    $scope.fetchSettings = function() {
        var fetchSuccess = function(data) {
            $scope.data = data;
            $scope.$emit('hideLoader');
        };

        $scope.invokeApi(ADZestStationSrv.fetch, {}, fetchSuccess);
    };
    $scope.saveZestMobileAppMarketingDetails = function() {
        var saveSuccess = function() {
            $scope.successMessage = 'Success';
            $scope.$emit('hideLoader');
        };
        var saveFailed = function(response) {
            $scope.errorMessage = 'Failed';
            $scope.$emit('hideLoader');
        };
        var dataToSend = {
            'kiosk': $scope.data
        };

        $scope.invokeApi(ADZestStationSrv.save, dataToSend, saveSuccess, saveFailed);
    };

    $scope.init = function() {
        $scope.fetchSettings();
    };

    $scope.init();


}]);
