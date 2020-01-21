admin.controller('ADTacsSetupCtrl', ['$scope', 'config', 'countryList', 'currencyList', 'adCommissionsConfigSrv',
    function($scope, config, countryList, currencyList, adCommissionsConfigSrv) {
        BaseCtrl.call(this, $scope);

        $scope.clearErrorMessage = function() {
            $scope.errorMessage = '';
        };

        $scope.saveInterfaceConfig = function() {
            var params = $scope.config;
            
            $scope.deletePropertyIfRequired(params, 'sftp_password');

            params.commission_interface_type = 'TACS';
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
            $scope.config = config;
            $scope.config.taxation_country_id = config.taxation_country_id ? config.taxation_country_id.toString() : '';
            $scope.config.currency_id = config.currency_id ? config.currency_id.toString() : '';
            $scope.countryList = countryList;
            $scope.currencyList = currencyList;

            // TODO - Should remove once APIs done
            if ($scope.config.sftp_password) {
                delete $scope.config.sftp_password;
            }
            
            $scope.setDefaultDisplayPassword($scope.config, 'sftp_password');

        })();
    }
]);