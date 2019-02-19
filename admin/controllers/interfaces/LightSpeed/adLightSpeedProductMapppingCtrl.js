'use strict';

angular.module('admin').controller('adLightSpeedProductMapppingCtrl', ['$scope', 'adLightSpeedPOSSetupSrv', 'ADChargeCodesSrv', function ($scope, adLightSpeedPOSSetupSrv, ADChargeCodesSrv) {
    $scope.chargeCodeMapings = [];
    $scope.nonMappedProducts = [];
    $scope.mappedProducts = [];
    $scope.products = [];

    var initialize = function initialize() {
        $scope.data = {};
        if ($scope.lightspeed.floors_enabled) {
            fetchRestaurants();
        } else {
            $scope.fetchChargeCodes();
        }
    };

    var formParamsForExternalMappings = function() {
        var charge_code_id = $scope.data.selectedChargeCode;
        var selectedProducts = $scope.mappedProducts.map(function (product) {
            return { name: product.name,
                     sku: product.sku,
                     id: product.id };
        });

        if ($scope.lightspeed.floors_enabled) {
            return {
                      charge_code_id: charge_code_id,
                      selected_products: selectedProducts,
                      floor_id: $scope.data.selectedFloor.id,
                      company_id: $scope.data.selectedRestaurant.company_id
                   };
        } 
            return {
                      charge_code_id: charge_code_id,
                      selected_products: selectedProducts
                    };
        
    };

    $scope.fetchChargeCodes = function() {
       $scope.callAPI(ADChargeCodesSrv.fetch, {
           params: {
             is_no_pagination: true
           },
           successCallBack: function successCallBack(response) {
               $scope.data.filteredProduct = '';
               $scope.chargeCodes = response.charge_codes;
               $scope.data.selectedChargeCode = response.charge_codes[0].value;
               fetchProducts();
           },
           failureCallBack: function failureCallBack() {
               $scope.errorMessage = ['Error while retrieving Restaurants list.'];
           }
       });
    };

    var fetchRestaurants = function() {
        $scope.callAPI(adLightSpeedPOSSetupSrv.fetchRestaurants, {
            successCallBack: function successCallBack(response) {
                $scope.data.selectedRestaurant = response[0];
                $scope.restaurants = response;
                $scope.fetchFloors();
            },
            failureCallBack: function failureCallBack() {
                $scope.errorMessage = ['Error while retrieving products list.'];
            }
        });
    };

    $scope.fetchFloors = function() {
        $scope.callAPI(adLightSpeedPOSSetupSrv.fetchFloors, {
            params: {
                        'id': $scope.data.selectedRestaurant.id
                    },
            successCallBack: function successCallBack(response) {
                $scope.data.selectedFloor = response.status[0];
                $scope.floors = response.status;
                $scope.fetchChargeCodes();
            },
            failureCallBack: function failureCallBack() {
                $scope.errorMessage = ['Error while retrieving products list.'];
            }
        });
    };

    var fetchProducts = function() {
        $scope.callAPI(adLightSpeedPOSSetupSrv.fetchProducts, {
            params: $scope.lightspeed.floors_enabled ? {
                        restaurant_id: $scope.data.selectedRestaurant.id
                        } : {},
            successCallBack: function successCallBack(response) {
                $scope.products = response;
                $scope.fetchChargeCodeMapings();
            },
            failureCallBack: function failureCallBack() {
                $scope.errorMessage = ['Error while retrieving products list.'];
            }
        });
    };

    $scope.fetchChargeCodeMapings = function() {
        $scope.callAPI(adLightSpeedPOSSetupSrv.fetchChargeCodeMapings, {
            params: $scope.lightspeed.floors_enabled ? {
                        floor_id: $scope.data.selectedFloor.id,
                        company_id: $scope.data.selectedRestaurant.company_id
                        } : {},
            successCallBack: function successCallBack(response) {
                $scope.chargeCodeMapings = response;
                $scope.filterMappedAndNonMappedProducts();
            },
            failureCallBack: function failureCallBack() {
                $scope.errorMessage = ['Error while retrieving charge code mappings'];
            }
        });
    };

    $scope.filterMappedAndNonMappedProducts = function () {
        $scope.$emit('showLoader');
        $scope.nonMappedProducts = $scope.products.filter(function (product) {
            return !$scope.chargeCodeMapings.some(function (chargeCodeMapping) {
                return parseInt(chargeCodeMapping.external_value) === product.id;
            });
        });
        $scope.mappedProducts = $scope.products.filter(function (product) {
            return $scope.chargeCodeMapings.some(function (chargeCodeMapping) {
                if ($scope.data.selectedChargeCode === null) {
                    $scope.data.selectedChargeCode = $scope.chargeCodes[0].value;
                }
                var chargeCodeObject = _.findWhere($scope.chargeCodes, {value: $scope.data.selectedChargeCode});

                return parseInt(chargeCodeMapping.external_value) === product.id && chargeCodeObject.charge_code === chargeCodeMapping.value;
            });
        });
        if ($scope.data.filteredProduct.length > 0) {
            $scope.nonMappedProducts = $scope.nonMappedProducts.filter(function (product) {
                return product.name.includes($scope.data.filteredProduct);
            });
        }
        $scope.$emit('hideLoader');
    };

    $scope.saveExternalMappings = function () {
        $scope.callAPI(adLightSpeedPOSSetupSrv.saveChargeCodeMapings, {
            params: formParamsForExternalMappings(),
            successCallBack: function successCallBack() {
                $scope.fetchChargeCodeMapings();
            },
            failureCallBack: function failureCallBack() {
                $scope.errorMessage = ['Error while saving external mappings'];
            }
        });
    };

    $scope.filterNonMappedProducts = function () {
        $scope.filterMappedAndNonMappedProducts();
    };

    initialize();
}]);
