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
            selectedExcludedIds: [],
            unSelectedExcludedIds: [],
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
            $scope.callAPI(ADInterfaceMappingSrv.saveAutoMapping, {
                params: {
                    interface_id: $stateParams.interface_id,
                    mapping_type: $scope.mapping.mapping_type,
                    prefix: $scope.auto.prefix,
                    remove_char: $scope.auto.removeFirst,
                    all_unmapped_rooms: $scope.auto.all,
                    room_no: $scope.unmappedRoomsFilterConfig.selectedExcludedIds
                },
                onSuccess: function() {
                    $scope.navigateBack();
                }
            });
        };

        $scope.onClickSaveAllMappings = function() {
            $scope.callAPI(ADInterfaceMappingSrv.saveAutoMapping, {
                params: {
                    interface_id: $stateParams.interface_id,
                    mapping_type: $scope.mapping.mapping_type,
                    prefix: $scope.auto.prefix,
                    remove_char: $scope.auto.removeFirst,
                    all_unmapped_rooms: $scope.auto.all
                },
                onSuccess: function() {
                    $scope.navigateBack();
                }
            });
        };

        $scope.skipNumberConversion = function () {
            // more conditions may come in future
            return $scope.interface.name === 'SAFLOK';
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

        $scope.onChangeMappingType = function() {
            // Reset the snt_value and ext_value
            $scope.mapping.snt_value = '';
            $scope.mapping.ext_value = '';
            // Map the available values
            $scope.sntValues = _.find(mappingTypes, {name: $scope.mapping.mapping_type}).sntvalues;
            $scope.extValues = _.find(mappingTypes, {name: $scope.mapping.mapping_type}).extvalues;
        };

        (function() {
            _.each(mappingTypes, function(mappingType) {
                mappingType.text = mappingType.name.replace(/(\_\w)/g, function(m) {
                    return ' ' + m[1].toUpperCase();
                });
            });

            if (!mappingTypes.length) {
                $scope.errorMessage = ['ERROR! No mapping types configured'];
                return;
            }

            $scope.mappingTypes = mappingTypes;

            $scope.mapping = {
                mapping_type: mappingTypes[0].name,
                snt_value: '',
                ext_value: ''
            };

            $scope.onChangeMappingType();

            $scope.auto = {
                all: true,
                prefix: '',
                removeFirst: false
            };

            $scope.interface = {
                name: $stateParams.interface_name,
                activeTab: 'MANUAL'
            };
        })();
    }
]);
