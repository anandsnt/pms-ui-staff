admin.controller('ADRulesRestrictionCtrl', [
    '$scope',
    '$state',
    '$filter',
    'dateFilter',
    'ADRulesRestrictionSrv',
    function($scope, $state, $filter, dateFilter, ADRulesRestrictionSrv) {

        var init = function() {
            BaseCtrl.call(this, $scope);
            // lets empty lists all before fetch
            $scope.cancelRulesList = [];
            $scope.depositRuleslList = [];
            $scope.selectedSchedule = null;
            $scope.ruleList = {};
            fetchRestrictions();
        };

        /**
        * To fetch restrictions list
        */
        var fetchRestrictions = function() {
            var fetchRestrictionsSuccessCallback = function(data) {
                $scope.$emit('hideLoader');

                $scope.ruleList = data.results;
                $scope.total = data.total_count;

                // preload rules under - CANCELLATION_POLICY
                var cancelPolicy = _.find($scope.ruleList, function(item) {
                    return item.description === 'Cancellation Penalties';
                });

                fetchRuleCancellationPenalitiesList(cancelPolicy);


                // preload rules under - DEPOSIT_REQUEST
                var depositPolicy = _.find($scope.ruleList, function(item) {
                    return item.description === 'Deposit Requests';
                });

                fetchRuleDepositPoliciesList(depositPolicy);
            };

            $scope.invokeApi(ADRulesRestrictionSrv.fetchRestrictions, {}, fetchRestrictionsSuccessCallback);

            // lets fetch post_types too
            $scope.invokeApi(ADRulesRestrictionSrv.fetchRefVales, { type: 'post_type' }, function(data) {
                $scope.postTypes = data;
                $scope.$emit('hideLoader');
            });

            // lets fetch the hotel currency symbol
            $scope.invokeApi(ADRulesRestrictionSrv.fetchHotelCurrency, {}, function(data) {
                $scope.currencySym = data.currency.symbol;
                $scope.$emit('hideLoader');
            });

            $scope.invokeApi(ADRulesRestrictionSrv.fetchChargeCodes, {}, function(data) {
                $scope.chargeCodes = data;
                $scope.$emit('hideLoader');
            });
        };

        /*
        * To handle switch
        */
        $scope.switchClicked = function(item) {

            // on success
            var toggleSwitchLikesSuccessCallback = function(data) {
                item.activated = item.activated ? false : true;
                $scope.$emit('hideLoader');
            };

            var data = {
                'id': item.id,
                'status': item.activated ? false : true
            };

            $scope.invokeApi(ADRulesRestrictionSrv.toggleSwitch, data, toggleSwitchLikesSuccessCallback);
        };

        // get templates for editable restrictions
        $scope.getTemplateUrl = function() {

            if ( !this.item ) {
                return;
            }
            // if this is sysdef return
            if ( !this.item.editable || this.item.description === 'Levels' ) {
                return;
            }

            if ( this.item.description === 'Cancellation Penalties' ) {
                return '/assets/partials/rulesRestriction/adCancellationPenaltiesRules.html';
            }

            if ( this.item.description === 'Deposit Requests' ) {
                return '/assets/partials/rulesRestriction/adDepositRequestRules.html';
            }
        };

        // fetch rules under editable restrictions

        var fetchRuleCancellationPenalitiesList = function(item) {
            // hide any open forms
            $scope.showCancelForm = false;
            $scope.showDepositForm = false;
            // if this is sysdef return
            if ( !item.editable || item.description === 'Levels' ) {
                return;
            }
            var ruleType = 'CANCELLATION_POLICY';
            // fetch the appropriate policy
            var callback = function(data) {
                $scope.cancelRulesList = data.results;
                $scope.$emit('hideLoader');
            };

            $scope.invokeApi(ADRulesRestrictionSrv.fetchCancellationRules, { policy_type: ruleType }, callback);
        };
        var fetchRuleDepositPoliciesList = function(item) {
            // hide any open forms
            $scope.showCancelForm = false;
            $scope.showDepositForm = false;
            // if this is sysdef return
            if ( !item.editable || item.description === 'Levels' ) {
                return;
            }
            var ruleType = 'DEPOSIT_REQUEST';
            // fetch the appropriate policy
            var callback = function(data) {
                $scope.depositRuleslList = data.results;
                $scope.$emit('hideLoader');
            };

            $scope.invokeApi(ADRulesRestrictionSrv.fetchDepositeRules, {}, callback);
        };

        $scope.showPolicyArrow = function() {
            if ( this.item.description === 'Cancellation Penalties' ) {
                return $scope.cancelRulesList.length ? true : false;
            }

            if ( this.item.description === 'Deposit Requests' ) {
                return $scope.depositRuleslList.length ? true : false;
            }
        };

        $scope.toggleRulesListShow = function() {
            if ( this.item.description === 'Cancellation Penalties' ) {
                $scope.showCancelList = $scope.showCancelList ? false : true;
            }

            if ( this.item.description === 'Deposit Requests' ) {
                $scope.showDepositList = $scope.showDepositList ? false : true;
            }
        };

        // open the form to add a new rule
        $scope.openAddNewRuleForDepositePolicy = function() {
            $scope.rulesTitle = 'New';
            $scope.updateRule = false;
            $scope.singleRule = {};
            $scope.singleRule.schedules = [];
                var newSchedule = {
                "amount": null,
                "amount_type": "",
                "auto_charge_on_due_date": false,
                "advance_days": null,
                "post_type_id": null
                };

            $scope.singleRule.schedules.push(newSchedule);
            $scope.selectedSchedule =  $scope.singleRule.schedules[0];
            // identify the restriction
            $scope.showCancelForm = false;
            $scope.showDepositForm = true;
            $scope.rulesSubtitle = 'Deposit Request';
        };

        $scope.openAddNewRuleForCancelationPolicy = function() {
            $scope.rulesTitle = 'New';
            $scope.updateRule = false;
            // identify the restriction
            $scope.showCancelForm = true;
            $scope.showDepositForm = false;
            $scope.rulesSubtitle = 'Cancellation Penalty';
            $scope.singleRule = {};
            $scope.singleRule.advance_primetime = "AM";
            $scope.singleRule.policy_type = 'CANCELLATION_POLICY';
        };
        $scope.selectSchedule = function(index) {
            $scope.selectedSchedule = $scope.singleRule.schedules[index];
            $scope.selectedScheduleIndex = index;
        };

        $scope.dayInAdvanceSelections = [{
            id: 9999,
            description: 'At Booking'
        }, {
            id: 0,
            description: 'At Arrival'
        }, {
            id: 'custom',
            description: 'Custom'
        }];

        $scope.daysInAdvanceSelectionChanged = function() {
            if ($scope.selectedSchedule.advance_days_selection === 0) {
                $scope.selectedSchedule.advance_days = 0;
            } else if (parseInt($scope.selectedSchedule.advance_days_selection) === 9999) {
                $scope.selectedSchedule.advance_days = 9999;
            } else if ($scope.selectedSchedule.advance_days_selection === 'custom') {
                $scope.selectedSchedule.advance_days = '';
            }
        };

        // open the form to edit a rule
        $scope.editSingleDepositeRule = function(rule) {
            var rule = rule;
            var callback = function(data) {
                $scope.singleRule = data;
                $scope.selectedSchedule =  $scope.singleRule.schedules[0];
                $scope.selectedScheduleIndex = 0;
                $scope.singleRule.allow_deposit_edit = (data.allow_deposit_edit !== "" &&  data.allow_deposit_edit) ? true : false;
                $scope.showCancelForm = false;
                $scope.showDepositForm = true;
                $scope.rulesTitle = 'Edit';
                $scope.rulesSubtitle = $scope.singleRule.name + ' Rule';

                _.each($scope.singleRule.schedules, function(schedule) {
                    if (parseInt(schedule.advance_days) === 0) {
                        schedule.advance_days_selection = 0;
                    } else if (parseInt(schedule.advance_days) === 9999) {
                        schedule.advance_days_selection = 9999;
                    } else if (schedule.advance_days) {
                        schedule.advance_days_selection = 'custom';
                    }
                });

                // flag to know that we are in edit mode
                $scope.updateRule = true;
                $scope.$emit('hideLoader');
            };

            $scope.invokeApi(ADRulesRestrictionSrv.fetchSingleDepositeRule, { id: rule.id }, callback);
        };

        $scope.editSingleCancellationRule = function(rule) {
            var rule = rule;
            var callback = function(data) {
                // clear any previous data
                $scope.singleRule = data;
                $scope.singleRule.allow_deposit_edit = (data.allow_deposit_edit !== "" &&  data.allow_deposit_edit) ? true : false;
                $scope.singleRule.policy_type = 'CANCELLATION_POLICY';
                $scope.showCancelForm = true;
                $scope.showDepositForm = false;
                $scope.rulesTitle = 'Edit';
                $scope.rulesSubtitle = $scope.singleRule.name + ' Rule';
                // flag to know that we are in edit mode
                $scope.updateRule = true;
                $scope.$emit('hideLoader');
            };

            $scope.invokeApi(ADRulesRestrictionSrv.fetchCancellationSingleRule, { id: rule.id }, callback);
        };
        // hide all forms
        $scope.cancelCliked = function() {
            $scope.showCancelForm = false;
            $scope.showDepositForm = false;
        };

        $scope.addNewSchedule = function() {
            var newSchedule = {
                "amount": null,
                "amount_type": "",
                "auto_charge_on_due_date": false,
                "advance_days": null,
                "post_type_id": null
            };

            $scope.singleRule.schedules.push(newSchedule);
             $scope.selectedSchedule = $scope.singleRule.schedules[$scope.singleRule.schedules.length - 1];
             $scope.selectedScheduleIndex = $scope.singleRule.schedules.length - 1;
        };

        // save a new rule or update an edited rule
        $scope.saveUpdateDepositeRule = function(from) {
            var from = from,
                saveCallback,
                updateCallback;

            var apiParams =  angular.copy($scope.singleRule);

            _.each(apiParams.schedules, function(schedule) {
                delete schedule.advance_days_selection;
            });

            // if we are in update (or edit) mode
            if ( $scope.updateRule ) {
                updateCallback = function(data) {
                    fetchRuleDepositPoliciesList({
                        editable: true,
                        description: from
                    });
                    $scope.showDepositForm = false;
                    // we have completed the edit
                    $scope.updateRule = false;
                    $scope.$emit('hideLoader');
                };

                $scope.invokeApi(ADRulesRestrictionSrv.updateDepositeRule, apiParams, updateCallback);
            } else {
                saveCallback = function(data) {
                    fetchRuleDepositPoliciesList({
                        editable: true,
                        description: from
                    });
                    $scope.showDepositForm = false;
                    $scope.$emit('hideLoader');
                };

                $scope.invokeApi(ADRulesRestrictionSrv.saveDepositeRule, apiParams, saveCallback);
            }

        };
        // save a new rule or update an edited rule
        $scope.saveUpdateCancellationRule = function(from) {
            var from = from,
                saveCallback,
                updateCallback;
            // if we are in update (or edit) mode

            if ( $scope.updateRule ) {
                updateCallback = function(data) {
                    fetchRuleCancellationPenalitiesList({
                        editable: true,
                        description: from
                    });
                    $scope.showCancelForm = false;
                    // we have completed the edit
                    $scope.updateRule = false;
                    $scope.$emit('hideLoader');
                };
                $scope.invokeApi(ADRulesRestrictionSrv.updateRule, $scope.singleRule, updateCallback);
            } else {
                saveCallback = function(data) {
                  fetchRuleCancellationPenalitiesList({
                        editable: true,
                        description: from
                    });
                    $scope.showCancelForm = false;
                    // we have completed the edit
                    $scope.updateRule = false;
                    $scope.$emit('hideLoader');
                };
                $scope.invokeApi(ADRulesRestrictionSrv.saveRule, $scope.singleRule, saveCallback);
            }
        };

         $scope.deleteSchedule = function(index) {
            $scope.singleRule.schedules.splice(index, 1);
            if ($scope.singleRule.schedules.length !== 0) {
                if ($scope.selectedScheduleIndex === $scope.singleRule.schedules.length) {
                    $scope.selectedSchedule = $scope.singleRule.schedules[$scope.singleRule.schedules.length - 1];
                    $scope.selectedScheduleIndex = $scope.singleRule.schedules.length - 1;
                }
            } else {
            var newSchedule = {
                "amount": null,
                "amount_type": "",
                "auto_charge_on_due_date": false,
                "advance_days": null,
                "post_type_id": null
                };

            $scope.singleRule.schedules.push(newSchedule);
            $scope.selectedSchedule = $scope.singleRule.schedules[0];
            $scope.selectedScheduleIndex = 0;
            }
        };


        $scope.deleteDepositeRule = function(rule) {
            // keep them in local context of deleteRule function as
            // we dont know when callback will be called, so..
            // didnt understand? contact someone who does; dont remove
            var rule = rule;
            var callback = function() {
                var withoutThis = _.without( $scope.depositRuleslList, rule );

                $scope.depositRuleslList = withoutThis;
                $scope.$emit('hideLoader');
            };

            $scope.invokeApi(ADRulesRestrictionSrv.deleteDepositeRule, { id: rule.id }, callback);
        };

        $scope.deleteCancellationRule = function(rule) {
            var rule = rule;
            var callback = function() {
                var withoutThis = _.without( $scope.cancelRulesList, rule );

                $scope.cancelRulesList = withoutThis;
                $scope.$emit('hideLoader');
            };

            $scope.invokeApi(ADRulesRestrictionSrv.deleteRule, { id: rule.id }, callback);
        };
        /*
        *   Initialisation
        */
        init();
    }
]);