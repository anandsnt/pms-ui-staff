angular.module('admin').controller('adIdeasSetupCtrl', ['$scope', '$rootScope', 'config', 'adInterfacesSrv', 'chargeGroups',
    function ($scope, $rootScope, config, adInterfacesSrv, chargeGroups) {
        BaseCtrl.call(this, $scope);

        $scope.interface = 'ideas';

        $scope.sync = {
            start_date: null,
            end_date: null
        };

        $scope.state = {
            activeTab: 'SETTING'
        };

        var syncItems = ['reservation', 'rate', 'group', 'statistics', 'inventory'];

        $scope.realTimeDataSyncItems = syncItems;
        $scope.historicalDataSyncItems = syncItems;

        $scope.toggleEnabled = function () {
            config.enabled = !config.enabled;
        };

        var resetChosenChargeGroups = function () {
            $scope.chosenSelectedChargeGroups = [];
            $scope.chosenAvailableChargeGroups = [];
        };

        $scope.chosenSelectedChargeGroups = [];
        $scope.chosenAvailableChargeGroups = [];

        /**
         * Toggle chosen Charge Groups in selected column
         * @param {Integer} chargeGroupIndex chargeGroup selected
         * @returns {undefined}
         */
        $scope.chooseSelectedChargeGroup = function (chargeGroupIndex) {
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
        $scope.chooseAvailableChargeGroup = function (chargeGroupIndex) {
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
        $scope.onSelectChargeGroup = function () {
            resetChosenChargeGroups();
        };

        /**
         * * Handle a un-selection event
         * @returns {undefined}
         */
        $scope.onUnSelectChargeGroup = function () {
            resetChosenChargeGroups();
        };

        /**
         * Method to move chosen Charge Groups from available column to the selected column
         * @returns {undefined}
         */
        $scope.selectChosen = function () {
            var chosenAvailableChargeGroupValues = [];

            _.each($scope.chosenAvailableChargeGroups, function (chargeGroupIndex) {
                chosenAvailableChargeGroupValues.push($scope.config.available_charge_groups[chargeGroupIndex]);
            });
            $scope.config.selected_charge_groups = $scope.config.selected_charge_groups.concat(chosenAvailableChargeGroupValues);
            $scope.config.available_charge_groups = _.difference($scope.config.available_charge_groups, chosenAvailableChargeGroupValues);

            resetChosenChargeGroups();
        };

        /**
         * Method to move chosen Charge Groups from selected column to the available column
         * @returns {undefined}
         */
        $scope.unSelectChosen = function () {
            var chosenSelectedChargeGroupValues = [];

            _.each($scope.chosenSelectedChargeGroups, function (chargeGroupIndex) {
                chosenSelectedChargeGroupValues.push($scope.config.selected_charge_groups[chargeGroupIndex]);
            });
            $scope.config.available_charge_groups = $scope.config.available_charge_groups.concat(chosenSelectedChargeGroupValues);
            $scope.config.selected_charge_groups = _.difference($scope.config.selected_charge_groups, chosenSelectedChargeGroupValues);

            resetChosenChargeGroups();
        };

        /**
         * Move all Charge Groups to the selected column
         * @returns {undefined}
         */
        $scope.selectAll = function () {
            $scope.config.selected_charge_groups = $scope.config.selected_charge_groups.concat($scope.config.available_charge_groups);
            $scope.config.available_charge_groups = [];
            resetChosenChargeGroups();
        };

        /**
         * Move all Charge Groups to the available column
         * @returns {undefined}
         */
        $scope.unSelectAll = function () {
            $scope.config.available_charge_groups = $scope.config.available_charge_groups.concat($scope.config.selected_charge_groups);
            $scope.config.selected_charge_groups = [];
            resetChosenChargeGroups();
        };


        /**
         * Toggle chosen chosen charge codes in the available column
         * @param {Integer} chargeGroupIndex chargeGroup selected
         * @returns {undefined}
         */
        $scope.chooseAvailableChargeCode = function (chargeGroupIndex) {
            if ($scope.chosenAvailableChargeCodes.indexOf(chargeGroupIndex) > -1) {
                $scope.chosenAvailableChargeCodes = _.without($scope.chosenAvailableChargeCodes, chargeGroupIndex);
            } else {
                $scope.chosenAvailableChargeCodes.push(chargeGroupIndex);
            }
        };

        /**
         * when button clicked to switch between mappings/settings
         * @return {undefined}
         * @param {name} name tab name to toggle.
         */
        $scope.changeTab = function (name) {
            $scope.state.activeTab = name;
        };

        $scope.saveSetup = function () {
            $scope.callAPI(adInterfacesSrv.updateSettings, {
                params: {
                    settings: $scope.config,
                    integration: $scope.interface.toLowerCase()
                },
                onSuccess: function () {
                    $scope.errorMessage = '';
                    $scope.successMessage = 'SUCCESS: Settings updated!';
                }
            });
        };

        (function () {
            //init
            $scope.config = config;

            // selected_charge_groups must be an array
            var selectedChargeGroups = (config.selected_charge_groups === undefined) ?
                [] :
                JSON.parse(config.selected_charge_groups);
            $scope.config.selected_charge_groups = selectedChargeGroups;

            //available_charge_groups are charge groups that available to select.
            var allChargeGroups = _.pluck(chargeGroups.charge_groups, 'name');
            $scope.config.available_charge_groups = _.difference(allChargeGroups, selectedChargeGroups);

            // days_past must be a number
            if (config.days_past !== undefined) {
                $scope.config.days_past = parseInt(config.days_past);
            }

            // days_future must be a number
            if (config.days_future !== undefined) {
                $scope.config.days_future = parseInt(config.days_future);
            }

            // enabled must be boolean.
            if (config.enabled === undefined) {
                $scope.config.enabled = false;
            }

            // g3_enabled must be boolean.
            if (config.g3_enabled === undefined) {
                $scope.config.g3_enabled = false;
            }

        })();
    }
]);
