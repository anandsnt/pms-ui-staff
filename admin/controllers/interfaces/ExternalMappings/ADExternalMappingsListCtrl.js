admin.controller('ADExternalMappingsListCtrl', ['$scope', '$state', 'mappings', '$stateParams',
    function($scope, $state, mappings, $stateParams) {

        $scope.onClickAdd = function() {
            $state.go('admin.add-external-mapping', {
                mapping_type: mappings.mapping[0].mapping_type,
                hotel_id: $stateParams.hotel_id,
                interface_id: $stateParams.interface_id,
                interface_name: $stateParams.interface_name
            });
        };

        (function() {
            $scope.interface = {
                name: $stateParams.interface_name
            };

            $scope.mappings = mappings.mapping[0].mapping_values;
        })();
    }
]);
