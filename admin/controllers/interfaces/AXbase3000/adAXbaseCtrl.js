angular.module('admin').
    controller('adAXbaseCtrl', [
        '$scope', '$rootScope', 'config', 'adInterfacesCommonConfigSrv', 'dateFilter', '$stateParams', 'ngTableParams',
        function($scope, $rootScope, config, adInterfacesCommonConfigSrv, dateFilter, $stateParams, ngTableParams) {

            ADBaseTableCtrl.call(this, $scope, ngTableParams);

            var interfaceIdentifier = $stateParams.id,
                isTableLoaded;
            var getFormatedRoomsList = function(data) {
                var roomlist = [],
                    mappedRooms = _.filter(data.room_mappings, function(mapping) {
                        return mapping.value;
                    });

                _.each(data.rooms,
                    function(room) {
                        var relevantMapping = _.find(mappedRooms, {value: room.room_number});
                        
                        roomlist.push({
                            room_number: room.room_number,
                            external_value: relevantMapping ? relevantMapping.external_value : ''
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

            $scope.toggleButton = function() {
                if ($scope.isActivateTabSelected && !isTableLoaded) {
                    $scope.loadTable();
                }
                $scope.isActivateTabSelected = !$scope.isActivateTabSelected;
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
                        $scope.isTableLoaded = true;
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
                $scope.callAPI(adInterfacesCommonConfigSrv.updateMappings, {
                    params: {
                        config: room,
                        interfaceIdentifier: interfaceIdentifier
                    },
                    onSuccess: function() {
                        $scope.errorMessage = '';
                        $scope.successMessage = 'SUCCESS: Room mapping updated!';
                    }
                });
            };

            $scope.startImportRooms = function() {
                $scope.callAPI(adInterfacesCommonConfigSrv.startImportRooms, {
                    params: {
                        interfaceIdentifier: interfaceIdentifier
                    },
                    onSuccess: function() {
                        $scope.errorMessage = '';
                        $scope.successMessage = 'SUCCESS: Room import Initiated!';
                    }
                });
            };

            (function() {
                $scope.config = config;
                $scope.interface = interfaceIdentifier.toUpperCase();
                $scope.roomMappingsList = [];
                $scope.isActivateTabSelected = true;
                isTableLoaded = false;
            })();
        }
    ]);
