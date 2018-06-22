angular.module('admin').controller('adCRSCommonCtrl', 
    ['$scope', 
    '$rootScope', 
    'config', 
    'adInterfacesCommonConfigSrv', 
    'dateFilter', 
    '$stateParams',
    'chargeGroups',
    'taxChargeCodes',
    function($scope, $rootScope, config, adInterfacesCommonConfigSrv, dateFilter, $stateParams, chargeGroups, taxChargeCodes) {

        var interfaceIdentifier = $stateParams.id;

        var resetChosenChargeCode = function() {
            $scope.chosenAvailableChargeCodes = [];
            $scope.chosenSelectedChargecodes = [];
        };

        $scope.toggleEnabled = function() {
            config.enabled = !config.enabled;
        };

        $scope.saveInterfaceConfig = function() {
            $scope.config.selected_tax_charge_ids = [];
            angular.forEach($scope.emailDatas, function(item, index) {
                $scope.config.selected_tax_charge_ids.push(item.id)
            });
            var unwantedKeys = ["availableTaxChargeCodes", "selectedTaxChargeCodes"];
                
            $scope.config = dclone($scope.config, unwantedKeys);

            $scope.callAPI(adInterfacesCommonConfigSrv.saveConfiguration, {
                params: {
                    config: $scope.config,
                    interfaceIdentifier: interfaceIdentifier
                },
                onSuccess: function() {
                    $scope.goBackToPreviousState();
                }
            });
        };


        /**
         * Handle a selection event
         */
        $scope.onSelectReport = function() {
            resetChosenReports();
        };

        /**
         * * Handle a un-selection event
         */
        $scope.onUnSelectChargeCode = function() {
            resetChosenChargeCode();
        };

        /**
         * Toggle chosen reports in the available column
         * @param reportIndex
         */
        $scope.chooseAvailableChargeCode = function(index) {
            if ($scope.chosenAvailableChargeCodes.indexOf(index) > -1) {
                $scope.chosenAvailableChargeCodes = _.without($scope.chosenAvailableReports, index);
            } else {
                $scope.chosenAvailableChargeCodes.push(index);
            }
        };
        /**
         * Toggle chosen reports in selected column
         * @param reportIndex
         */
        $scope.chooseSelectedChargeCode = function(index) {
            if ($scope.chosenSelectedChargecodes.indexOf(index) > -1) {
                $scope.chosenSelectedChargecodes = _.without($scope.chosenSelectedChargecodes, index);
            } else {
                $scope.chosenSelectedChargecodes.push(index);
            }

        };

        (function() {
            //    init
            var onFetchMetaSuccess = function(response) {
                $scope.rates = response.rates;
                $scope.bookingOrigins = response.bookingOrigins;
                $scope.paymentMethods = response.paymentMethods;
                $scope.roomTypes = response.roomTypes;
            };

            $scope.callAPI(adInterfacesCommonConfigSrv.fetchOptionsList, {
                onSuccess: onFetchMetaSuccess
            });

            $scope.config = config;
            $scope.availableSettings = _.keys(config);
            $scope.interface = interfaceIdentifier.toUpperCase();
            $scope.chargeGroups = chargeGroups.data.charge_groups;
            $scope.config.availableTaxChargeCodes = taxChargeCodes.data.charge_codes;
            $scope.config.selectedTaxChargeCodes = [];
            angular.forEach($scope.config.availableTaxChargeCodes, function(item, index) {
                if (_.indexOf(taxChargeCodes.data.selected_tax_charge_ids, item.id)) {
                    $scope.config.selectedTaxChargeCodes.push(item);
                }
            });
        })();
    }
]);
