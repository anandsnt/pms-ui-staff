admin.controller('ADChannelMgrCtrl', ['$scope', '$rootScope', '$state', 'ADChannelMgrSrv', 'ADHotelSettingsSrv', 'ngTableParams', '$filter', '$timeout', '$stateParams',
    function ($scope, $rootScope, $state, ADChannelMgrSrv, ADHotelSettingsSrv, ngTableParams, $filter, $timeout, $stateParams) {

        $scope.errorMessage = '';
        $scope.successMessage = "";

        $scope.loadTable = function () {
            var fetchSuccess = function (data) {
                
                $scope.$emit('hideLoader');
                $scope.totalCount = data.data.length;
                $scope.totalPage = Math.ceil(data.length / $scope.displyCount);
                $scope.data = data.data;
            };
            $scope.invokeApi(ADChannelMgrSrv.fetchManagers, {}, fetchSuccess);

        };

        $scope.loadTable();

        /**
         * To activate/deactivate a rate
         * @param {int} index of the selected rate type
         *
         */
        $scope.toggleActive = function (interface) {
            var id = interface.id, active = interface.active;
            var params = {'id': id, active: !active};
            var toggleSuccess = function () {
                $scope.$emit('hideLoader');
                //on success
                angular.forEach($scope.data, function (interface, key) {
                    if (interface.id === id) {
                        interface.active = !interface.active;
                    }
                });
            };
            var toggleFailure = function (data) {
                $scope.$emit('hideLoader');
                $scope.errorMessage = data;
            };
            $scope.invokeApi(ADChannelMgrSrv.toggleActivate, params, toggleSuccess, toggleFailure);
        };

        $scope.showLoader = function () {
            $scope.$emit('showLoader');
        };

    }]);

