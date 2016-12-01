admin.controller('adRevinateSetupCtrl', ['$scope', '$rootScope', 'config', 'adInterfacesCommonConfigSrv', 'dateFilter', 
    function($scope, $rootScope, config, adInterfacesCommonConfigSrv, dateFilter) {

        var interfaceIdentifier = 'revinate';

        $scope.sync = {
            start_date: null,
            end_date: null
        };

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

        // sync
        $scope.startSync = function() {
            var payLoad = {
                start_date: dateFilter($scope.sync.start_date, $rootScope.dateFormatForAPI),
                end_date: dateFilter($scope.sync.end_date, $rootScope.dateFormatForAPI),
                items: ['reservation']
            };

            $scope.callAPI(adInterfacesCommonConfigSrv.initSync, {
                params: {
                    payLoad: payLoad,
                    interfaceIdentifier: interfaceIdentifier
                },
                onSuccess: function() {
                    $scope.errorMessage = '';
                    $scope.successMessage = 'SUCCESS: Synchronization Initiated!';
                }
            });
        };

        (function() {
            //    init
            $scope.config = config;
        })();
    }
]);
