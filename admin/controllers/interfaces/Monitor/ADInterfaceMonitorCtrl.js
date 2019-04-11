angular.module('admin').controller('ADInterfaceMonitorCtrl', ['$scope', 'interfaces', 'ADInterfaceMonitorSrv',
    function ($scope, interfaces, ADInterfaceMonitorSrv) {

        $scope.state = {
            originalComtrolList: '',
            comtrolList: '',
            unsavedComtrolList: false
        };

        $scope.onCancelEditComtrolList = function () {
            $scope.state.comtrolList = $scope.state.originalComtrolList;
            $scope.state.unsavedComtrolList = false;
        };

        $scope.onSaveComtrolList = function () {
            $scope.callAPI(ADInterfaceMonitorSrv.saveLlpts, {
                params: $scope.state.comtrolList,
                successCallBack: function () {
                    $scope.state.originalComtrolList = $scope.state.comtrolList;
                    $scope.state.unsavedComtrolList = false;
                }
            });
        };

        $scope.onComtrolListChange = function () {
            $scope.state.unsavedComtrolList = ($scope.state.comtrolList !== $scope.state.originalComtrolList);
        };

        (function () {
            var interfaceList = interfaces['external_interfaces'] || [];

            $scope.externalInterfaces = interfaceList.sort();

            if ($scope.externalInterfaces.indexOf('COMTROL') > -1) {
                $scope.callAPI(ADInterfaceMonitorSrv.fetchLlpts, {
                    successCallBack: function (response) {
                        $scope.state.originalComtrolList = response['llpts_installed_interfaces'] || '';
                        $scope.state.comtrolList = response['llpts_installed_interfaces'] || '';
                    }
                });
            }
        })();
    }
]);
