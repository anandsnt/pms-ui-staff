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
        selectedAccount: {},
        query: '',
        perPage: 5,
        page: 1
    };

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
    };
    // Clear search query.
    $scope.clearSearchQuery = function() {
        $scope.moveInvoiceData.query = '';
    };
    // Select one card.
    $scope.clickedOnCard = function( selectedCard ) {
        console.log(selectedCard);
        $scope.moveInvoiceData.isConfirmInvoiceMoveScreen = true;
    };

    // Pagination options for ACCOUNT_LIST
    $scope.accountListPagination = {
        id: 'ACCOUNT_LIST',
        api: [ getSearchResult, 'ACCOUNT_LIST' ],
        perPage: $scope.moveInvoiceData.perPage
    };

}]);
