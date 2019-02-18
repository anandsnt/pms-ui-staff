sntRover.controller('RVJournalPaymentController', ['$scope', '$rootScope', 'RVJournalSrv', '$timeout', function($scope, $rootScope, RVJournalSrv, $timeout) {
	BaseCtrl.call(this, $scope);
    $scope.errorMessage = "";

	$scope.setScroller('payment_content', {});
    var refreshPaymentScroll = function() {
        setTimeout(function() {
            $scope.refreshScroller('payment_content');
        }, 500);
    };

    $scope.addListener('REFRESHPAYMENTCONTENT', function() {
        refreshPaymentScroll();
    });

	var initPaymentData = function(origin) {
		var successCallBackFetchPaymentData = function(data) {
			$scope.data.paymentData = {};
            $scope.data.selectedPaymentType = '';
			$scope.data.paymentData = data;
			$scope.data.activePaymentTypes = data.payment_types;

            $scope.errorMessage = "";
			refreshPaymentScroll();
            if (origin !== "SUMMARY_DATE_CHANGED") {
                $scope.$emit('hideLoader');
            }
		};

        var postData = {
            "from_date": $scope.data.fromDate,
            "to_date": $scope.data.toDate,
            "employee_ids": $scope.data.selectedEmployeeList,
            "department_ids": $scope.data.selectedDepartmentList,
            "type": ($scope.data.activePaymentTab === "" ? "" : ($scope.data.activePaymentTab).toLowerCase())
        };

		$scope.invokeApi(RVJournalSrv.fetchPaymentDataByPaymentTypes, postData, successCallBackFetchPaymentData);
	};

	initPaymentData("");

    $scope.addListener('fromDateChanged', function() {
        initPaymentData("");
    });

    $scope.addListener('toDateChanged', function() {
        initPaymentData("");
    });

    // CICO-28060 : Update dates for Revenue & Payments upon changing summary dates
    $scope.addListener('REFRESH_REVENUE_PAYMENT_DATA', function( event, data ) {
        $scope.data.fromDate = data.date;
        $scope.data.toDate   = data.date;
        initPaymentData(data.origin);
    });

    // Load the transaction details
    var loadTransactionDeatils = function(chargeCodeItem, isFromPagination, pageNo) {

        chargeCodeItem.page_no = pageNo || 1;

        var successCallBackFetchPaymentDataTransactions = function(data) {

            chargeCodeItem.transactions = [];
            chargeCodeItem.transactions = data.transactions;
            chargeCodeItem.total_count = data.total_count;

            if (!isFromPagination && data.transactions.length > 0) {
                chargeCodeItem.active = !chargeCodeItem.active;
            }      

            $timeout(function () {
                var paginationID = chargeCodeItem.charge_code_id;

                $scope.$broadcast('updatePagination', paginationID );

                refreshPaymentScroll();
                $scope.errorMessage = "";
                $scope.$emit('hideLoader');

            }, 500 );
        };

        // Call api only while expanding the tab or on pagination Next/Prev button actions ..
        if (!chargeCodeItem.active || isFromPagination) {
            var postData = {
                "from_date": $scope.data.fromDate,
                "to_date": $scope.data.toDate,
                "charge_code_id": chargeCodeItem.charge_code_id,
                "employee_ids": $scope.data.selectedEmployeeList,
                "department_ids": $scope.data.selectedDepartmentList,
                "page_no": chargeCodeItem.page_no,
                "per_page": $scope.data.filterData.perPage,
                "type": ($scope.data.activePaymentTab === "" ? "" : ($scope.data.activePaymentTab).toLowerCase())
            };

            $scope.invokeApi(RVJournalSrv.fetchPaymentDataByTransactions, postData, successCallBackFetchPaymentDataTransactions);
        }
        else {
            chargeCodeItem.active = !chargeCodeItem.active;
        }
    };

    /** Handle Expand/Collapse of Level1 **/
    $scope.clickedFirstLevel = function(index1) {

        var toggleItem = $scope.data.paymentData.payment_types[index1];

        if (toggleItem.payment_type !== "Credit Card") {

            // pagination data object on level-3 for credit cards.
            toggleItem.paymentTypesPagination = {
                id: toggleItem.charge_code_id,
                api: [loadTransactionDeatils, toggleItem, true],
                perPage: $scope.data.filterData.perPage
            };

            loadTransactionDeatils(toggleItem, false);
        }
        else {
            // For Credit cards , level-2 data already exist , so just do expand/collapse only ..
            toggleItem.active = !toggleItem.active;
            refreshPaymentScroll();
        }
    };

    // Handle Expand/Collapse of Level2  Credit card section
    $scope.clickedSecondLevel = function(index1, index2) {

        var toggleItem = $scope.data.paymentData.payment_types[index1].credit_cards[index2];

        // pagination data object on level-3 for credit cards.
        toggleItem.creditCardPagination = {
            id: toggleItem.charge_code_id,
            api: [loadTransactionDeatils, toggleItem, true],
            perPage: $scope.data.filterData.perPage
        };

        loadTransactionDeatils(toggleItem, false);
    };

    /* To hide/show arrow button for Level1 */
    $scope.checkHasArrowFirstLevel = function(index) {
        var hasArrow = false,
        item = $scope.data.paymentData.payment_types[index];

        if ((typeof item.credit_cards !== 'undefined') && (item.credit_cards.length > 0)) {
            hasArrow = true;
        }
        else if ((typeof item.transactions !== 'undefined') && (item.transactions.length > 0)) {
            hasArrow = true;
        }
        return hasArrow;
    };

    /* To hide/show arrow button for Level2 */
    $scope.checkHasArrowSecondLevel = function(index1, index2) {
        var hasArrow = false,
        item = $scope.data.paymentData.payment_types[index1].credit_cards[index2].transactions;

        if ((typeof item !== 'undefined') && (item.length > 0)) {
            hasArrow = true;
        }
        return hasArrow;
    };

    // To hanlde click inside payment tab.
    $scope.clickedOnPayment = function($event) {
        $event.stopPropagation();
        if ($scope.data.isDrawerOpened) {
            $rootScope.$broadcast("CLOSEPRINTBOX");
        }
        $scope.errorMessage = "";
    };

    // Hanlde payment group active toggle
    $scope.clickedPaymentGroup = function( activePaymentTab ) {
        $scope.data.activePaymentTab = activePaymentTab;
        initPaymentData("");
    };

}]);