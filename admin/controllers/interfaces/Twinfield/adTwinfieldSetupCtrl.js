admin.controller('adTwinfieldSetupCtrl', [
    '$scope', 'twinfieldSetupValues', 'adInterfacesCommonConfigSrv', 'paymentChargeCodes', 'adTwinfieldSetupSrv', '$window',
    function($scope, twinfieldSetupValues, adInterfacesCommonConfigSrv, paymentChargeCodes, adTwinfieldSetupSrv, $window) {
        BaseCtrl.call(this, $scope);

        $scope.interface = 'TWINFIELD';

        var resetChosenChargeGroups = function() {
            $scope.chosenSelectedChargeGroups = [];
            $scope.chosenAvailableChargeGroups = [];
        };

        $scope.chosenSelectedChargeGroups = [];
        $scope.chosenAvailableChargeGroups = [];

        /**
         * when clicked on check box to enable/diable GoMomentIvy
         * @return {undefined}
         */
        $scope.toggleEnabled = function() {
            $scope.config.enabled = !$scope.config.enabled;
        };

        /**
         * when the save is success
         * @return {undefined}
         */
        var successCallBackOfSave = function() {
            $scope.goBackToPreviousState();
        };

        /**
         * Toggle chosen Charge Groups in selected column
         * @param {Integer} chargeGroupIndex chargeGroup selected
         * @returns {undefined}
         */
        $scope.chooseSelectedChargeGroup = function(chargeGroupIndex) {
            if ($scope.chosenSelectedChargeGroups.indexOf(chargeGroupIndex) > -1) {
                $scope.chosenSelectedChargeGroups = _.without($scope.chosenSelectedChargeGroups, chargeGroupIndex);
            } else {
                $scope.chosenSelectedChargeGroups.push(chargeGroupIndex);
            }
        };

        /**
         * Toggle chosen Charge Groups in the available column
         * @param {Integer} chargeGroupIndex chargeGroup selected
         * @returns {undefined}
         */
        $scope.chooseAvailableChargeGroup = function(chargeGroupIndex) {
            if ($scope.chosenAvailableChargeGroups.indexOf(chargeGroupIndex) > -1) {
                $scope.chosenAvailableChargeGroups = _.without($scope.chosenAvailableChargeGroups, chargeGroupIndex);
            } else {
                $scope.chosenAvailableChargeGroups.push(chargeGroupIndex);
            }
        };

        /**
         * Handle a selection event
         * @returns {undefined}
         */
        $scope.onSelectChargeGroup = function() {
            resetChosenChargeGroups();
        };

        /**
         * * Handle a un-selection event
         * @returns {undefined}
         */
        $scope.onUnSelectChargeGroup = function() {
            resetChosenChargeGroups();
        };

        /**
         * Method to move chosen Charge Groups from available column to the selected column
         * @returns {undefined}
         */
        $scope.selectChosen = function() {
            var chosenAvailableChargeGroupValues = [];

            _.each($scope.chosenAvailableChargeGroups, function(chargeGroupIndex) {
                chosenAvailableChargeGroupValues.push($scope.meta.available_charge_groups[chargeGroupIndex]);
            });
            $scope.meta.selected_charge_groups = $scope.meta.selected_charge_groups.concat(chosenAvailableChargeGroupValues);
            $scope.meta.available_charge_groups = _.difference($scope.meta.available_charge_groups, chosenAvailableChargeGroupValues);

            resetChosenChargeGroups();
        };

        /**
         * Method to move chosen Charge Groups from selected column to the available column
         * @returns {undefined}
         */
        $scope.unSelectChosen = function() {
            var chosenSelectedChargeGroupValues = [];

            _.each($scope.chosenSelectedChargeGroups, function(chargeGroupIndex) {
                chosenSelectedChargeGroupValues.push($scope.meta.selected_charge_groups[chargeGroupIndex]);
            });
            $scope.meta.available_charge_groups = $scope.meta.available_charge_groups.concat(chosenSelectedChargeGroupValues);
            $scope.meta.selected_charge_groups = _.difference($scope.meta.selected_charge_groups, chosenSelectedChargeGroupValues);

            resetChosenChargeGroups();
        };

        /**
         * Move all Charge Groups to the selected column
         * @returns {undefined}
         */
        $scope.selectAll = function() {
            $scope.meta.selected_charge_groups = $scope.meta.selected_charge_groups.concat($scope.meta.available_charge_groups);
            $scope.meta.available_charge_groups = [];
            resetChosenChargeGroups();
        };

        /**
         * Move all Charge Groups to the available column
         * @returns {undefined}
         */
        $scope.unSelectAll = function() {
            $scope.meta.available_charge_groups = $scope.meta.available_charge_groups.concat($scope.meta.selected_charge_groups);
            $scope.meta.selected_charge_groups = [];
            resetChosenChargeGroups();
        };


        /**
         * Toggle chosen chosen charge codes in the available column
         * @param {Integer} chargeGroupIndex chargeGroup selected
         * @returns {undefined}
         */
        $scope.chooseAvailableChargeCode = function(chargeGroupIndex) {
            if ($scope.chosenAvailableChargeCodes.indexOf(chargeGroupIndex) > -1) {
                $scope.chosenAvailableChargeCodes = _.without($scope.chosenAvailableChargeCodes, chargeGroupIndex);
            } else {
                $scope.chosenAvailableChargeCodes.push(chargeGroupIndex);
            }
        };

        /**
         * when we clicked on save button
         * @return {undefined}
         */
        $scope.saveSetup = function() {
            $scope.config.credit_card_payment_charge_codes = _.pluck($scope.meta.selected_charge_groups, 'charge_code').
                join(',');
            $scope.callAPI(adInterfacesCommonConfigSrv.saveConfiguration, {
                params: {
                    config: _.omit($scope.config, ['historical_data_sync_items', 'is_authorized']),
                    interfaceIdentifier: $scope.interface
                },
                successCallBack: successCallBackOfSave
            });
        };


        $scope.authorize = function() {
            $scope.callAPI(adTwinfieldSetupSrv.getAuthorizationURI, {
                successCallBack: function(data) {
                    $window.location.href = data.redirect_url;
                }
            });
        };


        function initiateChargeCodesSelection(selectedPayments) {
            selectedPayments = selectedPayments.split(',');

            var selectedObjects = _.filter(paymentChargeCodes.data.charge_codes,
                function(chargeCode) {return selectedPayments.indexOf(chargeCode.charge_code) > -1;});

            $scope.meta = {
                available_charge_groups: _.difference(paymentChargeCodes.data.charge_codes, selectedObjects),
                selected_charge_groups: selectedObjects
            };
        }

        /**
         * Initialization stuffs
         * @return {undefined}
         */
        (function() {
            let disabledKeys = ['access_token', 'refresh_token', 'credit_card_payment_charge_codes'];

            // default to empty string to mitigate null
            initiateChargeCodesSelection(twinfieldSetupValues['credit_card_payment_charge_codes'] || '');
            $scope.config = _.omit(twinfieldSetupValues, disabledKeys);
        })();
    }]);
