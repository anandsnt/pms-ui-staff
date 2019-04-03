angular.module('admin').
    controller('adInterfaceConfigurationCtrl', [
        '$scope', '$rootScope', 'config', 'adInterfacesSrv', 'dateFilter', '$stateParams', 'mappingTypes',
        function($scope, $rootScope, config, adInterfacesSrv, dateFilter, $stateParams, mappingTypes) {

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
                $scope.callAPI(adInterfacesSrv.updateSettings, {
                    params: {
                        settings: $scope.config,
                        integration: $scope.interface.toLowerCase()
                    },
                    onSuccess: function() {
                        $scope.errorMessage = '';
                        $scope.successMessage = 'SUCCESS: Settings updated!';
                    },
                    onFailure: function(response) {
                        $scope.successMessage = '';
                        $scope.errorMessage = response.errors;
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
