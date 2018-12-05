angular.module('admin').
    controller('multiSelectDragDropCtrl', [
        '$scope', function($scope) {

            BaseCtrl.call(this, $scope);

            var resetChosenChargeGroups = function() {
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
                    chosenAvailableChargeGroupValues.push($scope.available[chargeGroupIndex]);
                });
                $scope.selected = $scope.selected.concat(chosenAvailableChargeGroupValues);
                $scope.available = _.difference($scope.available, chosenAvailableChargeGroupValues);

                resetChosenChargeGroups();
            };

            /**
             * Method to move chosen Charge Groups from selected column to the available column
             * @returns {undefined}
             */
            $scope.unSelectChosen = function() {
                var chosenSelectedChargeGroupValues = [];

                _.each($scope.chosenSelectedChargeGroups, function(chargeGroupIndex) {
                    chosenSelectedChargeGroupValues.push($scope.selected[chargeGroupIndex]);
                });
                $scope.available = $scope.available.concat(chosenSelectedChargeGroupValues);
                $scope.selected = _.difference($scope.selected, chosenSelectedChargeGroupValues);

                resetChosenChargeGroups();
            };

            /**
             * Move all Charge Groups to the selected column
             * @returns {undefined}
             */
            $scope.selectAll = function() {
                $scope.selected = $scope.selected.concat($scope.available);
                $scope.available = [];
                resetChosenChargeGroups();
            };

            /**
             * Move all Charge Groups to the available column
             * @returns {undefined}
             */
            $scope.unSelectAll = function() {
                $scope.available = $scope.available.concat($scope.selected);
                $scope.selected = [];
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
        }]);
