angular.module('admin')
    .controller('ADChannelMgrRatesListCtrl', ['$scope', '$rootScope', '$stateParams', 'ADChannelMgrSrv', 'ngTableParams', 'ADRatesSrv',
        function ($scope, $rootScope, $stateParams, ADChannelMgrSrv, ngTableParams, ADRatesSrv) {

            ADBaseTableCtrl.call(this, $scope, ngTableParams);

            $scope.state = {
                mode: 'LIST'
            };

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

            $scope.fetchTableData = function($defer, params) {
                var getParams = $scope.calculateGetParams(params),
                    fetchSuccessOfItemList = function(data) {
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

                ADRatesSrv.fetchRoomTypes(mapping.rate_id).then(function (response) {
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

            (function () {
                $scope.tableParams = new ngTableParams({
                    page: 1, // show first page
                    count: $scope.displyCount, // count per page
                    sorting: {
                        room_no: 'asc' // initial sorting
                    }
                }, {
                    total: 0, // length of data
                    getData: $scope.fetchTableData
                });
            })();
        }]
    );
