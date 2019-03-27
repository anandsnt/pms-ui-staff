angular.module('admin').
    controller('adInterfaceConfigurationCtrl', [
        '$scope', '$rootScope', 'config', 'adInterfacesCommonConfigSrv', 'dateFilter', '$stateParams', 'mappingTypes',
        function($scope, $rootScope, config, adInterfacesCommonConfigSrv, dateFilter, $stateParams, mappingTypes) {

            var interfaceIdentifier = $stateParams.id;

            var configUrls = {
                "SUNACCOUNTING": '/assets/partials/interfaces/SunAccounting/adSunAccountingSetup.html',
                "DEFAULT": '/assets/partials/interfaces/Common/setup.html'
            };

            $scope.state = {
                activeTab: 'SETUP',
                mappingsUrl: '/assets/partials/interfaces/Common/mappingsList.html'
            };

            $scope.fetchConfigUrl = function() {
                return configUrls[$scope.interface] ? configUrls[$scope.interface] : configUrls["DEFAULT"];
            };

            /**
             *
             * @return {undefined}
             */
            $scope.toggleMappings = function() {
                $scope.state.activeTab = $scope.state.activeTab === 'SETUP' ? 'MAPPING' : 'SETUP';
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
                // init
                $scope.config = config;
                $scope.availableSettings = _.keys(config);
                $scope.mappingTypes = mappingTypes.data;
                $scope.interface = interfaceIdentifier.toUpperCase();
            })();
        }
    ]);
