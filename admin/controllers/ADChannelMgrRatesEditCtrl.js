angular.module('admin')
    .controller('ADChannelMgrRatesEditCtrl', ['$scope', '$rootScope', '$stateParams', 'ADChannelMgrSrv', 'ADRatesSrv',
        function ($scope, $rootScope, $stateParams, ADChannelMgrSrv, ADRatesSrv) {
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

            $scope.addListener('RATE_SELECTED', function (event, data) {
                $scope.callAPI(ADRatesSrv.fetchRoomTypes, {
                    params: data.id,
                    onSuccess: function (response) {
                        $scope.currentMapping.rate_id = data.id;
                        $scope.currentMapping.rate_name = data.name;
                        $scope.currentMapping.room_types = [];
                        $scope.currentMapping.availableRoomTypes = response.results;
                    }
                });
            });

        }]
    );
