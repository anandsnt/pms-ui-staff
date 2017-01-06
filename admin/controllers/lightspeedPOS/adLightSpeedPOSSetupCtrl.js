admin.controller('adLightSpeedPOSSetupCtrl', ['$scope', 'lightSpeedSetupValues', 'adLightSpeedPOSSetupSrv', '$timeout',
    function($scope, lightSpeedSetupValues, adLightSpeedPOSSetupSrv, $timeout) {

        BaseCtrl.call(this, $scope);

        var successCallBackOfLightSpeedPOSSetup = function() {
            $scope.goBackToPreviousState();
        }, clearConfigValues = function() {
            $scope.lightspeed.charge_code_id = '';
            $scope.lightspeed.charge_code_name = '';
        }, clearPaymentChargeCodeValues = function() {
            $scope.lightspeed.payment_charge_code_id = '';
            $scope.lightspeed.payment_charge_code_name = '';
        }, revertEdit = function() {
            if ($scope.state.editRestaurant) {
                $scope.lightspeed.restaurants[$scope.state.selected] = angular.copy($scope.state.editRestaurant);
                $scope.state.editRestaurant = null;
            }
        }, resetNew = function() {
            $scope.state.new = {
                name: "",
                username: "",
                password: ""
            };
        }, refreshSettings = function(cb) {
            $scope.callAPI(adLightSpeedPOSSetupSrv.fetchLightSpeedPOSConfiguration, {
                successCallBack: function(settings) {
                    $scope.lightspeed = settings;
                    cb && _.isFunction(cb) && cb();
                }
            });
        };


        $scope.$on("showErrorMessage", function($event, errorMessage) {
            $event.stopPropagation();
            $scope.errorMessage = errorMessage;
        });

        $scope.toggleLightSpeedPOSEnabled = function() {
            $scope.lightspeed.enabled = !$scope.lightspeed.enabled;
        };

        $scope.onUpdate = function() {
            $scope.saveLightSpeedPOSSetup(function() {
                refreshSettings($scope.onCancelEdit);
            });
        };

        /**
         * when we clicked on save button
         * @return {undefined}
         */
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

        $scope.onSelect = function(idx, restaurant) {
            $scope.state.editRestaurant = angular.copy(restaurant);
            $scope.state.selected = idx;
        };

        $scope.onClickAdd = function() {
            $scope.state.mode = "ADD";
            $scope.state.selected = null;
            resetNew();
        };


        $scope.onClickDelete = function(restaurant) {
            $scope.callAPI(adLightSpeedPOSSetupSrv.deleteRestaurant, {
                params: restaurant.id,
                successCallBack: function() {
                    refreshSettings();
                }
            });
        };

        /**
         * Method to close the edit form
         */
        $scope.onCancelEdit = function() {
            $scope.state.mode = "";
            revertEdit();
            $scope.state.selected = null;
        };

        $scope.onCancelAdd = function() {
            $scope.state.mode = "";
        };

        $scope.onSave = function() {
            $scope.lightspeed.restaurants.push(angular.copy($scope.state.new));
            $scope.saveLightSpeedPOSSetup(function() {
                refreshSettings($scope.onCancelAdd);
            });
        };

        /**
         * Initialization stuffs
         * @return {undefined}
         */
        (function() {
            $scope.state = {
                editRestaurant: null,
                selected: null,
                new: null
            };

            $scope.lightspeed = lightSpeedSetupValues;
        }());
    }]);