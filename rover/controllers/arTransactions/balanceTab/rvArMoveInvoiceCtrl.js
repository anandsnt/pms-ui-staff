sntRover.controller('rvArMoveInvoiceCtrl', ['$scope', 'ngDialog', 'rvAccountsArTransactionsSrv', function($scope, ngDialog, rvAccountsArTransactionsSrv ) {

    BaseCtrl.call(this, $scope);
    /**
     * Setting up scroller with refresh options..
     */
    $scope.setScroller('arMoveInvoiceListScroll', {});

    var refreshScroll = function() {
        setTimeout(function() {
            $scope.refreshScroller('arMoveInvoiceListScroll');
        }, 500);
    };

    refreshScroll();

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

    if ( $scope.contactInformation && $scope.contactInformation.account_details) {

        var accountData = $scope.contactInformation.account_details,
            addressData = $scope.contactInformation.address_details;

        $scope.moveInvoiceData.fromAccount = {
            accountName: accountData.account_name,
            accountNumber: accountData.account_number,
            arNumber: accountData.accounts_receivable_number,
            type: $scope.contactInformation.accountType,
            location: addressData.city
        }
    }


    /*
     *   Method to initialize the AR Overview Data set.
     */  
    var getSearchResult = function( pageNo ) {

        $scope.moveInvoiceData.page = !!pageNo ? pageNo : 1;

        var successCallBack = function(data) {

            $scope.moveInvoiceData.searchResult = data;

            $scope.errorMessage = "";
            $scope.$emit('hideLoader');
            refreshScroll();
            $scope.$broadcast('updatePagination', 'ACCOUNT_LIST' );
        };

        var params = {
            'query': $scope.moveInvoiceData.query,
            'page': $scope.moveInvoiceData.page,
            'per_page': $scope.moveInvoiceData.perPage
        };

        $scope.invokeApi(rvAccountsArTransactionsSrv.fetchAccountsReceivables, params, successCallBack );
    };

    // Filter block starts here ..
    $scope.changedSearchQuery = function() {

        if ($scope.moveInvoiceData.query.length > 2 ) {
            getSearchResult();
        }
        else {
            $scope.moveInvoiceData.searchResult = {};
        }
    };
    // Clear search query.
    $scope.clearSearchQuery = function() {
        $scope.moveInvoiceData.query = '';
        $scope.moveInvoiceData.searchResult = {};
    };
    // Select one card.
    $scope.clickedOnCard = function( selectedCard ) {
        console.log(selectedCard);
        $scope.moveInvoiceData.isConfirmInvoiceMoveScreen = true;
        $scope.moveInvoiceData.selectedAccount = {};
    };

    // Pagination options for ACCOUNT_LIST
    $scope.accountListPagination = {
        id: 'ACCOUNT_LIST',
        api: getSearchResult,
        perPage: $scope.moveInvoiceData.perPage
    };

    // Show pagination or not.
    $scope.showPagination = function() {
        var showPagination = false,
            searchResult = $scope.moveInvoiceData.searchResult,
            isConfirmInvoiceMoveScreen = $scope.moveInvoiceData.isConfirmInvoiceMoveScreen;
        
        if(isConfirmInvoiceMoveScreen) {
            showPagination = false;
        }
        else if ( searchResult && searchResult.accounts.length > 0 &&  (searchResult.total_result > searchResult.accounts.length) ) {
            showPagination = true;
        }
        return showPagination;
    };

    // Change button click
    $scope.changeButtonClick = function() {
        $scope.moveInvoiceData.isConfirmInvoiceMoveScreen = false;
        $scope.moveInvoiceData.selectedAccount = {};
    };
    // Close dialog.
    $scope.closeDialog = function() {
        ngDialog.close();
    };
    // Move Invoice button click..
    $scope.moveInvoiceButtonClick = function() {
        console.log("Move Invoice button click..");
    };

}]);
