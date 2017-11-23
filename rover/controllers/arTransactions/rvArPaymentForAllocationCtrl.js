sntRover.controller('RVArPaymentForAllocationController', 
    ['$scope', 
    '$rootScope', 
    '$stateParams', 
    '$timeout',  
    'rvAccountsArTransactionsSrv', 
    'sntActivity', 
    'ngDialog', function($scope, $rootScope, $stateParams, $timeout, rvAccountsArTransactionsSrv, sntActivity, ngDialog ) {

    BaseCtrl.call(this, $scope);

    // Initialization
    var init = function() {
        $scope.setScroller('payment-allocation');
        if ($scope.type === 'REFUND') {
            fetchRefundPaymentMethods();
        } else {
            fetchPaymentMethods();
        }
        
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
    // Successcallbackof listing popup
    var successCallbackOfGetAllocatedAPI = function(data) {
        $scope.payments = data.ar_transactions;
        refreshScroll();
        sntActivity.stop("REFUND_LIST");
    };

    // Function to fetch payments done
    var fetchRefundPaymentMethods = function() {
        var dataToSend = {
             account_id: $scope.arDataObj.accountId,
             getParams: {
                 per_page: 1000,
                 page: 1,
                 transaction_type: 'PAYMENTS',
                 allocated: false
             }
         };
         
        sntActivity.start("REFUND_LIST");
        $scope.invokeApi(rvAccountsArTransactionsSrv.fetchTransactionDetails, dataToSend, successCallbackOfGetAllocatedAPI );
    };

    // Close popup
    $scope.closePopup = function () {
        ngDialog.close();
    };
    // Clicked refund button from list popup
    $scope.clickedRefundButton = function(payment) {        

        $scope.$emit("CLICKED_REFUND_BUTTON", payment);
        $scope.closePopup();
    };

    init();

}]);
