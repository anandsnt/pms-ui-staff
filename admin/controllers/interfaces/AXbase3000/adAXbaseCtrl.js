angular.module('admin').controller('adAXbaseCtrl', ['$scope', '$rootScope', 'config', 'adInterfacesCommonConfigSrv', 'dateFilter', '$stateParams', 'ngTableParams',
    function($scope, $rootScope, config, adInterfacesCommonConfigSrv, dateFilter, $stateParams, ngTableParams) {

        ADBaseTableCtrl.call(this, $scope, ngTableParams);

        var interfaceIdentifier = $stateParams.id;
        var getFormatedRoomsList = function(data) {
            var roomlist = [];

            _.each(data.room_mappings,
                function(mapings) {
                    if (mapings.value) {
                        roomlist.push({
                            room_number: mapings.value,
                            external_value: mapings.external_value
                        });
                    }
                });
            _.each(data.rooms,
                function(room) {
                    roomlist.push({
                        room_number: room.room_number,
                        external_value: ''
                    });

                });

            return roomlist;
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

        $scope.fetchRoomMappings = function() {
            $scope.callAPI(adInterfacesCommonConfigSrv.fetchRoomMappings, {
                params: {
                    config: $scope.config,
                    interfaceIdentifier: interfaceIdentifier
                },
                onSuccess: function(data) {
                    $scope.roomMappings = data.room_mappings;
                    constructRoomMappingList();
                }
            });
        };

        $scope.fetchTableData = function($defer, params) {

            $scope.callAPI(adInterfacesCommonConfigSrv.fetchRoomMappings, {
                params: $scope.calculateGetParams(params),
                onSuccess: function(data) {
                    $scope.roomMappings = data.room_mappings;


                    $scope.$emit('hideLoader');
                    // No expanded rate view
                    $scope.currentClickedElement = -1;
                    $scope.totalCount = parseInt(data.total_count);
                    $scope.totalPage = Math.ceil($scope.totalCount / $scope.displyCount);
                    $scope.numberOfRoomsConfigured = data.number_of_rooms_configured;
                    $scope.totalNumberOfConfigurableRooms = data.total_number_of_rooms;
                    $scope.is_add_available = data.is_add_available;
                    $scope.data = getFormatedRoomsList(data);
                    $scope.currentPage = params.page();
                    params.total($scope.totalCount);
                    $defer.resolve($scope.data);
                }
            });

            // $scope.invokeApi(ADRoomSrv.fetchRoomList, getParams, fetchSuccessOfItemList);
        };

        $scope.loadTable = function() {
            $scope.tableParams = new ngTableParams({
                    page: 1,  // show first page
                    count: $scope.displyCount, // count per page
                    sorting: {
                        name: 'asc' // initial sorting
                    }
                }, {
                    total: 0, // length of data
                    getData: $scope.fetchTableData
                }
            );
        };

        $scope.updateMappings = function(room) {
            $scope.callAPI(adInterfacesCommonConfigSrv.saveConfiguration, {
                params: {
                    config: room,
                    interfaceIdentifier: interfaceIdentifier
                },
                onSuccess: function() {
                }
            });
        };

        $scope.startImportRooms = function() {
            $scope.callAPI(adInterfacesCommonConfigSrv.startImportRooms, {
                params: {
                    interfaceIdentifier: interfaceIdentifier
                },
                onSuccess: function() {
                }
            });
        };

        (function() {
            $scope.config = config;
            $scope.interface = interfaceIdentifier.toUpperCase();
            $scope.roomMappingsList = [];
            $scope.loadTable();
            $scope.fetchRoomMappings();
        })();
    }
]);
