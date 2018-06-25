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
            config.enabled = (config.enabled !== null) ? config.enabled : false;
            $scope.config = config;
            $scope.availableSettings = _.keys(config);
            $scope.interface = interfaceIdentifier.toUpperCase();
            $scope.chargeGroups = chargeGroups.data.charge_groups;
            $scope.availableTaxChargeCodesForTaxExemptOne = $scope.availableTaxChargeCodesForTaxExemptTwo = $scope.availableTaxChargeCodesForTaxExemptThree = taxChargeCodes.data.charge_codes;
        })();

        $scope.changedTaxExemptOne = function(value) {
            var taxExemptOne = _.findWhere(taxChargeCodes.data.charge_codes, {"id": $scope.config.tax1_charge_code_id}),
                taxExemptTwo = _.findWhere(taxChargeCodes.data.charge_codes, {"id": $scope.config.tax2_charge_code_id})
                taxExemptThree = _.findWhere(taxChargeCodes.data.charge_codes, {"id": $scope.config.tax3_charge_code_id});
            switch (value) {
                case "one":
                    var taxExemptsToBeRemoved = [];

                    taxExemptsToBeRemoved.push(taxExemptTwo);
                    taxExemptsToBeRemoved.push(taxExemptThree);
                    break;
                case "two":
                    lowBound = parseInt(input[0]);
                    highBound = parseInt(input[1]);
                    break;
                case "three":
                    lowBound = parseInt(input[0]);
                    highBound = parseInt(input[1]);
                    step = parseInt(input[2]);
                    break;
            }
            
            $scope.availableTaxChargeCodesForTaxExemptTwo = _.difference(taxChargeCodes.data.charge_codes, taxExemptsToBeRemoved);

        }

        $scope.changedTaxExemptTwo = function() {
            var taxExemptsToBeRemoved = [],
                taxExemptOne = _.findWhere(taxChargeCodes.data.charge_codes, {"id": $scope.config.tax2_charge_code_id}),
                taxExemptThree = _.findWhere(taxChargeCodes.data.charge_codes, {"id": $scope.config.tax3_charge_code_id});

            taxExemptsToBeRemoved.push(taxExemptOne);
            taxExemptsToBeRemoved.push(taxExemptThree);
            $scope.availableTaxChargeCodesForTaxExemptTwo = _.difference(taxChargeCodes.data.charge_codes, taxExemptsToBeRemoved);

        }
    }
]);