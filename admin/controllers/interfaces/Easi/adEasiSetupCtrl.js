angular.module('admin').controller('adEasiCtrl',
    ['$scope',
        '$rootScope',
        'config',
        'adInterfacesSrv',
        'adInterfacesCommonConfigSrv',
        'chargeGroups',
        'taxChargeCodes',
        function($scope, $rootScope, config, adInterfacesSrv, adInterfacesCommonConfigSrv, chargeGroups, taxChargeCodes) {
            BaseCtrl.call(this, $scope);

            $scope.interface = 'EASI';

            $scope.toggleEnabled = function() {
                config.enabled = !config.enabled;
            };

            $scope.changeTab = function (name) {
                $scope.state.activeTab = name;
            };

            $scope.state = {
                activeTab: "SETTING"
            };

            $scope.saveSetup = function () {
                var params = dclone($scope.config);

                $scope.deletePropertyIfRequired(params, 'sftp_password');

                $scope.callAPI(adInterfacesSrv.updateSettings, {
                    params: {
                        settings: params,
                        integration: $scope.interface.toLowerCase()
                    },
                    onSuccess: function () {
                        $scope.errorMessage = '';
                        $scope.successMessage = 'SUCCESS: Settings Updated!';
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
                $scope.chargeGroups = chargeGroups.data.charge_groups;
                $scope.availableTaxChargeCodesForTaxExemptOne = $scope.availableTaxChargeCodesForTaxExemptTwo = $scope.availableTaxChargeCodesForTaxExemptThree = taxChargeCodes.data.charge_codes;

                // ensure tax charge code id's are integers
                $scope.config.tax1_charge_code_id = parseInt(config.tax1_charge_code_id, 10);
                $scope.config.tax2_charge_code_id = parseInt(config.tax2_charge_code_id, 10);
                $scope.config.tax3_charge_code_id = parseInt(config.tax3_charge_code_id, 10);

                $scope.setDefaultDisplayPassword($scope.config, 'sftp_password');
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
