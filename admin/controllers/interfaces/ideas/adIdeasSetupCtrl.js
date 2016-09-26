admin.controller('adIdeasSetupCtrl', ['$scope', '$rootScope', 'ideaSetup', 'adIdeasSetupSrv', 'dateFilter',
    function($scope, $rootScope, ideaSetup, adIdeasSetupSrv, dateFilter) {
        BaseCtrl.call(this, $scope);

        $scope.chosenSelectedChargeGroups = [];
        $scope.chosenAvailableChargeGroups = [];

        var resetChosenChargeGroups = function() {
            $scope.chosenSelectedChargeGroups = [];
            $scope.chosenAvailableChargeGroups = [];
        };

        /**
         * Toggle chosen Charge Groups in selected column
         * @param chargeGroupIndex
         */
        $scope.chooseSelectedChargeGroup = function(chargeGroupIndex) {
            if ($scope.chosenSelectedChargeGroups.indexOf(chargeGroupIndex) > -1) {
                $scope.chosenSelectedChargeGroups = _.without($scope.chosenSelectedChargeGroups, chargeGroupIndex)
            } else {
                $scope.chosenSelectedChargeGroups.push(chargeGroupIndex);
            }
        };

        /**
         * Toggle chosen Charge Groups in the available column
         * @param chargeGroupIndex
         */
        $scope.chooseAvailableChargeGroup = function(chargeGroupIndex) {
            if ($scope.chosenAvailableChargeGroups.indexOf(chargeGroupIndex) > -1) {
                $scope.chosenAvailableChargeGroups = _.without($scope.chosenAvailableChargeGroups, chargeGroupIndex)
            } else {
                $scope.chosenAvailableChargeGroups.push(chargeGroupIndex);
            }
        };

        /**
         * Handle a selection event
         */
        $scope.onSelectChargeGroup = function() {
            resetChosenChargeGroups();
        };

        /**
         * * Handle a un-selection event
         */
        $scope.onUnSelectChargeGroup = function() {
            resetChosenChargeGroups();
        };

        /**
         * Method to move chosen Charge Groups from available column to the selected column
         */
        $scope.selectChosen = function() {
            var chosenAvailableChargeGroupValues = [];
            _.each($scope.chosenAvailableChargeGroups, function(chargeGroupIndex) {
                chosenAvailableChargeGroupValues.push($scope.ideaSetup.available_charge_groups[chargeGroupIndex]);
            });
            $scope.ideaSetup.selected_charge_groups = $scope.ideaSetup.selected_charge_groups.concat(chosenAvailableChargeGroupValues);
            $scope.ideaSetup.available_charge_groups = _.difference($scope.ideaSetup.available_charge_groups, chosenAvailableChargeGroupValues);

            resetChosenChargeGroups();
        };

        /**
         * Method to move chosen Charge Groups from selected column to the available column
         */
        $scope.unSelectChosen = function() {
            var chosenSelectedChargeGroupValues = [];
            _.each($scope.chosenSelectedChargeGroups, function(chargeGroupIndex) {
                chosenSelectedChargeGroupValues.push($scope.ideaSetup.selected_charge_groups[chargeGroupIndex]);
            });
            $scope.ideaSetup.available_charge_groups = $scope.ideaSetup.available_charge_groups.concat(chosenSelectedChargeGroupValues);
            $scope.ideaSetup.selected_charge_groups = _.difference($scope.ideaSetup.selected_charge_groups, chosenSelectedChargeGroupValues);

            resetChosenChargeGroups();
        };

        /**
         * Move all Charge Groups to the selected column
         */
        $scope.selectAll = function() {
            $scope.ideaSetup.selected_charge_groups = $scope.ideaSetup.selected_charge_groups.concat($scope.ideaSetup.available_charge_groups);
            $scope.ideaSetup.available_charge_groups = [];
            resetChosenChargeGroups();
        };

        /**
         * Move all Charge Groups to the available column
         */
        $scope.unSelectAll = function() {
            $scope.ideaSetup.available_charge_groups = $scope.ideaSetup.available_charge_groups.concat($scope.ideaSetup.selected_charge_groups);
            $scope.ideaSetup.selected_charge_groups = [];
            resetChosenChargeGroups();
        };


        /**
         * Toggle chosen chosen charge codes in the available column
         * @param chargeGroupIndex
         */
        $scope.chooseAvailableChargeCode = function(chargeGroupIndex) {
            if ($scope.chosenAvailableChargeCodes.indexOf(chargeGroupIndex) > -1) {
                $scope.chosenAvailableChargeCodes = _.without($scope.chosenAvailableChargeCodes, chargeGroupIndex)
            } else {
                $scope.chosenAvailableChargeCodes.push(chargeGroupIndex);
            }
        };

        //-------------------------------------------------------------------------------------------------------------- SCOPE VARIABLES
        // Date Picker Settings
        $scope.datepicker = {
            options: {
                dateFormat: getJqDateFormat(),
                numberOfMonths: 1,
                changeYear: true,
                changeMonth: true,
                beforeShow: function(input, inst) {
                    $('<div id="ui-datepicker-overlay">').insertAfter('#ui-datepicker-div');
                },
                onClose: function(value) {
                    $('#ui-datepicker-overlay').remove();
                },
                yearRange: "-1:+5"
            }
        }

        //-------------------------------------------------------------------------------------------------------------- SCOPE METHODS
        /**
         * Method to save setup
         * @return {[type]} [description]
         */
        $scope.saveSetup = function() {
            var params = angular.copy($scope.ideaSetup);
            // Convert date object to API format
            params.start_date = dateFilter(params.start_date, $rootScope.dateFormatForAPI);
            $scope.callAPI(adIdeasSetupSrv.postIdeasSetup, {
                params: params,
                onSuccess: function() {
                    // Navigate back to interfaces list on successful save
                    $scope.goBackToPreviousState();
                }
            })
        }

        //-------------------------------------------------------------------------------------------------------------- INIT
        var init = function() {
            $scope.ideaSetup = ideaSetup;
            // handle null in selected_charge_groups and available_charge_groups
            $scope.ideaSetup.selected_charge_groups = $scope.ideaSetup.selected_charge_groups || [];
            $scope.ideaSetup.available_charge_groups = $scope.ideaSetup.available_charge_groups || [];
        }();
    }
])