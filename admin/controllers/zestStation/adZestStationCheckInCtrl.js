admin.controller('ADZestStationCheckInCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'ADZestStationSrv', '$filter', 'paymentData',
    function($scope, $state, $rootScope, $stateParams, ADZestStationSrv, $filter, paymentData) {
    BaseCtrl.call(this, $scope);

    $scope.data = {};

    // TODO: add from API

    paymentData.payments = _.map(paymentData.payments, function(payment) {
        return {
            name: payment.description,
            id: payment.id,
            is_active: payment.is_active
        };
    });

    $scope.allowedPaymentTypes =  _.filter(paymentData.payments, function(payment) {
        return payment.is_active === "true";
    });
    $scope.excludedPaymentTypes = _.filter(paymentData.payments, function(payment) {
        return payment.is_active === "false";
    });

    $scope.fetchSettings = function() {
        var fetchSuccess = function(data) {
            $scope.zestSettings = data;
            $scope.$emit('hideLoader');
        };

        $scope.invokeApi(ADZestStationSrv.fetch, {}, fetchSuccess);
    };

    $scope.saveSettings = function() {
        var saveSuccess = function() {
            $scope.successMessage = 'Success';
            $scope.$emit('hideLoader');
        };
        var saveFailed = function(response) {
            var message = response ? response : ['Save Failed'];
            
            console.log(response);

            $scope.errorMessage = message;
            $scope.$emit('hideLoader');
        };

        var params = {
            'kiosk': $scope.zestSettings
        };
        console.log($scope.allowedPaymentTypes);
        console.log($scope.excludedPaymentTypes);
        //$scope.invokeApi(ADZestStationSrv.save, params, saveSuccess, saveFailed);
    };

    $scope.init = function() {
        $scope.fetchSettings();
    };

    $scope.init();


}]);
