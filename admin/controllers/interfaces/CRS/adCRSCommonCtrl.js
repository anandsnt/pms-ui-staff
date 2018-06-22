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
    }
]);