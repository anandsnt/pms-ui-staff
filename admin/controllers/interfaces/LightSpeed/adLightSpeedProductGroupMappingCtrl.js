'use strict';

angular.module('admin').controller('adLightSpeedProductGroupMappingCtrl', ['$scope', 'adLightSpeedPOSSetupSrv', 'ADChargeCodesSrv', function ($scope, adLightSpeedPOSSetupSrv, ADChargeCodesSrv) {
    $scope.chargeCodeMapings = [];
    $scope.nonMappedProductGroups = [];
    $scope.mappedProductGroups = [];
    $scope.productGroups = [];

    var initialize = function initialize() {
        $scope.data = {};
        if ($scope.lightspeed.floors_enabled) {
            fetchRestaurants();
        } else {
            $scope.fetchChargeCodes();
        }
    };

    var formParamsForExternalMappings = function() {
        var charge_code_id = JSON.parse($scope.data.selectedChargeCode).value;
        var selectedProductGroups = $scope.mappedProductGroups.map(function (productGroup) {
            return {
              name: productGroup.name,
              id: productGroup.id
          };
        });

        if ($scope.lightspeed.floors_enabled) {
            return {
                      charge_code_id: charge_code_id,
                      selected_product_groups: selectedProductGroups,
                      floor_id: $scope.data.selectedFloor.id,
                      company_id: $scope.data.selectedRestaurant.company_id
                   };
        }
            return {
                      charge_code_id: charge_code_id,
                      selected_product_groups: selectedProductGroups
                    };

    };

    $scope.fetchChargeCodes = function() {
       $scope.callAPI(ADChargeCodesSrv.fetch, {
           params: {
             is_no_pagination: true
           },
           successCallBack: function successCallBack(response) {
               $scope.data.filteredProductGroup = '';
               $scope.chargeCodes = response.charge_codes;
               $scope.data.selectedChargeCode = JSON.stringify(response.charge_codes[0]);
               fetchProductGroup();
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
                $scope.errorMessage = ['Error while retrieving restaurants list.'];
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
                $scope.errorMessage = ['Error while retrieving floors list.'];
            }
        });
    };

    var fetchProductGroup = function() {
        $scope.callAPI(adLightSpeedPOSSetupSrv.fetchProductGroups, {
            params: $scope.lightspeed.floors_enabled ? {
                        restaurant_id: $scope.data.selectedRestaurant.id
                        } : {},
            successCallBack: function successCallBack(response) {
                $scope.productGroups = response;
                $scope.fetchChargeCodeMapings();
            },
            failureCallBack: function failureCallBack() {
                $scope.errorMessage = ['Error while retrieving product groups list.'];
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
                $scope.filterMappedAndNonMappedProductGroups();
            },
            failureCallBack: function failureCallBack() {
                $scope.errorMessage = ['Error while retrieving charge code mappings'];
            }
        });
    };

    $scope.filterMappedAndNonMappedProductGroups = function () {
        $scope.$emit('showLoader');
        $scope.nonMappedProductGroups = $scope.productGroups.filter(function (productGroup) {
            return !$scope.chargeCodeMapings.some(function (chargeCodeMapping) {
                return chargeCodeMapping.external_value === productGroup.name;
            });
        });
        $scope.mappedProductGroups = $scope.productGroups.filter(function (productGroup) {
            return $scope.chargeCodeMapings.some(function (chargeCodeMapping) {
                return chargeCodeMapping.external_value === productGroup.name && JSON.parse($scope.data.selectedChargeCode).charge_code === chargeCodeMapping.value;
            });
        });
        if ($scope.data.filteredProductGroup.length > 0) {
            $scope.nonMappedProductGroups = $scope.nonMappedProductGroups.filter(function (productGroup) {
                return productGroup.name.includes($scope.data.filteredProductGroup);
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

    $scope.filterNonMappedProductGroups = function () {
        $scope.filterMappedAndNonMappedProductGroups();
    };

    initialize();
}]);
