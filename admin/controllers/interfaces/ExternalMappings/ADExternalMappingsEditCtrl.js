admin.controller('ADExternalMappingsEditCtrl', ['$scope', '$state', '$stateParams', 'mappingTypes', 'mapping', 'ADInterfaceMappingSrv',
    function($scope, $state, $stateParams, mappingTypes, mapping, ADInterfaceMappingSrv) {

        $scope.toggleMappingMode = function(mode) {
            $scope.interface.activeTab = mode;
        };

        $scope.navigateBack = function() {
            $state.go('admin.external-mappings', {
                hotel_id: $stateParams.hotel_id,
                interface_id: $stateParams.interface_id,
                interface_name: $stateParams.interface_name
            });
        };

        $scope.onClickDeleteMapping = function() {
            $scope.callAPI(ADInterfaceMappingSrv.deleteMappingWithId, {
                params: {
                    mapping_id: $stateParams.mapping_id
                },
                onSuccess: function() {
                    $scope.navigateBack();
                }
            });
        };

        $scope.onClickSaveMapping = function() {
            $scope.callAPI(ADInterfaceMappingSrv.updateMapping, {
                params: {
                    mapping_id: $stateParams.mapping_id,
                    ext_value: $scope.mapping.ext_value
                },
                onSuccess: function() {
                    $scope.navigateBack();
                }
            });
        };

        (function() {
            _.each(mappingTypes, function(mappingType) {
                mappingType.text = mappingType.name.replace(/(\_\w)/g, function(m) {
                    return ' ' + m[1].toUpperCase();
                });
            });

            $scope.mappingTypes = mappingTypes;
            $scope.sntValues = mappingTypes[0].sntvalues;

            $scope.mapping = mapping;

            $scope.interface = {
                name: $stateParams.interface_name,
                activeTab: 'MANUAL'
            };
        })();
    }
]);
