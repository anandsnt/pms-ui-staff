angular.module('admin').
    controller('multiSelectDragDropCtrl', [
        '$scope', function($scope) {

            BaseCtrl.call(this, $scope);

            var reset = function() {
                $scope.chosenSelected = [];
                $scope.chosenAvailable = [];
            };

            $scope.chosenSelected = [];
            $scope.chosenAvailable = [];

            /**
             * Toggle chosen Charge Groups in selected column
             * @param {Integer} chargeGroupIndex chargeGroup selected
             * @returns {undefined}
             */
            $scope.chooseSelected = function(chargeGroupIndex) {
                if ($scope.chosenSelected.indexOf(chargeGroupIndex) > -1) {
                    $scope.chosenSelected = _.without($scope.chosenSelected, chargeGroupIndex);
                } else {
                    $scope.chosenSelected.push(chargeGroupIndex);
                }
            };

            /**
             * Toggle chosen Charge Groups in the available column
             * @param {Integer} chargeGroupIndex chargeGroup selected
             * @returns {undefined}
             */
            $scope.chooseAvailable = function(chargeGroupIndex) {
                if ($scope.chosenAvailable.indexOf(chargeGroupIndex) > -1) {
                    $scope.chosenAvailable = _.without($scope.chosenAvailable, chargeGroupIndex);
                } else {
                    $scope.chosenAvailable.push(chargeGroupIndex);
                }
            };

            /**
             * Handle a selection event
             * @returns {undefined}
             */
            $scope.onSelect = function() {
                reset();
            };

            /**
             * * Handle a un-selection event
             * @returns {undefined}
             */
            $scope.onUnSelect = function() {
                reset();
            };

            /**
             * Method to move chosen Charge Groups from available column to the selected column
             * @returns {undefined}
             */
            $scope.selectChosen = function() {
                var chosenAvailableChargeGroupValues = [];

                _.each($scope.chosenAvailable, function(chargeGroupIndex) {
                    chosenAvailableChargeGroupValues.push($scope.available[chargeGroupIndex]);
                });
                $scope.selected = $scope.selected.concat(chosenAvailableChargeGroupValues);
                $scope.available = _.difference($scope.available, chosenAvailableChargeGroupValues);

                reset();
            };

            /**
             * Method to move chosen Charge Groups from selected column to the available column
             * @returns {undefined}
             */
            $scope.unSelectChosen = function() {
                var chosenSelectedChargeGroupValues = [];

                _.each($scope.chosenSelected, function(chargeGroupIndex) {
                    chosenSelectedChargeGroupValues.push($scope.selected[chargeGroupIndex]);
                });
                $scope.available = $scope.available.concat(chosenSelectedChargeGroupValues);
                $scope.selected = _.difference($scope.selected, chosenSelectedChargeGroupValues);

                reset();
            };

            /**
             * Move all Charge Groups to the selected column
             * @returns {undefined}
             */
            $scope.selectAll = function() {
                $scope.selected = $scope.selected.concat($scope.available);
                $scope.available = [];
                reset();
            };

            /**
             * Move all Charge Groups to the available column
             * @returns {undefined}
             */
            $scope.unSelectAll = function() {
                $scope.available = $scope.available.concat($scope.selected);
                $scope.selected = [];
                reset();
            };
        }]);
