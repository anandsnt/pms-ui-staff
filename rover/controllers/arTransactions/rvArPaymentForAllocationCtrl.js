sntRover.controller('RVArPaymentForAllocationController', ['$scope', '$rootScope', '$stateParams', '$timeout',  'rvAccountsArTransactionsSrv', 'ngDialog', function($scope, $rootScope, $stateParams, $timeout, rvAccountsArTransactionsSrv, ngDialog ) {

    BaseCtrl.call(this, $scope);
    // Initialization
    var init = function() {
        $scope.setScroller('payment-allocation');
        fetchPaymentMethods();
    };
    // refresh scroller
    var refreshScroll = function() {
        $timeout(function() {
            $scope.refreshScroller('payment-allocation');
        }, 500);
    };
    // Function to fetch payment methods
    var fetchPaymentMethods = function() {
        var dataToApi = {
            id: $scope.arDataObj.accountId
        },
        successCallback = function (data) {
            $scope.payments = data.payments;
            refreshScroll();
            $scope.$emit('hideLoader');
        };

        $scope.invokeApi(rvAccountsArTransactionsSrv.fetchPaymentMethods, dataToApi, successCallback );
    };

    // Close popup
    $scope.closePopup = function () {
        ngDialog.close();
    };

    init();

}]);
