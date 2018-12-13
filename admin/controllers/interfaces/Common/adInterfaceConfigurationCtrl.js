angular.module('admin').
    controller('adInterfaceConfigurationCtrl', [
        '$scope', '$rootScope', 'config', 'adInterfacesCommonConfigSrv', 'dateFilter', '$stateParams', 'mappingTypes',
        function($scope, $rootScope, config, adInterfacesCommonConfigSrv, dateFilter, $stateParams, mappingTypes) {

            var interfaceIdentifier = $stateParams.id;

            $scope.state = {
                activeTab: 'SETUP',
                configUrl: '/assets/partials/interfaces/Common/setup.html',
                mappingsUrl: '/assets/partials/interfaces/Common/mappingsList.html'
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
