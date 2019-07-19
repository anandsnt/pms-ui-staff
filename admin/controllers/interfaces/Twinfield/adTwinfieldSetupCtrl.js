admin.controller('adTwinfieldSetupCtrl', [
    '$scope', 'twinfieldSetupValues', 'adInterfacesSrv', 'paymentChargeCodes', 'adTwinfieldSetupSrv', '$window',
    function($scope, twinfieldSetupValues, adInterfacesSrv, paymentChargeCodes, adTwinfieldSetupSrv, $window) {
        BaseCtrl.call(this, $scope);

        $scope.interface = 'TWINFIELD';

        $scope.state = {
            activeTab: 'SETUP'
        };

        /**
         * when clicked on check box to enable/diable GoMomentIvy
         * @return {undefined}
         */
        $scope.toggleEnabled = function() {
            $scope.config.enabled = !$scope.config.enabled;
        };

        /**
         *
         * @return {undefined}
         * @param {name} name of tab that was clicked
         */
        $scope.changeTab = function(name) {
            $scope.state.activeTab = name;
        };

        /**
         * when we clicked on save button
         * @return {undefined}
         */
        $scope.saveSetup = function() {
            $scope.config.credit_card_payment_charge_codes = _.pluck($scope.meta.selected_charge_codes, 'charge_code').
                join(',');
            $scope.callAPI(adInterfacesSrv.updateSettings, {
                params: {
                    settingss: _.omit($scope.config, ['historical_data_sync_items', 'is_authorized']),
                    integration: $scope.interface.toLowerCase()
                },
                onSuccess: function() {
                    $scope.errorMessage = '';
                    $scope.successMessage = 'SUCCESS: Settings updated!';
                }
            });
        };


        /**
         * Method to fetch the authorize API
         * @returns {undefined}
         */
        $scope.authorize = function() {
            $scope.callAPI(adTwinfieldSetupSrv.getAuthorizationURI, {
                successCallBack: function(data) {
                    $window.location.href = data.redirect_url;
                }
            });
        };


        /**
         * Method to segregate the list of charge codes to selected and available groups
         * @param {string} selectedPayments string returned
         * @returns {undefined}
         */
        function initiateChargeCodesSelection(selectedPayments) {
            selectedPayments = selectedPayments.split(',');

            var selectedObjects = _.filter(paymentChargeCodes.data.charge_codes,
                function(chargeCode) {return selectedPayments.indexOf(chargeCode.charge_code) > -1;});

            $scope.meta = {
                available_charge_codes: _.difference(paymentChargeCodes.data.charge_codes, selectedObjects),
                selected_charge_codes: selectedObjects
            };
        }

        /**
         * Initialization stuffs
         * @return {undefined}
         */
        (function() {
            var disabledKeys = ['access_token', 'refresh_token', 'credit_card_payment_charge_codes'];

            // default to empty string to mitigate null
            initiateChargeCodesSelection(twinfieldSetupValues['credit_card_payment_charge_codes'] || '');
            $scope.config = _.omit(twinfieldSetupValues, disabledKeys);
        })();
    }]);
