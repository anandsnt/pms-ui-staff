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

            // var unwantedKeys = ["availableTaxChargeCodes", "selectedTaxChargeCodes"];
                
            // $scope.config = dclone($scope.config, unwantedKeys);

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
            $scope.availableTaxChargeCodesForTaxExemptOne = $scope.availableTaxChargeCodesForTaxExemptTwo = $scope.availableTaxChargeCodesForTaxExemptThree = taxChargeCodes.data.charge_codes;

            // $scope.config.selectedTaxChargeCodes = [];
            // config.selected_tax_charge_ids = (config.selected_tax_charge_ids !== null) ? config.selected_tax_charge_ids : [];
            // angular.forEach($scope.config.availableTaxChargeCodes, function(item, index) {
            //     if (_.indexOf(config.selected_tax_charge_ids, item.id) !== -1) {
            //         $scope.config.selectedTaxChargeCodes.push(item);
            //         $scope.config.availableTaxChargeCodes.splice(item);
            //     }
            // });
        })();
    }
]);
