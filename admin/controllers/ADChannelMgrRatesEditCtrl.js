angular.module('admin')
    .controller('ADChannelMgrRatesEditCtrl', ['$scope', '$rootScope', '$stateParams', 'ADChannelMgrSrv',
        function ($scope, $rootScope, $stateParams, ADChannelMgrSrv) {
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

            $scope.topMoverightClicked = function () {

                if ($scope.selectedUnAssignedRoomIndex > -1) {
                    var temp = $scope.currentMapping.availableRoomTypes[$scope.selectedUnAssignedRoomIndex];

                    $scope.currentMapping.room_types.push(temp);
                    $scope.currentMapping.availableRoomTypes.splice($scope.selectedUnAssignedRoomIndex, 1);
                    $scope.selectedUnAssignedRoomIndex = -1;
                }
            };
            /*
             * To handle click action for selected room type
             *
             */
            $scope.topMoveleftClicked = function () {
                if ($scope.selectedAssignedRoomIndex > -1) {
                    var temp = $scope.currentMapping.room_types[$scope.selectedAssignedRoomIndex];

                    $scope.currentMapping.availableRoomTypes.push(temp);
                    $scope.currentMapping.room_types.splice($scope.selectedAssignedRoomIndex, 1);
                    $scope.selectedAssignedRoomIndex = -1;
                }
            };
            /*
             * To handle click action to move all assigned room types
             *
             */

            $scope.bottomMoverightClicked = function () {
                if ($scope.currentMapping.availableRoomTypes.length > 0) {
                    angular.forEach($scope.currentMapping.availableRoomTypes, function (item) {
                        $scope.currentMapping.room_types.push(item);
                    });
                    $scope.currentMapping.availableRoomTypes = [];
                }
                $scope.selectedUnAssignedRoomIndex = -1;
            };

            $scope.bottomMoveleftClicked = function () {
                if ($scope.currentMapping.room_types.length > 0) {
                    angular.forEach($scope.currentMapping.room_types, function (item) {
                        $scope.currentMapping.availableRoomTypes.push(item);
                    });
                    $scope.currentMapping.room_types = [];
                }
                $scope.selectedAssignedRoomIndex = -1;
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
    );
