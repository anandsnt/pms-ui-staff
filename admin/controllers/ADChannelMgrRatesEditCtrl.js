angular.module('admin')
    .controller('ADChannelMgrRatesEditCtrl', ['$scope', '$rootScope', '$stateParams', 'ADChannelMgrSrv',
        function ($scope, $rootScope, $stateParams, ADChannelMgrSrv) {
            BaseCtrl.call(this, $scope);

            $scope.selectedUnAssignedRoomIndex = -1;
            $scope.selectedAssignedRoomIndex = -1;


            $scope.stopEditing = function (rate) {
                if ($scope.state.mode === 'ADD') {
                    $scope.state.mode = 'LIST';
                } else {
                    rate.editing = false;
                }
            };

            $scope.save = function () {
                var payLoad = {
                    channelId: $stateParams.id,
                    rate: $scope.currentMapping.rate_id,
                    roomTypes: _.pluck($scope.currentMapping.room_types, 'id'),
                    id: $scope.currentMapping.id
                };

                if ($scope.state.mode === 'ADD') {
                    $scope.callAPI(ADChannelMgrSrv.add, {
                        params: payLoad,
                        onSuccess: function () {
                            $scope.reloadTable();
                            $scope.state.mode = 'LIST';
                        }
                    });
                } else { // Editing existing configuration
                    $scope.callAPI(ADChannelMgrSrv.update, {
                        params: payLoad,
                        onSuccess: function () {
                            $scope.reloadTable($scope.currentPage);
                        }
                    });
                }
            };

            $scope.moveSelected = function (action) {
                if (action === 'ASSIGN' && $scope.selectedUnAssignedRoomIndex > -1) {
                    $scope.currentMapping.room_types = $scope.currentMapping.room_types
                        .concat($scope.currentMapping.availableRoomTypes
                            .splice($scope.selectedUnAssignedRoomIndex, 1));
                    $scope.selectedUnAssignedRoomIndex = -1;
                } else if (action === 'UNASSIGN' && $scope.selectedAssignedRoomIndex > -1) {
                    $scope.currentMapping.availableRoomTypes = $scope.currentMapping.availableRoomTypes
                        .concat($scope.currentMapping.room_types
                            .splice($scope.selectedAssignedRoomIndex, 1));
                    $scope.selectedAssignedRoomIndex = -1;
                }
            };


            $scope.moveAll = function (action) {
                if (action === 'ASSIGN') {
                    $scope.currentMapping.room_types = $scope.currentMapping.room_types
                        .concat($scope.currentMapping.availableRoomTypes);
                    $scope.currentMapping.availableRoomTypes = [];
                    $scope.selectedUnAssignedRoomIndex = -1;
                } else if (action === 'UNASSIGN') {
                    $scope.currentMapping.availableRoomTypes = $scope.currentMapping
                        .availableRoomTypes.concat($scope.currentMapping.room_types);
                    $scope.currentMapping.room_types = [];
                    $scope.selectedAssignedRoomIndex = -1;
                }

            };

            $scope.reachedAssignedRoomTypes = function () {
                $scope.selectedAssignedRoomIndex = -1;
            };

            $scope.reachedUnAssignedRoomTypes = function () {
                $scope.selectedUnAssignedRoomIndex = -1;
            };

            $scope.unAssignedRoomSelected = function ($event, index) {
                $scope.selectedUnAssignedRoomIndex = (index === $scope.selectedUnAssignedRoomIndex) ? -1 : index;
            };

            $scope.assignedRoomSelected = function ($event, index) {
                $scope.selectedAssignedRoomIndex = (index === $scope.selectedAssignedRoomIndex) ? -1 : index;
            };

        }]
    )
;
