admin.controller('ADManageCustomRatesSequenceCtrl', ['$scope', 'ADRateSequenceSrv', '$state', '$timeout',
    function($scope, ADRateSequenceSrv, $state, $timeout) {
        BaseCtrl.call(this, $scope);
        var init = function() {
                $scope.sequenceList = [];
                $scope.assignedRates = [];
                $scope.selectedSequenceIndex = 0;
                fetchSequences();
            },
            fetchSequences = function() {
                var successCallBackFetchSequences = function (data) {
                        $scope.sequenceList = data;
                        $scope.selectSequence();
                    },
                    options = {
                        successCallBack: successCallBackFetchSequences
                    };

                $scope.callAPI(ADRateSequenceSrv.listCustomSequence, options);
            },
            fetchRates = function() {

            },
            fetchAssignedRates = function() {
                var successCallBackFetchAssignedRates = function (data) {
                        $scope.assignedRates = data;
                    },
                    params = {
                        id: 26
                    },
                    options = {
                        successCallBack: successCallBackFetchAssignedRates,
                        params: params
                    };
                $scope.callAPI(ADRateSequenceSrv.fetchRatesInSequence, options);
            };

        $scope.selectSequence = function() {
            fetchRates();
            fetchAssignedRates();
        };
        $scope.backToRateSequence = function() {
            $state.go("admin.ratesSequence");
        };
        $scope.gotoManage = function () {
            $state.go("admin.customRatesSequence");
        };

        init();
    }
]);

