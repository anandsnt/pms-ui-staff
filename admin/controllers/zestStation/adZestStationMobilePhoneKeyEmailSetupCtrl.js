admin.controller('ADZestStationMobilePhoneKeyEmailSetupCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'ADZestStationSrv', 'mobileAppDetails', '$filter', function($scope, $state, $rootScope, $stateParams, ADZestStationSrv, mobileAppDetails, $filter) {
    BaseCtrl.call(this, $scope);
    $scope.$emit('changedSelectedMenu', 10);

    $scope.data = {};

    $scope.fetchSettings = function() {
        var fetchSuccess = function(data) {
            $scope.data = data;

            $scope.data.mobile_phone_key_email.ios_app_enabled = mobileAppDetails.ios.enabled;
            $scope.data.mobile_phone_key_email.android_app_enabled = mobileAppDetails.android.enabled;

            if (!mobileAppDetails.ios.enabled) {
                $scope.data.mobile_phone_key_email.include_ios_banner = false;
            }
            if (!mobileAppDetails.android.enabled) {
                $scope.data.mobile_phone_key_email.include_android_banner = false;
            }

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
            $scope.errorMessage = 'Failed';
            $scope.$emit('hideLoader');
        };

        if ($scope.data.mobile_phone_key_email.include_android_banner === null) {
            $scope.data.mobile_phone_key_email.include_android_banner = false;
        }
        if ($scope.data.mobile_phone_key_email.include_ios_banner === null) {
            $scope.data.mobile_phone_key_email.include_ios_banner = false;
        }

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
