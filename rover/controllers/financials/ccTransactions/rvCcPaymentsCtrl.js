sntRover.controller('RVccPaymentsController', ['$scope', '$filter', '$stateParams', 'ngDialog', '$rootScope', 'RVccTransactionsSrv', '$timeout', function($scope, $filter, $stateParams, ngDialog, $rootScope, RVccTransactionsSrv, $timeout) {

	BaseCtrl.call(this, $scope);

	$scope.setScroller('payment_content', {});
    var refreshPaymentScroll = function() {
        setTimeout(function() {
            $scope.refreshScroller('payment_content');
        }, 500);
    };

    refreshPaymentScroll();

	var initPaymentData = function() {
		var successCallBackFetchPaymentData = function(data) {
			$scope.data.paymentData = {};
			$scope.data.paymentData = data;
            $scope.errorMessage = "";
            $scope.$emit('hideLoader');
            refreshPaymentScroll();
		};

		$scope.invokeApi(RVccTransactionsSrv.fetchPayments, { "date": $scope.data.transactionDate }, successCallBackFetchPaymentData);
	};

	initPaymentData();

	// Handle change transaction date
    $scope.$on('transactionDateChanged', function() {
        initPaymentData();
    });

    // Handle error message from parent
    $scope.$on('showErrorMessage', function(event, data) {
        $scope.errorMessage = data;
    });

	$scope.clickedApprovedTab = function() {
		if (isEmptyObject($scope.data.paymentData.approved)) {
			return false;
		}
		$scope.data.paymentData.approved.active = !$scope.data.paymentData.approved.active;
		refreshPaymentScroll();
	};

	$scope.clickedDeclinedTab = function() {
		if (isEmptyObject($scope.data.paymentData.declined)) {
			return false;
		}
		$scope.data.paymentData.declined.active = !$scope.data.paymentData.declined.active;
		refreshPaymentScroll();
	};

	$scope.clickedApprovedTransactionItem = function(item) {
		if (item.cc_transactions.length === 0) {
			return false;
		}
		item.active = !item.active;
		refreshPaymentScroll();
	};

	$scope.clickedDeclinedTransactionItem = function(item) {
		if (item.cc_transactions.length === 0) {
			return false;
		}
		item.active = !item.active;
		refreshPaymentScroll();
	};

	$scope.$on('mainTabSwiched', function() {
		if ($scope.data.activeTab === 0) {
			refreshPaymentScroll();
		}
    });

}]);