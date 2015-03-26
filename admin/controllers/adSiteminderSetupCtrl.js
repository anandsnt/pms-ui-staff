admin.controller('adSiteminderSetupCtrl', ['$scope', 'adSiteminderSetupSrv', '$state', '$filter', '$stateParams', function ($scope, adSiteminderSetupSrv, $state, $filter, $stateParams) {

        $scope.errorMessage = '';
        $scope.successMessage = '';
        $scope.isLoading = true;

        BaseCtrl.call(this, $scope);

        $scope.fetchSiteminderSetup = function () {

            var fetchSiteminderSetupSuccessCallback = function (data) {
                $scope.isLoading = false;
                $scope.$emit('hideLoader');
                $scope.data = data;

            };
            $scope.emailDatas = [];
            $scope.invokeApi(adSiteminderSetupSrv.fetchSetup, {}, fetchSiteminderSetupSuccessCallback);

        };
        $scope.fetchSiteminderSetup();

        $scope.saveSiteminderSetup = function () {

            var saveSiteminderSetupSuccessCallback = function (data) {
                console.log('Siteminder Save Success');
                $scope.successMessage = 'Siteminder Save Success';
                console.log(data);
                $scope.isLoading = false;
                $scope.$emit('hideLoader');
            };

            var saveSiteminderSetupFailureCallback = function (data) {
                $scope.isLoading = false;

                $scope.errorMessage = 'Siteminder Save Failed';
                console.log('Siteminder Save Failed');
                console.log(data);
                $scope.$emit('hideLoader');
            };

            var unwantedKeys = ["available_trackers"];
            var saveData = dclone($scope.data, unwantedKeys);

            $scope.invokeApi(adSiteminderSetupSrv.saveSetup, saveData, saveSiteminderSetupSuccessCallback, saveSiteminderSetupFailureCallback);

        };

        $scope.testSiteminderSetup = function () {

            var testSiteminderSetupSuccessCallback = function (data) {
                $scope.isLoading = false;
                console.log('Siteminder Test Successful');

                $scope.successMessage = 'Siteminder Test Success';
                console.log(data);
                $scope.$emit('hideLoader');
                $scope.showTestResults('Success', data);
            };
            var testSiteminderSetupFailureCallback = function (data) {
                $scope.isLoading = false;
                var msg = '';
                if (typeof data[0] === typeof 'str'){
                    msg = ': '+data[0];
                }
                console.log('Siteminder Test Failed');
                $scope.errorMessage = 'Siteminder Test Failed'+msg;
                console.log(data);
                $scope.$emit('hideLoader');
                $scope.showTestResults('Failure', data);
            };
            var unwantedKeys = ["available_trackers"];
            var testData = dclone($scope.data, unwantedKeys);

            $scope.invokeApi(adSiteminderSetupSrv.testSetup, testData, testSiteminderSetupSuccessCallback, testSiteminderSetupFailureCallback);

        };
        $scope.showTestResults = function (s, data) {
            console.log('show test results here: ');
            console.log(arguments);
            /*
             var success = false;
             if (s === 'Success'){
             success = true;
             }
             ngDialog.open({
             template: '/assets/partials/settings/siteminderSetupTest.html',
             controller: 'RVEditRateFromDatepickerCtrl',
             className: 'ngdialog-theme-default single-date-picker',
             closeByDocument: true,
             scope: $scope,
             success:success
             });
             */
        };

    }]);