'use strict';

angular.module('admin').controller('adLightSpeedPaymentMapppingCtrl', ['$scope', 'adLightSpeedPOSSetupSrv', function ($scope, adLightSpeedPOSSetupSrv) {
    $scope.postingAccountMapings = [];
    $scope.nonMappedPaymentTypes = [];
    $scope.mappedPaymentTypes = [];
    $scope.paymentTypes = [];

    var initialize = function initialize() {
        $scope.data = {};
        $scope.fetchPostingAccounts();
    };

    var formParamsForPostingAccountExternalMappings = function() {
        var selectedPaymentTypes = $scope.mappedPaymentTypes.map(function (paymentType) {
            return { name: paymentType.name,
                     id: paymentType.id };
        });

        return { posting_account_id: $scope.data.selectedPostingAccount.posting_account_id,
                  selected_payment_types: selectedPaymentTypes
       };
    };

    $scope.fetchPostingAccounts = function() {
        $scope.callAPI(adLightSpeedPOSSetupSrv.fetchAccounts, {
            successCallBack: function successCallBack(response) {
                $scope.data.selectedPostingAccount = response.posting_accounts[0];
                $scope.data.filteredPaymentType = '';
                $scope.postingAccounts = response.posting_accounts;
                fetchPaymentTypes();
            },
            failureCallBack: function failureCallBack() {
                $scope.errorMessage = ['Error while retrieving Posting Accounts list.'];
            }
        });
    };

    var fetchPaymentTypes = function() {
        $scope.callAPI(adLightSpeedPOSSetupSrv.fetchPaymentTypes, {
            successCallBack: function successCallBack(response) {
                $scope.paymentTypes = response;
                $scope.fetchPostingAccountMapings();
            },
            failureCallBack: function failureCallBack() {
                $scope.errorMessage = ['Error while retrieving paymenty types list.'];
            }
        });
    };

    $scope.fetchPostingAccountMapings = function() {
        $scope.callAPI(adLightSpeedPOSSetupSrv.fetchPostingAccountMapings, {
            successCallBack: function successCallBack(response) {
                $scope.postingAccountMapings = response;
                $scope.filterMappedAndNonMappedPaymentTypes();
            },
            failureCallBack: function failureCallBack() {
                $scope.errorMessage = ['Error while retrieving posting account mappings'];
            }
        });
    };

    $scope.filterMappedAndNonMappedPaymentTypes = function () {
        $scope.nonMappedPaymentTypes = $scope.paymentTypes.filter(function (paymentType) {
            return !$scope.postingAccountMapings.some(function (postingAccountMapping) {
                return parseInt(postingAccountMapping.external_value) === paymentType.id;
            });
        });
        $scope.mappedPaymentTypes = $scope.paymentTypes.filter(function (paymentType) {
            return $scope.postingAccountMapings.some(function (postingAccountMapping) {
                return parseInt(postingAccountMapping.external_value) === parseInt(paymentType.id) && parseInt($scope.data.selectedPostingAccount.posting_account_id) === parseInt(postingAccountMapping.value);
            });
        });
        if ($scope.data.filteredPaymentType.length > 0) {
            $scope.nonMappedPaymentTypes = $scope.nonMappedPaymentTypes.filter(function (paymentType) {
                return paymentType.name.includes($scope.data.filteredPaymentType);
            });
        }
    };

    $scope.savePaymentTypeExternalMappings = function () {
        $scope.callAPI(adLightSpeedPOSSetupSrv.savePostingAccountMapings, {
            params: formParamsForPostingAccountExternalMappings(),
            successCallBack: function successCallBack() {
                $scope.fetchPostingAccountMapings();
            },
            failureCallBack: function failureCallBack() {
                $scope.errorMessage = ['Error while saving posting account external mappings'];
            }
        });
    };

    $scope.filterNonMappedPaymentTypes = function () {
        $scope.filterMappedAndNonMappedPaymentTypes();
    };

    initialize();
}]);
