angular.module('admin').controller('adCRSCommonCtrl', 
    ['$scope', 
    '$rootScope', 
    'config', 
    'adInterfacesCommonConfigSrv', 
    'dateFilter', 
    '$stateParams',
    function($scope, $rootScope, config, adInterfacesCommonConfigSrv, dateFilter, $stateParams) {

        var interfaceIdentifier = $stateParams.id;

        $scope.toggleEnabled = function() {
            config.enabled = !config.enabled;
        };

        $scope.saveInterfaceConfig = function() {
            $scope.callAPI(adInterfacesCommonConfigSrv.saveConfiguration, {
                params: {
                    config: $scope.config,
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
        })();
    }
]);
