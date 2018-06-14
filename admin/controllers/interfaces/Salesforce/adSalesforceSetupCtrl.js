admin.controller('adSalesforceSetupCtrl', ['$scope', '$rootScope', 'config', 'adInterfacesCommonConfigSrv', 'dateFilter',
    function($scope, $rootScope, config, adInterfacesCommonConfigSrv, dateFilter) {

        var interfaceIdentifier = 'salesforce';

        $scope.sync = {
            start_date: null
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
            var isValidDateSelection = validDateSelection($scope.sync.start_date, $scope.sync.end_date);

            if (!isValidDateSelection) {
                $scope.errorMessage = ['ERROR: Date Selection Invalid!'];
                $scope.successMessage = '';
                return;
            }
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
            $scope.interface = interfaceIdentifier;
        })();
    }
]);
