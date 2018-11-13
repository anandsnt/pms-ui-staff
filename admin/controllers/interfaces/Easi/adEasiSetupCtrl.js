angular.module('admin').controller('adEasiCtrl',
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
            /*
             * Changed tax exempt
             * Update other tax fields
             */
            $scope.changedTaxExempt = function() {
                var taxExemptsToBeRemovedForOne = [],
                    taxExemptsToBeRemovedForTwo = [],
                    taxExemptsToBeRemovedForThree = [],
                    taxExemptOne = _.findWhere(taxChargeCodes.data.charge_codes, {"id": $scope.config.tax1_charge_code_id}),
                    taxExemptTwo = _.findWhere(taxChargeCodes.data.charge_codes, {"id": $scope.config.tax2_charge_code_id}),
                    taxExemptThree = _.findWhere(taxChargeCodes.data.charge_codes, {"id": $scope.config.tax3_charge_code_id});

                taxExemptsToBeRemovedForOne.push(taxExemptTwo);
                taxExemptsToBeRemovedForOne.push(taxExemptThree);
                taxExemptsToBeRemovedForTwo.push(taxExemptOne);
                taxExemptsToBeRemovedForTwo.push(taxExemptThree);
                taxExemptsToBeRemovedForThree.push(taxExemptOne);
                taxExemptsToBeRemovedForThree.push(taxExemptTwo);
                $scope.availableTaxChargeCodesForTaxExemptOne = _.difference(taxChargeCodes.data.charge_codes, taxExemptsToBeRemovedForOne);
                $scope.availableTaxChargeCodesForTaxExemptTwo = _.difference(taxChargeCodes.data.charge_codes, taxExemptsToBeRemovedForTwo);
                $scope.availableTaxChargeCodesForTaxExemptThree = _.difference(taxChargeCodes.data.charge_codes, taxExemptsToBeRemovedForThree);
            };

        }
    ]);
