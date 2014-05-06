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
        $scope.fetchRulesRestrictions = function() {
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

            $scope.invokeApi(ADRulesRestrictionSrv.fetch, {}, fetchHotelLikesSuccessCallback);
        };

        $scope.fetchRulesRestrictions();

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

        // editRestriction
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

            // hide list views all before fetch
            $scope.showCancelPolicy = false;
            $scope.showDepositPolicy = false;

            // fetch the appropriate policy
            var callback = function(data) {

                if ( ruleType === 'CANCELLATION_POLICY' ) {
                    $scope.cancelRulesList = data.results;
                    $scope.showCancelPolicy = true;
                    $scope.showDepositPolicy = false;

                    $scope.editCancelRules = false;
                    $scope.editDepositRules = false;
                };

                if ( ruleType === 'DEPOSIT_REQUEST' ) {
                    $scope.depositRuleslList = data.results;
                    $scope.showCancelPolicy = false;
                    $scope.showDepositPolicy = true;

                    $scope.editCancelRules = false;
                    $scope.editDepositRules = false;
                };

                $scope.$emit('hideLoader');
            };

            $scope.invokeApi(ADRulesRestrictionSrv.fetchPolicy, { policy_type: ruleType }, callback);
        };


        $scope.openAddNewRule = function() {

            $scope.rulesTitle = 'New';

            // identify the restriction
            if ( this.item.description === 'Cancellation Penalties' ) {
                $scope.editCancelRules = true;
                $scope.editDepositRules = false;

                $scope.rulesSubtitle = 'Cancellation Penalties Rule';

                $scope.singleRule = {};
                $scope.singleRule.policy_type = 'CANCELLATION_POLICY';
            }

            if ( this.item.description === 'Deposit Requested' ) {
                $scope.editCancelRules = false;
                $scope.editDepositRules = true;

                $scope.rulesSubtitle = 'Deposit Requested Rule';

                $scope.singleRule = {};
                $scope.singleRule.policy_type = 'DEPOSIT_REQUEST';
            }
        };

        $scope.cancelCliked = function() {
            $scope.editCancelRules = false;
            $scope.editDepositRules = false;
        };

        $scope.addNewRule = function(from) {
            var from = from;

            var callback = function(data) {
                if ( from === 'Cancellation Penalties' ) {
                    $scope.fetchRuleList({
                        editable: true,
                        description: from
                    });
                    $scope.editCancelRules = false;
                }

                if ( from === 'Deposit Requested' ) {
                    $scope.fetchRuleList({
                        editable: true,
                        description: from
                    });
                    $scope.editDepositRules = false;
                }

                $scope.$emit('hideLoader');
            };

            $scope.invokeApi(ADRulesRestrictionSrv.postPolicy, $scope.singleRule, callback);
        };

        $scope.deleteRule = function(rule, from) {

            // keep them in local context of deleteRule function as
            // we dont know when callback will be called, so..
            // didnt understand? contact someone who can; dont remove
            var rule = rule,
                from = from;

            var callback = function() {
                if ( from === 'Cancellation Penalties' ) {
                    cancelRulesList
                }

                if ( from === 'Deposit Requested' ) {
                    
                }

                $scope.$emit('hideLoader');
            };
        };

    }
]);	