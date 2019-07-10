admin.controller('ADManageCustomRatesSequenceCtrl', ['$scope', 'ADRateSequenceSrv', '$state', '$timeout',
    function($scope, ADRateSequenceSrv, $state, $timeout) {
        BaseCtrl.call(this, $scope);

        $scope.backToRateSequence = function() {
            $state.go("admin.ratesSequence");
        };
        $scope.gotoManage = function () {
            $state.go("admin.customRatesSequence");
        };
    }
]);

