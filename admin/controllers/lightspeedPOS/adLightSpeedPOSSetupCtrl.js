angular.module('admin').controller('adLightSpeedPOSSetupCtrl',
    ['$scope', 'lightSpeedSetupValues', 'adLightSpeedPOSSetupSrv', '$timeout', '$log',
        function($scope, lightSpeedSetupValues, adLightSpeedPOSSetupSrv, $timeout, $log) {

            BaseCtrl.call(this, $scope);

            var successCallBackOfLightSpeedPOSSetup = function() {
                    $scope.goBackToPreviousState();
                },
                clearConfigValues = function() {
                    $scope.lightspeed.charge_code_id = '';
                    $scope.lightspeed.charge_code_name = '';
                },
                clearPaymentChargeCodeValues = function() {
                    $scope.lightspeed.payment_charge_code_id = '';
                    $scope.lightspeed.payment_charge_code_name = '';
                },
                refreshSettings = function(cb) {
                    $scope.callAPI(adLightSpeedPOSSetupSrv.fetchLightSpeedPOSConfiguration, {
                        successCallBack: function(settings) {
                            $scope.lightspeed = settings;
                            if (angular.isFunction(cb)) {
                                cb();
                            }
                        }
                    });
                };

            $scope.$on('showErrorMessage', function($event, errorMessage) {
                $event.stopPropagation();
                $scope.errorMessage = errorMessage;
            });

            $scope.toggleLightSpeedPOSEnabled = function() {
                $scope.lightspeed.enabled = !$scope.lightspeed.enabled;
            };

            $scope.toggleFloorEnabled = function() {
                 $scope.lightspeed.floors_enabled = !$scope.lightspeed.floors_enabled;
            };

            $scope.saveLightSpeedPOSSetup = function(cb) {
                var params = {
                    lightspeed: _.omit(dclone($scope.lightspeed), 'charge_code_name', 'payment_charge_code_name')
                };

                if (!$scope.lightspeed.enabled) {
                    params.lightspeed = _.pick(params.lightspeed, 'enabled');
                }

                if ($scope.lightspeed.enabled && params.lightspeed.charge_code_id === '') {
                    $timeout(function() {
                        $scope.errorMessage = ['Please search a default charge code, pick from the list and proceed'];
                        clearConfigValues();
                    }, 20);
                    return;
                }

                if ($scope.lightspeed.enabled && !params.lightspeed.payment_charge_code_id) {
                    $timeout(function() {
                        $scope.errorMessage = ['Please search a default payment code, pick from the list and proceed'];
                        clearPaymentChargeCodeValues();
                    }, 20);
                    return;
                }

                var options = {
                    params: params.lightspeed,
                    successCallBack: cb || successCallBackOfLightSpeedPOSSetup
                };

                $scope.callAPI(adLightSpeedPOSSetupSrv.saveLightSpeedPOSConfiguration, options);
            };

            $scope.onSave = function() {
                $scope.saveLightSpeedPOSSetup(function() {
                    refreshSettings($scope.onCancelAdd);
                });
            };

            $scope.toggleForm = function(mode) {
                if (mode === 'RESTAURANT') {
                    if (!$scope.companies) {
                        retrieveCompanies();
                    } else {
                        $scope.state.activeTab = mode;
                    }
                } else {
                    $scope.state.activeTab = mode;
                }
            };

            /**
             * ------------------ ------------------ ------------------ ------------------ ------------------ -------------
             * @return {undefined}
             * ------------------ ------------------ ------------------ ------------------ ------------------ -------------
             */
            function retrieveCompanies() {
                $scope.callAPI(adLightSpeedPOSSetupSrv.getCompaniesList, {
                    successCallBack: function(response) {
                        $scope.companies = response.companies;
                        $scope.state.activeTab = 'RESTAURANT';
                    },
                    failureCallBack: function() {
                        $scope.errorMessage = ['Error while retrieving companies list.'];
                    }
                });
            }

            /**
             * ------------------ ------------------ ------------------ ------------------ ------------------ -------------
             * @param {Integer} companyId id of company whose name needs to be resolved
             * @returns {*} Company's name if found else '-'
             * ------------------ ------------------ ------------------ ------------------ ------------------ -------------
             */
            $scope.getCompanyName = function(companyId) {
                if ($scope.companies && $scope.companies.length) {
                    var company = _.findWhere($scope.companies, {id: parseInt(companyId, 10)});

                    if (!company) {
                        $log.warn('Corresponding company not returned from API for companyId: ' + companyId);

                    } else {
                        return company.name;
                    }
                }

                return '-';
            };

            /**
             * Initialization stuffs
             * @return {undefined}
             */
            (function() {
                $scope.state = {
                    activeTab: 'SETUP',
                    editRestaurant: null,
                    selected: null,
                    new: null
                };

                $scope.lightspeed = lightSpeedSetupValues;
            }());
        }]);
