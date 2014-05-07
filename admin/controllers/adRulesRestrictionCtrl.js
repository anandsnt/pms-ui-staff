admin.controller('ADRulesRestrictionCtrl', [
    '$scope',
    '$state',
    'ADRulesRestrictionSrv',
    function($scope, $state, ADRulesRestrictionSrv) {

        $scope.init = function(){
            BaseCtrl.call(this, $scope);
            $scope.ruleList = {};
        }

        $scope.init();

        /**
        * To fetch hotel likes
        */
        $scope.fetchRestrictions = function() {
            var fetchHotelLikesSuccessCallback = function(data) {
                $scope.$emit('hideLoader');

                // gotta preprocess the recived data
                // order as sys-defs then editable
                var results = data.results,
                sysDef = [],
                editable = [];

                for (var i = 0, j = results.length; i < j; i++) {
                    if ( results[i]['editable'] ) {
                        editable.push( results[i] ); 
                    } else {
                        sysDef.push( results[i] );
                    }
                };

                results = sysDef.concat( editable );


                $scope.ruleList = results;
                $scope.total = data.total_count;
            };

            $scope.invokeApi(ADRulesRestrictionSrv.fetchRestrictions, {}, fetchHotelLikesSuccessCallback);
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

        $scope.getTemplateUrl = function() {
            
            if ( !this.item ) {
                return;
            };

            // if this is sysdef return
            if ( !this.item.editable || this.item.description === 'Levels' ) {
                return;
            };

            if ( this.item.description === 'Cancellation Penalties' ) {
                return '/assets/partials/rates/adCancellationPenaltiesRules.html';
            };

            if ( this.item.description === 'Deposit Requested' ) {
                return '/assets/partials/rates/adDepositRequestRules.html';
            };
        };

        // fetch rules under editable restrictions
        $scope.fetchRuleList = function(item) {

            // if this is sysdef return
            if ( !item.editable || item.description === 'Levels' ) {
                return;
            };

            var ruleType = item.description === 'Cancellation Penalties' ? 'CANCELLATION_POLICY' :
                             item.description === 'Deposit Requested' ? 'DEPOSIT_REQUEST' : '';

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


        $scope.openAddNewRule = function() {
            $scope.rulesTitle = 'New';

            // identify the restriction
            if ( this.item.description === 'Cancellation Penalties' ) {
                $scope.showCancelForm = true;
                $scope.showDepositForm = false;

                $scope.rulesSubtitle = 'Cancellation Penalties Rule';

                $scope.singleRule = {};
                $scope.singleRule.policy_type = 'CANCELLATION_POLICY';
            }

            if ( this.item.description === 'Deposit Requested' ) {
                $scope.showCancelForm = false;
                $scope.showDepositForm = true;

                $scope.rulesSubtitle = 'Deposit Requested Rule';

                $scope.singleRule = {};
                $scope.singleRule.policy_type = 'DEPOSIT_REQUEST';
            }
        };

        $scope.editSingleRule = function(rule, from) {
            var rule = rule,
                from = from;

            var callback = function(data) {
                
                // clear any previous data
                $scope.singleRule = {};

                if ( from === 'Cancellation Penalties' ) {
                    $scope.singleRule = data;
                    $scope.singleRule.policy_type = 'CANCELLATION_POLICY';

                    $scope.showCancelForm = true;
                    $scope.showDepositForm = false;
                }

                if ( from === 'Deposit Requested' ) {
                    $scope.singleRule = data;
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

        $scope.saveUpdateRule = function(from) {
            var from = from,
                saveCallback,
                updateCallback;

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

                    if ( from === 'Deposit Requested' ) {
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

                    if ( from === 'Deposit Requested' ) {
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

                if ( from === 'Deposit Requested' ) {
                    var withoutThis = _.without( $scope.depositRuleslList, rule );
                    $scope.depositRuleslList = withoutThis;
                }

                $scope.$emit('hideLoader');
            };

            $scope.invokeApi(ADRulesRestrictionSrv.deleteRule, { id: rule.id }, callback);
        };
    }
]);	