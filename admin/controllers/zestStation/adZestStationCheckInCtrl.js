admin.controller('ADZestStationCheckInCtrl', ['$scope', '$state', '$rootScope', '$stateParams', 'ADZestStationSrv', '$filter', 'Toggles',
    function($scope, $state, $rootScope, $stateParams, ADZestStationSrv, $filter, Toggles) {
        BaseCtrl.call(this, $scope);

        $scope.data = {};

        $scope.allowedPaymentTypes = [];
        $scope.excludedPaymentTypes = [];

        var fetchSettings = function() {
            var fetchSuccess = function(data) {
                $scope.zestSettings = data;
                $scope.allowedPaymentTypes = _.filter(data.payment_types, function(paymentType) {
                    return paymentType.active && paymentType.enable_zs_checkin;
                });
                $scope.excludedPaymentTypes = _.filter(data.payment_types, function(paymentType) {
                    return paymentType.active && !paymentType.enable_zs_checkin;
                });
                $scope.zestSettings = [];
                $scope.$emit('hideLoader');
            };

            $scope.invokeApi(ADZestStationSrv.fetch, {}, fetchSuccess);
        };

        var saveFailed = function(message) {
            $scope.errorMessage = message;
            $scope.$emit('hideLoader');
        };

        var savePaymentExclusionSettings = function() {
            var saveSuccess = function() {
                $scope.successMessage = 'Success';
                $scope.$emit('hideLoader');
            };

            var params = {
                application: 'KIOSK',
                payment_types: []
            };

            _.each($scope.allowedPaymentTypes, function(paymentType) {
                params.payment_types.push({
                    id: paymentType.id,
                    exclusion_type: "checkin",
                    activate: true
                });
            });
            _.each($scope.excludedPaymentTypes, function(paymentType) {
                params.payment_types.push({
                    id: paymentType.id,
                    exclusion_type: "checkin",
                    activate: false
                });
            });
            $scope.invokeApi(ADZestStationSrv.excludePaymenTypes, params, saveSuccess, saveFailed);
        };

        $scope.saveSettings = function() {
            var zestSettings = angular.copy($scope.zestSettings);

            delete zestSettings.payment_types;
            var params = {
                'kiosk': zestSettings
            };

            $scope.invokeApi(ADZestStationSrv.save, params, savePaymentExclusionSettings, saveFailed);
        };

        // open the form to list / add passport bypass reason
        $scope.openPassportNumberBypassView = function() {
            $scope.editPassportNumberBypassReason = true;
            $scope.passportBypassReason = {
                "description": ""
            };
        };

        $scope.editPassportBypassReason = function(reason) {
            $scope.addNewPassportNumberBypassReason = true;
            $scope.passportBypassReason = reason;
        };

        $scope.savePassportBypassReason = function() {
            if ($scope.addNewPassportNumberBypassReason) {
                $scope.zestSettings.passport_bypass_reasons.push($scope.passportBypassReason);
            }
            $scope.addNewPassportNumberBypassReason = false;
            $scope.editPassportNumberBypassReason = false;
        };

        $scope.cancelPassportBypassReason = function() {
            $scope.addNewPassportNumberBypassReason = false;
            $scope.editPassportNumberBypassReason = false;
        };

        $scope.deletePassportBypassReason = function() {
            
        };

        $scope.isKioskExcludePaymentMethods = Toggles.isEnabled('kiosk_exclude_payment_methods');
        fetchSettings();
    }
]);