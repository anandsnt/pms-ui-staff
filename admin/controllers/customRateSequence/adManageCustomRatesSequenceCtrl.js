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
                $scope.selectedRate = null;
                $scope.selectedUnAssignedRateIndex = null;
                $scope.selectedAssignedRateIndex = null;
                ratesSearchCall = null;
                sequenceRateSearchCall = null;
                configPagination();
                fetchSequences();
                setSortableOptions();
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
            removeRateSections = function() {
                $scope.selectedRate = null;
                $scope.selectedUnAssignedRateIndex = null;
                $scope.selectedAssignedRateIndex = null;
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
                        removeRateSections();
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
                        removeRateSections();
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
            updateRateList = function() {
                fetchRates();
                fetchAssignedRates();
            },
            setSortableOptions = function() {
                $scope.sortableRateSequenceOptions = {
                    connectWith: "#unassigedrates",
                    disabled: false,
                    revert: 'invalid',
                    helper: 'clone',
                    appendTo: 'body',
                    update: function(e, ui) {
                        var sortable = ui.item.sortable,
                            rate = sortable.model;

                        if (sortable.dropindex !== sortable.index && sortable.dropindex !== null
                            && rate.sort_order !== null && sortable.droptarget[0].id !== 'unassigedrates') {
                            $scope.selectRate(rate);
                            $scope.assignRate(sortable.dropindex + 1);
                        }
                    },
                    receive: function(e, ui) {
                        var sortable = ui.item.sortable,
                            rate = sortable.model;

                        $scope.selectRate(rate);
                        $scope.assignRate(sortable.dropindex + 1);
                    }
                };
                $scope.sortableRateOptions = {
                    connectWith: "#assigedrates",
                    revert: 'invalid',
                    helper: 'clone',
                    appendTo: 'body',
                    receive: function(e, ui) {
                        var rate = ui.item.sortable.model;

                        $scope.selectRate(rate);
                        $scope.unAssignRate();
                    }
                };
            },
            errorCallBack = function(e) {
                $scope.$emit('hideLoader');
                $scope.errorMessage = e;
                updateRateList();
                $timeout(function() {
                    $scope.errorMessage = '';
                }, 6000);
            },
            clearSearchQuery = function() {
                $scope.sequenceRateQuery = '';
                $scope.rateQuery = '';
                $scope.sortableRateSequenceOptions.disabled = false;
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
                $scope.sortableRateSequenceOptions.disabled = $scope.sequenceRateQuery;
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
            $scope.rateQuery = '';
            $scope.sequenceRateQuery = '';
            updateRateList();
        };
        $scope.selectRate = function(rate, index) {
            if (rate.sort_order === null) {
                $scope.selectedUnAssignedRateIndex = index;
                $scope.selectedAssignedRateIndex = null;
            } else {
                $scope.selectedUnAssignedRateIndex = null;
                $scope.selectedAssignedRateIndex = index;
            }
            $scope.selectedRate = rate;
        };
        $scope.assignRate = function (dropIndex) {
            var successCallBack = function () {
                    clearSearchQuery();
                    updateRateList();
                },
                postData = {
                    'rate_sequence_id': $scope.selectedSequence.id,
                    'rate_id': $scope.selectedRate.id,
                    'sort_order': dropIndex ? dropIndex : $scope.assignedRates.length + 1
                },
                options = {
                    params: postData,
                    successCallBack: successCallBack,
                    failureCallBack: errorCallBack
                };

                $scope.callAPI(ADRateSequenceSrv.assignSquenceAndSortOrder, options);
        };
        $scope.unAssignRate = function () {
            var successCallBack = function () {
                    clearSearchQuery();
                    updateRateList();
                },
                postData = {
                    'rate_sequence_id': $scope.selectedSequence.id,
                    'rate_id': $scope.selectedRate.id
                },
                options = {
                    params: postData,
                    successCallBack: successCallBack,
                    failureCallBack: errorCallBack
                };

            $scope.callAPI(ADRateSequenceSrv.unAssignSquenceAndSortOrder, options);
        };
        $scope.backToRateSequence = function() {
            $state.go("admin.ratesSequence");
        };
        $scope.gotoManageSequence = function () {
            $state.go("admin.customRatesSequence");
        };

        init();
    }
]);
