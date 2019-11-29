angular.module('admin').
    controller('adInterfaceConfigurationCtrl', [
        '$scope', '$rootScope', 'config', 'adInterfacesSrv', 'dateFilter', '$stateParams', 'mappingTypes',
        function($scope, $rootScope, config, adInterfacesSrv, dateFilter, $stateParams, mappingTypes) {

            var interfaceIdentifier = $stateParams.id;

            var configUrls = {
                "SUNACCOUNTING": '/assets/partials/interfaces/SunAccounting/adSunAccountingSetup.html',
                "DEFAULT": '/assets/partials/interfaces/Common/setup.html'
            };

            var syncItems = {
                "SUNACCOUNTING": ['Journal and Market Data']
            };

            $scope.state = {
                activeTab: 'SETUP',
                mappingsUrl: '/assets/partials/interfaces/Common/mappingsList.html'
            };

            $scope.fetchConfigUrl = function() {
                return configUrls[$scope.interface] ? configUrls[$scope.interface] : configUrls["DEFAULT"];
            };

            $scope.changeTab = function(name) {
                $scope.state.activeTab = name;
            };

            /**
             *
             * @return {undefined}
             */
            $scope.toggleMappings = function() {
                $scope.state.activeTab = $scope.state.activeTab === 'SETUP' ? 'MAPPING' : 'SETUP';
            };


            $scope.saveInterfaceConfig = function() {
                var params = dclone($scope.config);

                $scope.deletePropertyIfRequired(params, 'sftp_password');
                $scope.callAPI(adInterfacesSrv.updateSettings, {
                    params: {
                        settings: params,
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
                $scope.setDefaultDisplayPassword($scope.config, 'sftp_password');
                $scope.availableSettings = _.keys(config);
                $scope.mappingTypes = mappingTypes.data;
                $scope.interface = interfaceIdentifier.toUpperCase();
                $scope.syncItems = syncItems[$scope.interface];
            })();
        }
    ]);