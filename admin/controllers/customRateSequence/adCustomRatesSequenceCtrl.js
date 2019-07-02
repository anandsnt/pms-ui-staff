admin.controller('ADCustomRatesSequenceCtrl', ['$scope', 'ADRateSequenceSrv', '$state', '$timeout',
    function($scope, ADRateSequenceSrv, $state, $timeout) {
        BaseCtrl.call(this, $scope);
        var init = function() {
                $scope.MODE = 'LIST';
                $scope.selectedSequence = {};
                $scope.customSequenceList = [];
                $scope.selectedCustomSequence = {};
                $scope.selectedCustomSequenceIndex = -1;
                fetchCustomSequence();
                setSortableOptions();
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
                        setMode('LIST');
                    },
                    options = {
                        successCallBack: successCallBackFetchCustomSequence
                    };

                $scope.callAPI(ADRateSequenceSrv.listCustomSequence, options);
            },
            fixHelper = function(e, ui) {
                ui.children().each(function() {
                    $(this).width($(this).width());
                });
                return ui;
            },
            updateSortOrder = function(id, position) {
                var successCallBackUpdateSortOrder = function () {
                        fetchCustomSequence();
                    },
                    postData = {
                        'rate_sequence_id': id,
                        'sequence_order': position + 1
                    },
                    options = {
                        params: postData,
                        successCallBack: successCallBackUpdateSortOrder
                    };

                if ( position !== undefined ) {
                    $scope.callAPI(ADRateSequenceSrv.updateSortOrder, options);
                }
            },
            setSortableOptions = function() {
                $scope.sortableOptions = {
                    helper: fixHelper,
                    start: function() {
                        selectSequenceTimeout = null;
                        $timeout(function() {
                            $scope.currentClickedElement = -1;
                        }, 1000);
                    },
                    stop: function(e, ui) {
                        if (ui.item.sortable.dropindex !== ui.item.sortable.index && ui.item.sortable.dropindex !== null) {
                            updateSortOrder(ui.item.sortable.model.id, ui.item.sortable.dropindex, ui.item.sortable.index);
                        }
                    }
                };
            },
            selectSequenceTimeout = null;

        $scope.addNewSequence = function() {
            setMode('ADD');
        };

        $scope.selectCustomSequence = function(index, customSequence) {
            selectSequenceTimeout = $timeout(function() {
                $scope.selectedCustomSequenceIndex = index;
                $scope.selectedCustomSequence = customSequence;
            }, 30);
        };

        $scope.createCustomSequence = function() {
            var successCallBackcreateCustomSequence = function () {
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
            var successCallBackEditCustomSequence = function () {
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
        $scope.deleteSequence = function( customSequence ) {
            var successCallBackDeleteCustomSequence = function () {
                    fetchCustomSequence();
                },
                options = {
                    params: customSequence,
                    successCallBack: successCallBackDeleteCustomSequence
                };

            $scope.callAPI(ADRateSequenceSrv.deleteCustomSequence, options);
        };
        $scope.backToRateSequence = function() {
            $state.go("admin.ratesSequence");
        };
        $scope.getTemplateUrl = function(index) {
            if (index === $scope.selectedCustomSequenceIndex) {
                return "/assets/partials/customRateSequence/adCustomRateSequenceEdit.html";
            } else {
                return "/assets/partials/customRateSequence/adCustomRateSequenceDetail.html";
            }
        };

        init();
    }
]);

