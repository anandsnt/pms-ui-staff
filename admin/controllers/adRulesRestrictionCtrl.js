admin.controller('ADRulesRestrictionCtrl', [
    '$scope',
    '$state',
    '$filter',
    'dateFilter',
    'ADRulesRestrictionSrv',
    function($scope, $state, $filter, dateFilter, ADRulesRestrictionSrv) {

        $scope.init = function(){
            BaseCtrl.call(this, $scope);
            $scope.ruleList = {};
        }

        $scope.init();

        /**
        * To fetch restrictions list
        */
        $scope.fetchRestrictions = function() {
            var fetchHotelLikesSuccessCallback = function(data) {
                $scope.$emit('hideLoader');

                $scope.ruleList = data.results;
                $scope.total = data.total_count;
            };

            $scope.invokeApi(ADRulesRestrictionSrv.fetchRestrictions, {}, fetchHotelLikesSuccessCallback);

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
        };

        $scope.fetchRestrictions();

        /*
        * To handle switch
        */
        $scope.switchClicked = function(index){

            //on success
            var toggleSwitchLikesSuccessCallback = function(data) {
                $scope.ruleList[index].activated = $scope.ruleList[index].activated ? false : true;
                $scope.$emit('hideLoader');
            };

            var data = {
                'id': $scope.ruleList[index].id,
                'status': $scope.ruleList[index].activated ? false : true
            }

            $scope.invokeApi(ADRulesRestrictionSrv.toggleSwitch, data, toggleSwitchLikesSuccessCallback);
        }

        // get templates for editable restrictions
        $scope.getTemplateUrl = function() {
            
            if ( !this.item ) {
                return;
            };

            // if this is sysdef return
            if ( !this.item.editable || this.item.description === 'Levels' ) {
                return;
            };

            if ( this.item.description === 'Cancellation Penalties' ) {
                return '/assets/partials/rulesRestriction/adCancellationPenaltiesRules.html';
            };

            if ( this.item.description === 'Deposit Requests' ) {
                return '/assets/partials/rulesRestriction/adDepositRequestRules.html';
            };
        };

        // fetch rules under editable restrictions
        $scope.fetchRuleList = function(item) {

            // if this is sysdef return
            if ( !item.editable || item.description === 'Levels' ) {
                return;
            };

            var ruleType = item.description === 'Cancellation Penalties' ? 'CANCELLATION_POLICY' :
                             item.description === 'Deposit Requests' ? 'DEPOSIT_REQUEST' : '';

            // lets empty lists all before fetch
            $scope.cancelRulesList = [];
            $scope.depositRuleslList = [];

            // hide any open forms
            $scope.showCancelForm = false;
            $scope.showDepositForm = false;

            // fetch the appropriate policy
            var callback = function(data) {
                if ( ruleType === 'CANCELLATION_POLICY' ) {
                    $scope.cancelRulesList = data.results;
                };

                if ( ruleType === 'DEPOSIT_REQUEST' ) {
                    $scope.depositRuleslList = data.results;
                };

                $scope.$emit('hideLoader');
            };

            $scope.invokeApi(ADRulesRestrictionSrv.fetchRules, { policy_type: ruleType }, callback);
        };

        // open the form to add a new rule
        $scope.openAddNewRule = function() {
            $scope.rulesTitle = 'New';

            // identify the restriction
            if ( this.item.description === 'Cancellation Penalties' ) {
                $scope.showCancelForm = true;
                $scope.showDepositForm = false;

                $scope.rulesSubtitle = 'Cancellation Penalty';

                $scope.singleRule = {};
                $scope.singleRule.policy_type = 'CANCELLATION_POLICY';
            }

            if ( this.item.description === 'Deposit Requests' ) {
                $scope.showCancelForm = false;
                $scope.showDepositForm = true;

                $scope.rulesSubtitle = 'Deposit Request';

                $scope.singleRule = {};
                $scope.singleRule.policy_type = 'DEPOSIT_REQUEST';
            }
        };

        // open the form to edit a rule
        $scope.editSingleRule = function(rule, from) {
            var rule = rule,
                from = from;

            var callback = function(data) {
                
                // clear any previous data
                $scope.singleRule = data;

                console.log( $scope.singleRule.amount );
                var amtString = $scope.singleRule.amount + '',
                    num       = amtString.split('.')[0],
                    dec       = amtString.split('.')[1] * 1;

                if ( dec < 9 ) {
                    dec += '0';
                };

                $scope.singleRule.amount = num + '.' + dec;

                console.log( $scope.singleRule.amount );
;
                if ( from === 'Cancellation Penalties' ) {
                    $scope.singleRule.policy_type = 'CANCELLATION_POLICY';

                    // need to split HH:MM into individual keys
                    var hhmm, hh, mm;
                    if ( $scope.singleRule.advance_time ) {
                        var hhmm = dateFilter( $scope.singleRule.advance_time, 'hh:mm a' );

                        hh = hhmm.split(':')[0];
                        mm = hhmm.split(':')[1];

                        // convert string to number
                        hh *= 1;
                        if ( hh > 12 ) {
                            $scope.singleRule.advance_primetime = 'PM';
                            hh -= 12;
                        } else {
                            $scope.singleRule.advance_primetime = 'AM';
                        }

                        // padding 0 and converting back to string
                        if ( hh < 9 ) {
                            hh = '0' + hh;
                        } else {
                            hh += '';
                        }

                        $scope.singleRule.advance_hour = hh;
                        $scope.singleRule.advance_min = mm;
                    };


                    $scope.showCancelForm = true;
                    $scope.showDepositForm = false;
                }

                if ( from === 'Deposit Requests' ) {
                    $scope.singleRule.policy_type = 'DEPOSIT_REQUEST';

                    $scope.showCancelForm = false;
                    $scope.showDepositForm = true;
                }

                $scope.rulesTitle = 'Edit';
                $scope.rulesSubtitle = $scope.singleRule.name + ' Rule';

                // flag to know that we are in edit mode
                $scope.updateRule = true;

                $scope.$emit('hideLoader');
            };

            $scope.invokeApi(ADRulesRestrictionSrv.fetchSingleRule, { id: rule.id }, callback);
        };

        // hide all forms
        $scope.cancelCliked = function() {
            $scope.showCancelForm = false;
            $scope.showDepositForm = false;
        };

        // save a new rule or update an edited rule
        $scope.saveUpdateRule = function(from) {
            var from = from,
                saveCallback,
                updateCallback;

            // need to combine individuals HH:MM:ap to single hours entry
            // and remove the individuals before posting
            if ( $scope.singleRule.advance_hour || $scope.singleRule.advance_min ) {
                var hh, mm;

                if ($scope.singleRule.advance_primetime === 'PM') {
                    hh = $scope.singleRule.advance_hour ? ($scope.singleRule.advance_hour < 12 ? ($scope.singleRule.advance_hour * 1) + 12 : $scope.singleRule.advance_hour) : '00';
                } else {
                    hh = $scope.singleRule.advance_hour || '00';
                }

                mm = $scope.singleRule.advance_min ? $scope.singleRule.advance_min : '00';

                $scope.singleRule.advance_time = hh + ':' + mm;

                // remove these before sending
                var withoutEach = _.omit($scope.singleRule, 'advance_hour');
                withoutEach = _.omit(withoutEach, 'advance_min');
                withoutEach = _.omit(withoutEach, 'advance_primetime');

                $scope.singleRule = withoutEach;
            };

            // if we are in update (or edit) mode
            if ( $scope.updateRule ) {
                updateCallback = function(data) {
                    if ( from === 'Cancellation Penalties' ) {
                        $scope.fetchRuleList({
                            editable: true,
                            description: from
                        });
                        $scope.showCancelForm = false;
                    }

                    if ( from === 'Deposit Requests' ) {
                        $scope.fetchRuleList({
                            editable: true,
                            description: from
                        });
                        $scope.showDepositForm = false;
                    }

                    // we have completed the edit
                    $scope.updateRule = false;
                    $scope.$emit('hideLoader');
                };

                $scope.invokeApi(ADRulesRestrictionSrv.updateRule, $scope.singleRule, updateCallback);
            } else {
                saveCallback = function(data) {
                    if ( from === 'Cancellation Penalties' ) {
                        $scope.fetchRuleList({
                            editable: true,
                            description: from
                        });
                        $scope.showCancelForm = false;
                    }

                    if ( from === 'Deposit Requests' ) {
                        $scope.fetchRuleList({
                            editable: true,
                            description: from
                        });
                        $scope.showDepositForm = false;
                    }

                    $scope.$emit('hideLoader');
                };

                $scope.invokeApi(ADRulesRestrictionSrv.saveRule, $scope.singleRule, saveCallback);
            };

        };

        // delete a rule
        $scope.deleteRule = function(rule, from) {

            // keep them in local context of deleteRule function as
            // we dont know when callback will be called, so..
            // didnt understand? contact someone who does; dont remove
            var rule = rule,
                from = from;

            var callback = function() {
                if ( from === 'Cancellation Penalties' ) {
                    var withoutThis = _.without( $scope.cancelRulesList, rule );
                    $scope.cancelRulesList = withoutThis;
                }

                if ( from === 'Deposit Requests' ) {
                    var withoutThis = _.without( $scope.depositRuleslList, rule );
                    $scope.depositRuleslList = withoutThis;
                }

                $scope.$emit('hideLoader');
            };

            $scope.invokeApi(ADRulesRestrictionSrv.deleteRule, { id: rule.id }, callback);
        };
    }
]);	