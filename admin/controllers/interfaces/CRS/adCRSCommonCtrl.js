angular.module('admin').controller('adCRSCommonCtrl', 
    ['$scope', 
    '$rootScope', 
    'config', 
    'adInterfacesCommonConfigSrv', 
    'dateFilter', 
    '$stateParams',
    function($scope, $rootScope, config, adInterfacesCommonConfigSrv, dateFilter, $stateParams) {
        BaseCtrl.call(this, $scope);

        var interfaceIdentifier = $stateParams.id;

        $scope.toggleEnabled = function() {
            config.enabled = !config.enabled;
        };

        $scope.saveInterfaceConfig = function() {
            var params = dclone($scope.config);

            $scope.deletePropertyIfRequired(params, 'password');

            $scope.callAPI(adInterfacesCommonConfigSrv.saveConfiguration, {
                params: {
                    config: params,
                    interfaceIdentifier: interfaceIdentifier
                },
                onSuccess: function() {
                    $scope.goBackToPreviousState();
                }
            });
        };

        (function() {
            //    init
            var onFetchMetaSuccess = function(response) {
                $scope.rates = response.rates;
                $scope.bookingOrigins = response.bookingOrigins;
                $scope.paymentMethods = response.paymentMethods;
                $scope.roomTypes = response.roomTypes;
            };

            $scope.callAPI(adInterfacesCommonConfigSrv.fetchOptionsList, {
                onSuccess: onFetchMetaSuccess
            });
            $scope.config = config;
            $scope.availableSettings = _.keys(config);
            $scope.interface = interfaceIdentifier.toUpperCase();
            $scope.setDefaultDisplayPassword($scope.config, 'password');
        })();
    }
]);
