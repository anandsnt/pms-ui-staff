admin.controller('ADCustomRatesSequenceCtrl', ['$scope', 'ADRateSequenceSrv', '$state',
    function($scope, ADRateSequenceSrv, $state) {
        BaseCtrl.call(this, $scope);
        var init = function() {
                $scope.MODE = 'LIST';
                $scope.selectedSequence = {};
                $scope.customSequenceList = [];
                $scope.selectedCustomSequence = {};
                $scope.selectedCustomSequenceIndex = -1;
                fetchCustomSequence();
            },
            unSelectCustomSequence = function() {
                $scope.selectedCustomSequence = {};
                $scope.selectedCustomSequenceIndex = -1;
            },
            setMode = function( mode ) {
                $scope.MODE = mode;
            },
            fetchCustomSequence = function() {
                var successCallBackFetchCustomSequence = function (data) {
                        $scope.customSequenceList = data;
                        unSelectCustomSequence();
                        setMode('LIST')
                    },
                    options = {
                        successCallBack: successCallBackFetchCustomSequence
                    };

                $scope.callAPI(ADRateSequenceSrv.listCustomSequence, options);
            };

        $scope.addNewSequence = function(){
            setMode('ADD')
        };

        $scope.selectCustomSequence = function(index, customSequence) {
            $scope.selectedCustomSequenceIndex = index;
            $scope.selectedCustomSequence = customSequence;
        };

        $scope.createCustomSequence = function() {
            var successCallBackcreateCustomSequence = function (data) {
                    fetchCustomSequence();
                },
                postData = {
                    'name': $scope.selectedSequence.name
                },
                options = {
                    params: postData,
                    successCallBack: successCallBackcreateCustomSequence
                };

            $scope.callAPI(ADRateSequenceSrv.createCustomSequence, options);
        };

        $scope.editCustomSequence = function() {
            var successCallBackEditCustomSequence = function (data) {
                    fetchCustomSequence();
                },
                options = {
                    params: $scope.selectedCustomSequence,
                    successCallBack: successCallBackEditCustomSequence
                };

            $scope.callAPI(ADRateSequenceSrv.updateCustomSequence, options);
        };

        $scope.cancel = function() {
            setMode('LIST');
            unSelectCustomSequence();
        };

        $scope.backToRateSequence = function() {
            $state.go("admin.ratesSequence");
        };
        init();
    }
]);

