sntRover.controller('rvArMoveInvoiceCtrl', ['$scope', 'ngDialog', 'rvAccountsArTransactionsSrv', '$timeout', function($scope, ngDialog, rvAccountsArTransactionsSrv, $timeout) {

    BaseCtrl.call(this, $scope);
    /**
     * Setting up scroller with refresh options..
     */
    $scope.setScroller('arMoveInvoiceListScroll', {});
    // refresh scroller.
    var refreshScroll = function() {
        setTimeout(function() {
            $scope.refreshScroller('arMoveInvoiceListScroll');
        }, 500);
    };
    // Initialization.
    var init = function () {
        // Data set ninitialization
        $scope.moveInvoiceData = {
            isConfirmInvoiceMoveScreen: false,
            searchResult: {},
            fromAccount: {},
            toAccount: {},
            query: '',
            perPage: 5,
            page: 1
        };
        // Setting up the account ( COMPANY/TA Card ) details
        if ( $scope.contactInformation && $scope.contactInformation.account_details ) {

            var accountData = $scope.contactInformation.account_details,
                addressData = $scope.contactInformation.address_details;

            // Mapping moving FROM account details.
            $scope.moveInvoiceData.fromAccount = {
                id: $scope.contactInformation.id,
                accountName: accountData.account_name,
                accountNumber: accountData.account_number,
                arNumber: accountData.accounts_receivable_number,
                type: $scope.contactInformation.accountType || accountData.account_type,
                location: addressData.city || addressData.location,
                ageingDate: accountData.ageing_date
            };
        }

        // Pagination options for ACCOUNT_LIST
        $scope.accountListPagination = {
            id: 'ACCOUNT_LIST',
            api: getSearchResult,
            perPage: $scope.moveInvoiceData.perPage
        };

        refreshScroll();
    };

    /*
     *   Method to initialize the AR Overview Data set.
     */  
    var getSearchResult = function( pageNo ) {

        $scope.moveInvoiceData.page = !!pageNo ? pageNo : 1;

        var dataToSend = {
            params: {
                'query': $scope.moveInvoiceData.query,
                'page': $scope.moveInvoiceData.page,
                'per_page': $scope.moveInvoiceData.perPage
            },
            successCallBack: function( data ) {
                $scope.moveInvoiceData.searchResult = data;
                $scope.errorMessage = '';
                refreshScroll();
                $timeout(function () {
                    $scope.$broadcast('updatePagination', 'ACCOUNT_LIST');
                }, 1000);
            },
            failureCallBack: function( errorMessage ) {
                $scope.errorMessage = errorMessage;
            }
        };

        $scope.callAPI(rvAccountsArTransactionsSrv.fetchAccountsReceivables, dataToSend );
    };

    // Search by query handled here.
    $scope.changedSearchQuery = function() {
        var queryLength = $scope.moveInvoiceData.query.length;

        if (queryLength > 2 ) {
            getSearchResult();
        }
        else if (queryLength === 0 ) {
            $scope.moveInvoiceData.searchResult = {};
            refreshScroll();
        }
    };
    // Clear search query.
    $scope.clearSearchQuery = function() {
        $scope.moveInvoiceData.query = '';
        $scope.moveInvoiceData.searchResult = {};
    };
    // Select one card.
    $scope.clickedOnCard = function( selectedCard ) {
        $scope.moveInvoiceData.isConfirmInvoiceMoveScreen = true;
        // Mapping moving TO account data.
        $scope.moveInvoiceData.toAccount = {
            id: selectedCard.id,
            accountName: selectedCard.account_name,
            accountNumber: selectedCard.account_number,
            arNumber: selectedCard.ar_number,
            type: selectedCard.type,
            location: selectedCard.location,
            ageingDate: selectedCard.ageing_date
        };
    };

    // Show pagination or not.
    $scope.showPagination = function() {
        var showPagination = false,
            searchResult = $scope.moveInvoiceData.searchResult,
            isConfirmInvoiceMoveScreen = $scope.moveInvoiceData.isConfirmInvoiceMoveScreen;

        if ( typeof searchResult !== 'undefined' && typeof searchResult.accounts !== 'undefined' ) {
            if ( searchResult.accounts.length > 0 && !isConfirmInvoiceMoveScreen ) {
                showPagination = true;
            }
        }
        return showPagination;
    };

    // Change button click
    $scope.changeButtonClick = function() {
        $scope.moveInvoiceData.isConfirmInvoiceMoveScreen = false;
        $scope.moveInvoiceData.toAccount = {};
    };
    // Close dialog.
    $scope.closeDialog = function() {
        ngDialog.close();
    };
    // Move Invoice button click..
    $scope.moveInvoiceButtonClick = function() {

        var dataToSend = {
            params: {
                'account_id': $scope.moveInvoiceData.fromAccount.id,
                'to_account_id': $scope.moveInvoiceData.toAccount.id,
                'transaction_id': $scope.moveInvoiceData.transactionId
            },
            successCallBack: function() {
                $scope.moveInvoiceData.isConfirmInvoiceMoveScreen = false;
                $scope.$emit('REFRESH_BALANCE_LIST');
                $scope.errorMessage = '';
            },
            failureCallBack: function( errorMessage ) {
                $scope.errorMessage = errorMessage;
            }
        };

        $scope.callAPI(rvAccountsArTransactionsSrv.moveInvoice, dataToSend );
    };

    init();

}]);
