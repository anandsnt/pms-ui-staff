admin.controller('ADChannelMgrCtrl', ['$scope', '$rootScope', '$state', 'ADChannelMgrSrv', '$filter', '$timeout', '$stateParams',
    function ($scope, $rootScope, $state, ADChannelMgrSrv, $filter, $timeout, $stateParams) {

        $scope.errorMessage = '';
        $scope.successMessage = "";
        $scope.lastSelectedInterface = {};
        $scope.addRemoveShow = true;
        $scope.roomTypes = [];
        
        $scope.loadRoomTypes = function(){
            
            var fetchSuccess = function (data) {
                $scope.$emit('hideLoader');
                if (data.data){
                    $scope.roomTypes = data.data.room_types;
                }
            };
            $scope.invokeApi(ADChannelMgrSrv.fetchRoomTypes, {}, fetchSuccess);
        };
        $scope.loadRoomTypes();
        $scope.selectInterface = function(interface){
            $scope.lastSelectedInterface = interface;
            //store to state to pick up in adChannelMgrEditCtrl.js
            $state.selectedInterface = interface;
        };

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
        
        $scope.editChannelManager = function(interface){
            $scope.selectInterface(interface);
            $state.go('admin.channelManagerEditRates', interface);
        };

        $scope.showLoader = function () {
            $scope.$emit('showLoader');
        };

    }]);