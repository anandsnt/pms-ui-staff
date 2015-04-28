admin.controller('adSiteminderSetupCtrl', ['$scope', 'adSiteminderSetupSrv', '$state', '$filter', '$stateParams', function ($scope, adSiteminderSetupSrv, $state, $filter, $stateParams) {

        $scope.errorMessage = '';
        $scope.successMessage = '';
        $scope.isLoading = true;

        BaseCtrl.call(this, $scope);

        $scope.fetchSiteminderSetupSuccessCallback = function (data) {
            $scope.isLoading = false;
            $scope.$emit('hideLoader');
            $scope.data = data;
        };

        $scope.fetchSiteminderSetup = function () {
            $scope.invokeApi(adSiteminderSetupSrv.fetchSetup, {}, $scope.fetchSiteminderSetupSuccessCallback);
        };

        $scope.toggleSMActiveSuccess = function () {
           $scope.data.data.product_cross_customer.active = !$scope.data.data.product_cross_customer.active;
           $scope.invokeApi(adSiteminderSetupSrv.fetchSetup, {
               'interface_id': $scope.data.data.product_cross_customer.interface_id,
               'active': $scope.data.data.product_cross_customer.active
           }, $scope.fetchSiteminderSetupSuccessCallback);
       };
                        
        $scope.toggleInterface = function(active, id){
            if (active){
                active=false;
            } else {
                active=true;
            }
            $('[name=active-inactive-toggle]').attr('ng-class', active);
            $scope.invokeApi(adSiteminderSetupSrv.toggleActive, {
                'interface_id': id,
                'active': active
            }, $scope.toggleSMActiveSuccess);
        };
                        
        $scope.toggleSMClicked = function () {
           var active = $scope.data.data.product_cross_customer.active,
                   id = $scope.data.data.product_cross_customer.interface_id;
            $scope.toggleInterface(active,id);
            
            
        };

        $scope.fetchSiteminderSetup();

        $scope.saveSiteminderSetup = function () {

            var saveSiteminderSetupSuccessCallback = function (data) {
                $scope.successMessage = 'Siteminder Save Success';
                $scope.isLoading = false;
                $scope.$emit('hideLoader');
            };

            var saveSiteminderSetupFailureCallback = function (data) {
                $scope.isLoading = false;

                $scope.errorMessage = 'Siteminder Save Failed';
                $scope.$emit('hideLoader');
            };

            var unwantedKeys = ["available_trackers"];
            var saveData = dclone($scope.data, unwantedKeys);

            $scope.invokeApi(adSiteminderSetupSrv.saveSetup, saveData, saveSiteminderSetupSuccessCallback, saveSiteminderSetupFailureCallback);
        };

        $scope.testSiteminderSetup = function () {

            var testSiteminderSetupSuccessCallback = function (data) {
                //double check to see if it Actually failed..
                if (data.status == 'failure') {
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
                $scope.errorMessage = 'Siteminder Test Failed' + msg;
                $scope.$emit('hideLoader');
            };

            var checkCallback = function (response) {
                $scope.$emit('hideLoader');
                if (response.status == 'failure') {
                    testSiteminderSetupFailureCallback(response);
                } else {
                    testSiteminderSetupSuccessCallback(response);
                }
            };

            var unwantedKeys = ["available_trackers"];
            var testData = dclone($scope.data, unwantedKeys);
            $scope.invokeApi(adSiteminderSetupSrv.testSetup, testData, checkCallback);
        };

    }]);