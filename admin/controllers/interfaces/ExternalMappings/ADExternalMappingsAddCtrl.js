admin.controller('ADExternalMappingsAddCtrl', ['$scope', '$state', '$stateParams', 'mappingTypes', 'ADInterfaceMappingSrv',
    function($scope, $state, $stateParams, mappingTypes, ADInterfaceMappingSrv) {

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

        $scope.unmappedRoomsFilterConfig = {
            item_number: {
                active: true,
                label: 'ROOM NO',
                column_width: 'width-20',
                mappedKey: 'room_no'
            },
            item_description: {
                active: true,
                label: 'ROOM TYPE',
                column_width: 'width-40',
                mappedKey: 'room_type_name'
            },
            selectedExcludedRoomIds: [],
            unSelectedExcludedRoomIds: [],
            apiService: 'ADInterfaceMappingSrv',
            serviceMethodName: 'fetchUnMappedRooms',
            serviceMethodParams: {
                interface_id: $stateParams.interface_id
            },
            noOfItemsSelected: 0,
            resultsKey: 'unmapped_rooms',
            trackByKey: 'room_no',
            listItemName: 'rooms'
        };

        $scope.onClickSaveRangeMapping = function() {
            console.log('onClickSaveRangeMapping', $scope.unmappedRoomsFilterConfig);
        };

        $scope.onClickSaveAllMappings = function() {
            console.log('onClickSaveAllMappings', $scope.unmappedRoomsFilterConfig);
        };

        $scope.onClickSaveNewMapping = function() {
            $scope.callAPI(ADInterfaceMappingSrv.createNewMapping, {
                params: {
                    interface_id: $stateParams.interface_id,
                    snt_value: $scope.mapping.snt_value,
                    ext_value: $scope.mapping.ext_value,
                    mapping_type: $scope.mapping.mapping_type
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

            $scope.mapping = {
                mapping_type: mappingTypes[0].name,
                snt_value: '',
                ext_value: ''
            };

            $scope.auto = {
                all: true
            };

            $scope.interface = {
                name: $stateParams.interface_name,
                activeTab: 'MANUAL'
            };
        })();
    }
]);
