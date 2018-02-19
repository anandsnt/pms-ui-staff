'use strict';

angular.module('admin').controller('adLightSpeedProductMapppingCtrl', ['$scope', 'adLightSpeedPOSSetupSrv', 'ADChargeCodesSrv', function ($scope, adLightSpeedPOSSetupSrv, ADChargeCodesSrv) {
    $scope.chargeCodeMapings = [];
    $scope.nonMappedProducts = [];
    $scope.mappedProducts = [];
    $scope.products = [];

    var initialize = function initialize() {
        $scope.callAPI(ADChargeCodesSrv.fetch, {
            params: {
                is_no_pagination: true
            },
            successCallBack: function successCallBack(response) {
                $scope.data = {};
                $scope.data.selectedChargeCode = response.charge_codes[0];
                $scope.data.filteredProduct = '';
                $scope.chargeCodes = response.charge_codes;
                fetchProducts();
            },
            failureCallBack: function failureCallBack() {
                $scope.errorMessage = ['Error while retrieving Restaurants list.'];
            }
        });
    };

    var fetchProducts = function fetchProducts() {
        $scope.callAPI(adLightSpeedPOSSetupSrv.fetchProducts, {
            successCallBack: function successCallBack(response) {
                $scope.products = response;
                fetchChargeCodeMapings();
            },
            failureCallBack: function failureCallBack() {
                $scope.errorMessage = ['Error while retrieving products list.'];
            }
        });
    };

    var fetchChargeCodeMapings = function fetchChargeCodeMapings() {
        $scope.callAPI(adLightSpeedPOSSetupSrv.fetchChargeCodeMapings, {
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
                return parseInt(chargeCodeMapping.external_value) === product.id && $scope.data.selectedChargeCode.charge_code === chargeCodeMapping.value;
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
        var charge_code_id = $scope.data.selectedChargeCode.value;
        var selectedProducts = $scope.mappedProducts.map(function (product) {
            return { name: product.name, sku: product.sku, id: product.id };
        });

        $scope.callAPI(adLightSpeedPOSSetupSrv.saveChargeCodeMapings, {
            params: {
                charge_code_id: charge_code_id,
                selected_products: selectedProducts
            },
            successCallBack: function successCallBack() {
                fetchChargeCodeMapings();
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
