admin.controller('adIgelCtrl', ['$scope', 'config', 'paymentChargeCodes', 'adInterfacesSrv', 'mappingTypes',
    function($scope, config, paymentChargeCodes, adInterfacesSrv, mappingTypes) {
        BaseCtrl.call(this, $scope);

        $scope.interface = 'IGEL';

        $scope.state = {
            activeTab: 'SETTING'
        };

        $scope.toggleEnabled = function() {
            $scope.config.enabled = !$scope.config.enabled;
        };

        $scope.mappingTypes = ['charge_code', 'payment_code_billing_account'];

        /**
         *
         * @return {undefined}
         */
        $scope.changeTab = function(name) {
            $scope.state.activeTab = name;
        };

        /**
         * when we clicked on save button
         * @return {undefined}
         */
        $scope.saveSetup = function() {
            $scope.config.credit_card_payment_charge_codes = _.pluck($scope.meta.selected_charge_codes, 'charge_code').join(',');
            $scope.callAPI(adInterfacesSrv.updateSettings, {
                params: {
                    settings: $scope.config,
                    integration: $scope.interface.toLowerCase()
                },
                onSuccess: function() {
                    $scope.errorMessage = '';
                    $scope.successMessage = 'SUCCESS: Settings updated!';
                }
            });
        };

        (function() {
            $scope.config = config;
            $scope.journalExportOptions = [
              {
                name: "Daily",
                value: "DAILY"
              },
              {
                name: "Monthly",
                value: "MONTHLY"
              }
            ];
        })();

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
            // default to empty string to mitigate null
            initiateChargeCodesSelection(config['credit_card_payment_charge_codes'] || '');
        })();
    }
]);
