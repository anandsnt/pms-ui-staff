admin.controller('ADManageCustomRatesSequenceCtrl', ['$scope', 'ADRateSequenceSrv', '$state', '$timeout',
    function($scope, ADRateSequenceSrv, $state, $timeout) {
        BaseCtrl.call(this, $scope);
        var init = function() {
                $scope.sequenceList = [];
                $scope.assignedRates = [];
                $scope.ratesList = [];
                $scope.selectedSequenceIndex = 0;
                $scope.sequenceRateQuery = '';
                $scope.rateQuery = '';
                $scope.selectedSequence = null;
                ratesSearchCall = null;
                sequenceRateSearchCall = null;
                configPagination();
                fetchSequences();
            },
            configPagination = function() {
                $scope.paginationState = {
                    perPage: 50,
                    page: 1,
                    firstIndex: 0,
                    lastIndex: 0,
                    totalRecords: 0,
                    maxPages: 0
                };
            },
            updatePaginationState = function(length) {
                var minIndex = (($scope.paginationState.page - 1) * $scope.paginationState.perPage) + 1,
                    maxIndex = $scope.paginationState.page * $scope.paginationState.perPage;

                    _.extend($scope.paginationState, {
                        totalRecords: length,
                        firstIndex: minIndex,
                        lastIndex: _.min([maxIndex, length]),
                        maxPages: parseInt((length + $scope.paginationState.perPage - 1) / $scope.paginationState.perPage, 10)
                    });
            },
            fetchSequences = function() {
                var successCallBackFetchSequences = function (data) {
                        $scope.sequenceList = data;
                        $scope.selectSequence($scope.sequenceList[0], 0);
                    },
                    options = {
                        successCallBack: successCallBackFetchSequences
                    };

                $scope.callAPI(ADRateSequenceSrv.listCustomSequence, options);
            },
            fetchRates = function() {
                var successCallBackfetchUnAssignedRates = function (data) {
                        $scope.ratesList = data.results;
                        updatePaginationState(data.total_count);
                    },
                    params = {
                        query: $scope.rateQuery,
                        page: $scope.paginationState.page,
                        per_page: $scope.paginationState.perPage

                    },
                    options = {
                        successCallBack: successCallBackfetchUnAssignedRates,
                        params: params
                    };

                $scope.callAPI(ADRateSequenceSrv.fetchUnAssignedRates, options);
            },
            fetchAssignedRates = function() {                
                var successCallBackFetchAssignedRates = function (data) {
                        $scope.assignedRates = data.results;
                    },
                    params = {
                        id: $scope.selectedSequence.id,
                        query: $scope.sequenceRateQuery
                    },
                    options = {
                        successCallBack: successCallBackFetchAssignedRates,
                        params: params
                    };
                    
                $scope.callAPI(ADRateSequenceSrv.fetchRatesInSequence, options);
            },
            ratesSearchCall = null,
            sequenceRateSearchCall = null;

        $scope.navigateFromPage = function(gotoNext) {
            if (gotoNext) {
                $scope.paginationState.page += 1 ;
            } else {
                $scope.paginationState.page -= 1 ;
            }
            fetchRates();
        };

        $scope.sequenceRateSearch = function() {
            if (sequenceRateSearchCall !== null) {
                clearTimeout(sequenceRateSearchCall);
            }
            sequenceRateSearchCall = setTimeout(function() {
                $scope.sequenceRateQuery.trim();
                fetchAssignedRates();
            }, 800);
        };

        $scope.rateSearch = function() {
            if (ratesSearchCall !== null) {
                clearTimeout(ratesSearchCall);
            }
            ratesSearchCall = setTimeout(function() {
                configPagination();
                $scope.rateQuery.trim();
                fetchRates();
            }, 800);
        };
        $scope.selectSequence = function(sequence, index) {
            $scope.selectedSequence = sequence;
            $scope.selectedSequenceIndex = index;
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

