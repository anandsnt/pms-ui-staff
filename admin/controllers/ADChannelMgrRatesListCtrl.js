angular.module('admin')
    .controller('ADChannelMgrRatesListCtrl', ['$scope', '$rootScope', '$stateParams', 'ADChannelMgrSrv', 'ngTableParams', 'ADRatesSrv',
        function ($scope, $rootScope, $stateParams, ADChannelMgrSrv, ngTableParams, ADRatesSrv) {

            ADBaseTableCtrl.call(this, $scope, ngTableParams);

            $scope.state = {
                mode: 'LIST',
                interfaceName: $stateParams.description
            };

            /**
             * Removes roomTypes already assigned from the complete list of roomTypes configured for a rate
             * @param {array} roomTypes list of all roomTypes configured for the rate
             * @param {array} assigned list of already assigned roomTypes
             * @returns {*} array of room types that can be assigned
             */
            function removeAssignedRoomTypes(roomTypes, assigned) {
                var assignedIds = [];

                if (!assigned.length) {
                    return roomTypes;
                }

                assignedIds = _.pluck(assigned, 'id');

                return _.filter(roomTypes, function (roomType) {
                    return _.indexOf(assignedIds, roomType.id) < 0;
                });
            }

            $scope.fetchTableData = function ($defer, params) {
                var getParams = $scope.calculateGetParams(params),
                    fetchSuccessOfItemList = function (data) {
                        $scope.$emit('hideLoader');
                        $scope.currentClickedElement = -1;
                        $scope.totalCount = data.total_count;
                        $scope.totalPage = Math.ceil(data.total_count / $scope.displyCount);
                        $scope.data = data.data;
                        $scope.currentPage = params.page();
                        params.total(data.total_count);
                        $defer.resolve($scope.data);
                    };

                getParams['interfaceId'] = $stateParams.id;

                $scope.invokeApi(ADChannelMgrSrv.fetchChannelRates, getParams, fetchSuccessOfItemList);
            };

            $scope.editRate = function (mapping) {
                // Close all open edit forms
                _.map($scope.data, function (mapping) {
                    mapping.editing = false;
                });

                ADRatesSrv.fetchRoomTypes(mapping.rate_id)
                    .then(function (response) {
                        mapping.editing = true;
                        $scope.currentMapping = angular.copy(mapping);
                        $scope.currentMapping.availableRoomTypes = removeAssignedRoomTypes(response.results, mapping.room_types);
                    });
            };

            $scope.onClickAdd = function () {
                $scope.currentMapping = {
                    id: '',
                    active: true,
                    rate_id: '',
                    rate_name: '',
                    room_types: []
                };

                $scope.state.mode = 'ADD';
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

            $scope.toggleActivate = function (mapping) {
                $scope.callAPI(ADChannelMgrSrv.toggleMappingStatus, {
                    params: _.extend(mapping, {
                        channelId: $stateParams.id,
                        id: mapping.id,
                        active: !mapping.active
                    })
                });
            };

            $scope.delete = function (mapping) {
                $scope.callAPI(ADChannelMgrSrv.deleteRateOnChannel, {
                    params: {
                        channelId: $stateParams.id,
                        id: mapping.id
                    },
                    onSuccess: function () {
                        $scope.reloadTable($scope.currentPage);
                    }
                });
            };

            (function () {
                $scope.tableParams = new ngTableParams({
                    page: 1, // show first page
                    count: $scope.displyCount // count per page
                }, {
                    total: 0, // length of data
                    getData: $scope.fetchTableData
                });
            })();
        }]
    );
