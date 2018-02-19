admin.controller('ADOnyxSetupCtrl', ['$scope', 'config', 'countryList', 'currencyList', 'adCommissionsConfigSrv',
    function($scope, config, countryList, currencyList, adCommissionsConfigSrv) {

        $scope.clearErrorMessage = function() {
            $scope.errorMessage = '';
        };
        
        $scope.saveInterfaceConfig = function() {
            var params = $scope.config;
            
            params.commission_interface_type = 'ONYX';
            $scope.callAPI(adCommissionsConfigSrv.saveConfiguration, {
                params: params,
                successCallBack: function() {
                    $scope.goBackToPreviousState();
                },
                failureCallBack: function(error) {
                    $scope.errorMessage = error;
                    if (angular.element(document.querySelector('.content-scroll')).find(".error_message").length) {
                        angular.element(document.querySelector('.content-scroll')).scrollTop(0);
                    }
                }
            });
        };

        (function() {
            $scope.errorMessage = '';
            $scope.config = config;
            $scope.config.taxation_country_id = config.taxation_country_id ? config.taxation_country_id.toString() : '';
            $scope.config.currency_id = config.currency_id ? config.currency_id.toString() : '';
            $scope.countryList = countryList;
            $scope.currencyList = currencyList;
        })();
    }
]);