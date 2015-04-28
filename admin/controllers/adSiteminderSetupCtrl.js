admin.controller('adSiteminderSetupCtrl', ['$scope', 'adSiteminderSetupSrv', '$state', '$filter', '$stateParams', function ($scope, adSiteminderSetupSrv, $state, $filter, $stateParams) {

        $scope.errorMessage = '';
        $scope.successMessage = '';
        $scope.isLoading = true;

        BaseCtrl.call(this, $scope);

        $scope.fetchSiteminderSetupSuccessCallback = function(data){
            $scope.isLoading = false;
            $scope.$emit('hideLoader');
            $scope.data = data;
        };

        $scope.fetchSiteminderSetup = function () {
            $scope.invokeApi(adSiteminderSetupSrv.fetchSetup, {}, $scope.fetchSiteminderSetupSuccessCallback);
        };
        
        
        $scope.toggleSMClicked = function () {
            console.log('scope,data');
            console.log($scope.data);
            console.log('changing to: ' + !$scope.data.product_cross_customer.active);

            var toggleSMActiveSuccess = function () {
                $scope.data.product_cross_customer.active = !$scope.data.product_cross_customer.active;
                console.log('toggle complete, now: ' + $scope.data.product_cross_customer.active);
                
                $scope.invokeApi(adSiteminderSetupSrv.fetchSetup, {
                    'interface_id': 2,
                    'active': $scope.data.product_cross_customer.active
                }, $scope.fetchSiteminderSetupSuccessCallback);
            };

            $scope.invokeApi(adSiteminderSetupSrv.toggleActive, {
                'interface_id': 2,
                'active': $scope.data.product_cross_customer.active
            }, toggleSMActiveSuccess);

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
                //double check to see if it Actually failed..
                    if (data.status == 'failure'){
                        var msg = '';
                        if (typeof data[0] === typeof 'str') {
                        if (data[0].length > 1) {
                            msg = ': ' + data[0];
                        } else if (typeof data === typeof 'str') {
                            msg = ': data';
                        }
                    }
                    $scope.errorMessage = 'Siteminder Test Failed' + msg;
                } else {
                    $scope.isLoading = false;
                    $scope.successMessage = 'Siteminder Test Success';
                }
                    console.log(data);
                $scope.$emit('hideLoader');
                //  $scope.showTestResults('Success', data);
            };
            var testSiteminderSetupFailureCallback = function (data) {
                $scope.isLoading = false;
                var msg = '';
                if (typeof data[0] === typeof 'str') {
                    if (data[0].length > 1) {
                        msg = ': ' + data[0];
                    } else if (typeof data === typeof 'str') {
                        msg = ': data';
                    }
                }
                console.log('Siteminder Test Failed');
                $scope.errorMessage = 'Siteminder Test Failed' + msg;
                console.log(data);
                $scope.$emit('hideLoader');
                // $scope.showTestResults('Failure', data);
            };


            var checkCallback = function (response) {
                console.log('checking call back...');
                console.log(response);
                $scope.$emit('hideLoader');
                if (response.status == 'failure') {
                    testSiteminderSetupFailureCallback(response);
                } else {
                    testSiteminderSetupSuccessCallback(response);
                }
            }


            var unwantedKeys = ["available_trackers"];
            var testData = dclone($scope.data, unwantedKeys);
            $scope.invokeApi(adSiteminderSetupSrv.testSetup, testData, checkCallback);
        };

    }]);